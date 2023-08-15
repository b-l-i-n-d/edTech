import {
    ArrowRightOutlined,
    ContainerOutlined,
    NumberOutlined,
    PlaySquareOutlined,
    QuestionOutlined,
    SnippetsOutlined
} from "@ant-design/icons";
import { Button, Card, Col, Divider, Row, Statistic } from "antd";
import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { Auth } from "../../components";
import { apiConfig } from "../../configs";
import { useGetAssignmentsQuery } from "../../redux/features/assignments/assignmentsApi";
import { useGetQuizzesQuery } from "../../redux/features/quizzes/quizzesApi";
import { useGetUsersQuery } from "../../redux/features/users/usersApi";
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
    const {
        data: quizzes,
        isLoading: isGetQuizzesLoading,
        error: getQuizzesError,
    } = useGetQuizzesQuery({
        page: currentPage,
        limit: apiConfig.PAGE_SIZE,
    });
    const {
        data: assignments,
        isLoading: isGetAssignmentsLoading,
        error: getAssignmentsError,
    } = useGetAssignmentsQuery({
        page: currentPage,
        limit: apiConfig.PAGE_SIZE,
    });
    const {
        data: users,
        isLoading: isGetUsersLoading,
        error: getUserError,
    } = useGetUsersQuery({
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
                            loading={isGetVideosLoading}
                            style={{
                                textAlign: "center",
                                fontWeight: "bold",
                            }}
                            prefix={<NumberOutlined />}
                            value={
                                (!isGetVideosLoading &&
                                    !getVideosError &&
                                    videos &&
                                    videos.totalResults) ||
                                0
                            }
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card bordered={false} title="Total Quizzes">
                        <Statistic
                            loading={isGetQuizzesLoading}
                            style={{
                                textAlign: "center",
                                fontWeight: "bold",
                            }}
                            prefix={<NumberOutlined />}
                            value={
                                (!isGetQuizzesLoading &&
                                    !getQuizzesError &&
                                    quizzes &&
                                    quizzes.totalResults) ||
                                0
                            }
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card bordered={false} title="Total Assignments">
                        <Statistic
                            loading={isGetAssignmentsLoading}
                            style={{
                                textAlign: "center",
                                fontWeight: "bold",
                            }}
                            prefix={<NumberOutlined />}
                            value={
                                (!isGetAssignmentsLoading &&
                                    !getAssignmentsError &&
                                    assignments &&
                                    assignments.totalResults) ||
                                0
                            }
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card bordered={false} title="Total Users">
                        <Statistic
                            loading={isGetUsersLoading}
                            style={{
                                textAlign: "center",
                                fontWeight: "bold",
                            }}
                            prefix={<NumberOutlined />}
                            value={
                                (!isGetUsersLoading &&
                                    !getUserError &&
                                    users &&
                                    users.totalResults) ||
                                0
                            }
                        />
                    </Card>
                </Col>
            </Row>
            <Divider />
            <Row gutter={[16, 16]}>
                <Col span={6}>
                    <Card
                        hoverable
                        style={{
                            textAlign: "center",
                            fontWeight: "bold",
                        }}
                    >
                        <PlaySquareOutlined
                            style={{
                                fontSize: "50px",
                                marginBottom: "10px",
                            }}
                        />{" "}
                        <br /> Videos
                        <Divider />
                        <Link href="/admin/videos">
                            <Button type="primary" ghost>
                                View All <ArrowRightOutlined />
                            </Button>
                        </Link>
                    </Card>
                </Col>
                <Col
                    span={6}
                    style={{
                        textAlign: "center",
                        fontWeight: "bold",
                    }}
                >
                    <Card hoverable>
                        <QuestionOutlined
                            style={{
                                fontSize: "50px",
                                marginBottom: "10px",
                            }}
                        />
                        <br /> Quizzes
                        <Divider />
                        <Link href="/admin/quizzes">
                            <Button type="primary" ghost>
                                View All <ArrowRightOutlined />
                            </Button>
                        </Link>
                    </Card>
                </Col>
                <Col
                    span={6}
                    style={{
                        height: "200px",
                    }}
                >
                    <Card
                        hoverable
                        style={{
                            textAlign: "center",
                            fontWeight: "bold",
                        }}
                    >
                        <ContainerOutlined
                            style={{
                                fontSize: "50px",
                                marginBottom: "10px",
                            }}
                        />
                        <br />
                        Assignments
                        <Divider />
                        <Link href="/admin/assignments">
                            <Button type="primary" ghost>
                                View All <ArrowRightOutlined />
                            </Button>
                        </Link>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card
                        hoverable
                        style={{
                            textAlign: "center",
                            fontWeight: "bold",
                        }}
                    >
                        <SnippetsOutlined
                            style={{
                                fontSize: "50px",
                                marginBottom: "10px",
                            }}
                        />
                        <br /> AssignmentMark
                        <Divider />
                        <Link href="/admin/assignment-marks">
                            <Button type="primary" ghost>
                                View All <ArrowRightOutlined />
                            </Button>
                        </Link>
                    </Card>
                </Col>
            </Row>
        </Auth.AdminOnly>
    );
};

export default Dashboard;
