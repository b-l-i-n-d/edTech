import { Card, Col, Row, Statistic, Typography } from "antd";
import Head from "next/head";
import { Auth } from "../../components";
import { useAppSelector } from "../../hooks";
import { selectUser } from "../../redux/features/auth/authSelector";
import { useGetVideosQuery } from "../../redux/features/videos/videosApi";

const Dashboard = () => {
    const user = useAppSelector(selectUser);
    const {
        data: videos,
        isLoading: isGetVideosLoading,
        error: getVideosError,
    } = useGetVideosQuery({});

    return (
        <Auth.UserOnly>
            <Head>
                <title>Dashboard</title>
            </Head>
            <div>
                <Typography.Title
                    level={4}
                    style={{
                        fontWeight: "bold",
                    }}
                >
                    Course Progress
                </Typography.Title>
            </div>
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                    <Card bordered={false}>
                        <Statistic
                            title="Video watched"
                            valueStyle={{
                                fontWeight: "bold",
                            }}
                            value={user?.watchedVideos.length || 0}
                            suffix={`/ ${
                                !isGetVideosLoading &&
                                videos &&
                                videos.totalResults
                            }`}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                    <Card bordered={false}>
                        <Statistic
                            title="Quiz taken"
                            valueStyle={{
                                fontWeight: "bold",
                            }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                    <Card title="Course 3" bordered={false}>
                        <p>3</p>
                    </Card>
                </Col>
            </Row>
        </Auth.UserOnly>
    );
};

export default Dashboard;
