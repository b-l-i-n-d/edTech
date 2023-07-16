import { CheckCircleFilled, PlayCircleOutlined } from "@ant-design/icons";
import { List, Typography } from "antd";
import { useRouter } from "next/router";
import VirtualList from "rc-virtual-list";
import { useEffect, useState } from "react";
import { apiConfig } from "../../configs";
import { IVideo } from "../../interfaces";
import { useLazyGetVideosQuery } from "../../redux/features/videos/videosApi";

const VideoList = () => {
    const router = useRouter();
    const videoId = router.query.id;
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [listData, setListData] = useState<IVideo[]>([]);

    const [
        getVideos,
        { data: videos, isLoading: isGetVideosLoading, error: getVideosError },
    ] = useLazyGetVideosQuery();

    const handleScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
        const { target }: any = e;
        if (
            target.scrollTop + target.clientHeight + 1 >= target.scrollHeight &&
            !isGetVideosLoading &&
            !getVideosError &&
            videos &&
            videos.totalResults > listData.length
        ) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    useEffect(() => {
        getVideos({
            page: currentPage,
            limit: apiConfig.PAGE_SIZE,
        });
    }, [currentPage, getVideos]);

    useEffect(() => {
        if (!isGetVideosLoading && !getVideosError && videos) {
            setListData((prevOptions) => {
                const newOptions = [...prevOptions, ...videos.results];

                const uniqueOptions = newOptions.filter(
                    (option, index, self) =>
                        index === self.findIndex((t) => t.id === option.id)
                );

                return uniqueOptions;
            });
        }
    }, [isGetVideosLoading, getVideosError, videos]);

    return (
        <List
            className="border-2 rounded-lg"
            header={
                <Typography.Title level={5} className="px-4 pt-4">
                    Total Videos: {videos?.totalResults} - Progress :{" "}
                </Typography.Title>
            }
            size="small"
        >
            <VirtualList
                className="pb-4"
                data={listData}
                height={420}
                itemHeight={30}
                itemKey="id"
                onScroll={handleScroll}
            >
                {(item: IVideo) => (
                    <List.Item
                        className={
                            videoId === item.id
                                ? "bg-blue-100/70"
                                : "hover:bg-gray-100"
                        }
                        key={item.id}
                        style={{
                            paddingInline: "16px",
                            cursor: "pointer",
                        }}
                        onClick={() => router.push(`/course/${item.id}`)}
                    >
                        <List.Item.Meta
                            avatar={
                                <PlayCircleOutlined
                                    style={{
                                        fontSize: "24px",
                                        marginTop: "8px",
                                    }}
                                />
                            }
                            title={
                                <Typography.Text strong ellipsis>
                                    {item.title}
                                </Typography.Text>
                            }
                            description={`${new Date(item.duration * 1000)
                                .toISOString()
                                .substring(11, 19)} miniutes`}
                        />
                        <div>
                            <CheckCircleFilled
                                className="text-green-500"
                                style={{
                                    fontSize: "16px",
                                }}
                            />
                        </div>
                    </List.Item>
                )}
            </VirtualList>
        </List>
    );
};

export default VideoList;
