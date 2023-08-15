import { Col, Collapse, Row, Typography } from "antd";
import { useRouter } from "next/router";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useGetVideoQuery } from "../../redux/features/videos/videosApi";

const VideoTab = () => {
    const router = useRouter();
    const videoId = router.query.id as string;

    const {
        data: video,
        isLoading: isGetVideoLoading,
        error: getVideoError,
    } = useGetVideoQuery(videoId as string, {
        refetchOnMountOrArgChange: true,
        skip: !videoId,
    });

    return (
        !isGetVideoLoading &&
        !getVideoError &&
        video && (
            <Row>
                <Col
                    xs={{
                        span: 24,
                    }}
                    md={{
                        span: 0,
                    }}
                >
                    <Collapse ghost expandIconPosition="end">
                        <Collapse.Panel
                            header={
                                <Typography.Title level={4}>
                                    <ReactMarkdown>
                                        {video.title ? video.title : "No title"}
                                    </ReactMarkdown>
                                </Typography.Title>
                            }
                            key="1"
                        >
                            <Typography.Paragraph>
                                {video.description ? (
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {video.description}
                                    </ReactMarkdown>
                                ) : (
                                    "No description"
                                )}
                            </Typography.Paragraph>
                        </Collapse.Panel>
                    </Collapse>
                </Col>
                <Col
                    xs={{
                        span: 0,
                    }}
                    md={{
                        span: 24,
                    }}
                >
                    <Typography.Title level={4}>
                        <ReactMarkdown>
                            {video.title ? video.title : "No title"}
                        </ReactMarkdown>
                    </Typography.Title>
                    <Typography.Paragraph>
                        {video.description ? (
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {video.description}
                            </ReactMarkdown>
                        ) : (
                            "No description"
                        )}
                    </Typography.Paragraph>
                </Col>
            </Row>
        )
    );
};

export default VideoTab;
