import { Card, Col, Row, Statistic } from "antd";
import { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { Auth } from "../../components";
import { apiConfig } from "../../configs";
import { useGetVideosQuery } from "../../redux/features/videos/videosApi";

const Dashboard: NextPage = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const {
        data: videos,
        isLoading: isGetVideosLoading,
        error: getVideosError,
    } = useGetVideosQuery({
        page: currentPage,
        limit: apiConfig.PAGE_SIZE,
    });

    return (
        <Auth.AdminOnly>
            <Head>
                <title>Dashboard</title>
            </Head>
            <Row gutter={[16, 16]}>
                <Col span={6}>
                    <Card bordered={false} title="Total Videos">
                        <Statistic
                            style={{
                                textAlign: "center",
                                fontWeight: "bold",
                            }}
                            value={videos?.totalResults}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card bordered={false} title="Total Quizzes">
                        <Statistic
                            style={{
                                textAlign: "center",
                                fontWeight: "bold",
                            }}
                            value={videos?.totalResults}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card bordered={false} title="Total Assignments">
                        <Statistic
                            style={{
                                textAlign: "center",
                                fontWeight: "bold",
                            }}
                            value={videos?.totalResults}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card bordered={false} title="Total Users">
                        <Statistic
                            style={{
                                textAlign: "center",
                                fontWeight: "bold",
                            }}
                            value={videos?.totalResults}
                        />
                    </Card>
                </Col>
            </Row>
        </Auth.AdminOnly>
    );
};

export default Dashboard;
