import {
    CheckSquareOutlined,
    InfoCircleTwoTone,
    LoadingOutlined,
} from "@ant-design/icons";
import {
    Badge,
    Button,
    Card,
    Col,
    Divider,
    List,
    Popover,
    Progress,
    Row,
    Statistic,
    Table,
    Tag,
    Typography,
} from "antd";
import dayjs from "dayjs";
import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { Auth } from "../../components";
import { useAppSelector } from "../../hooks";
import { selectUser } from "../../redux/features/auth/authSelector";
import { useGetDashboardDataQuery } from "../../redux/features/dashboard/dashboardApi";

const Dashboard: NextPage = () => {
    const user = useAppSelector(selectUser);
    const {
        data: dashboardData,
        isLoading: isGetDashboardDataLoading,
        error: getDashboardDataError,
    } = useGetDashboardDataQuery(user.id.toString(), {
        skip: !user,
    });

    const {
        totalAssignments,
        totalQuizzSets,
        totalVideos,
        assignmentReport,
        assignmentWithMarks,
        quizzReport,
        quizzWithMarks,
    } = (!isGetDashboardDataLoading &&
        !getDashboardDataError &&
        dashboardData) || {
        totalAssignments: 0,
        totalQuizzSets: 0,
        totalVideos: 0,
        assignmentReport: {
            totalAssignmentTaken: 0,
            totalMarks: 0,
            totalMarksObtained: 0,
            assignmentSubmittedOnTime: 0,
        },
        assignmentWithMarks: [],
        quizzReport: {
            totalCorrect: 0,
            totalMarks: 0,
            totalMarksObtained: 0,
            totalQuizzTaken: 0,
            totalQuizzes: 0,
        },
        quizzWithMarks: [],
    };

    const quizzProgressList =
        [
            {
                icon: <CheckSquareOutlined />,
                title: "Participated",
                content: `${quizzReport.totalQuizzTaken} / ${totalQuizzSets}`,
            },
            {
                icon: <CheckSquareOutlined />,
                title: "Correct answers",
                descriptions: "Only participated quizzes",
                content: `${quizzReport.totalCorrect} /
                        ${quizzReport.totalQuizzes}`,
            },
            {
                icon: <CheckSquareOutlined />,
                title: "Number obtained",
                descriptions: "Only participated quizzes",
                content: `${quizzReport.totalMarksObtained} /
                        ${quizzReport.totalMarks}`,
            },
        ] || [];

    const assignmentProgressList =
        [
            {
                icon: <CheckSquareOutlined />,
                title: "Submitted",
                content: `${assignmentReport.totalAssignmentTaken} / ${totalAssignments}`,
            },
            {
                icon: <CheckSquareOutlined />,
                title: "Submitted on time",
                content: `${assignmentReport.assignmentSubmittedOnTime} / ${assignmentReport.totalAssignmentTaken}`,
                descriptions: "Only submitted assignments",
            },
            {
                icon: <CheckSquareOutlined />,
                title: "Number obtained",
                content: `${assignmentReport.totalMarksObtained} / ${assignmentReport.totalMarks}`,
                descriptions: "Only submitted assignments",
            },
        ] || [];

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
                        <div className="flex justify-between">
                            <Statistic
                                title="Video watched"
                                valueStyle={{
                                    fontWeight: "bold",
                                }}
                                value={user?.watchedVideos.length || 0}
                                suffix={
                                    <span className="text-sm">
                                        {`( ${
                                            totalVideos -
                                            user?.watchedVideos.length
                                        }
                                    left )`}
                                    </span>
                                }
                                loading={isGetDashboardDataLoading}
                            />
                            <Badge
                                className="place-self-end"
                                color={
                                    (user?.watchedVideos.length / totalVideos) *
                                        100 >=
                                    70
                                        ? "green"
                                        : "red"
                                }
                                count={`${
                                    (
                                        (user?.watchedVideos.length /
                                            totalVideos) as any
                                    ).toFixed(4) * 100 || 0
                                } %`}
                                showZero
                            />
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                    <Card bordered={false}>
                        <div className="flex justify-between">
                            <Statistic
                                title="Quiz taken"
                                valueStyle={{
                                    fontWeight: "bold",
                                }}
                                value={quizzReport.totalQuizzTaken || 0}
                                suffix={
                                    <span className="text-sm">{`( ${
                                        totalQuizzSets -
                                            quizzReport.totalQuizzTaken || 0
                                    } left )`}</span>
                                }
                                loading={isGetDashboardDataLoading}
                            />
                            <Badge
                                className="place-self-end"
                                color={
                                    (totalQuizzSets /
                                        quizzReport.totalQuizzTaken) *
                                        100 <=
                                    70
                                        ? "green"
                                        : "red"
                                }
                                count={`${
                                    (
                                        (quizzReport.totalQuizzTaken /
                                            totalQuizzSets) as any
                                    ).toFixed(4) * 100 || 0
                                } %`}
                                showZero
                            />
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                    <Card bordered={false}>
                        <div className="flex justify-between">
                            <Statistic
                                title="Assignment submitted"
                                valueStyle={{
                                    fontWeight: "bold",
                                }}
                                value={
                                    assignmentReport.totalAssignmentTaken || 0
                                }
                                suffix={
                                    <span className="text-sm">
                                        {`( ${
                                            totalAssignments -
                                                assignmentReport.totalAssignmentTaken ||
                                            0
                                        } left )
                                    `}
                                    </span>
                                }
                                loading={isGetDashboardDataLoading}
                            />
                            <Badge
                                className="place-self-end"
                                color={
                                    (totalAssignments /
                                        assignmentReport.totalAssignmentTaken) *
                                        100 <=
                                    70
                                        ? "green"
                                        : "red"
                                }
                                count={`${
                                    (
                                        (assignmentReport.totalAssignmentTaken /
                                            totalAssignments) as any
                                    ).toFixed(4) * 100 || 0
                                } %`}
                                showZero
                            />
                        </div>
                    </Card>
                </Col>
            </Row>
            <Divider />
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                    <Typography.Title
                        level={4}
                        style={{
                            fontWeight: "bold",
                        }}
                    >
                        Quiz Report Summary
                    </Typography.Title>
                    <Card bordered={false}>
                        <div className="flex items-center justify-between space-y-2 md:space-y-0 flex-wrap">
                            <List
                                loading={isGetDashboardDataLoading}
                                className="w-full md:w-2/3"
                                itemLayout="horizontal"
                                size="small"
                                dataSource={quizzProgressList}
                                renderItem={(item) => (
                                    <List.Item>
                                        <List.Item.Meta
                                            avatar={item.icon}
                                            title={item.title}
                                            description={item.descriptions}
                                        />
                                        <div>{item.content}</div>
                                    </List.Item>
                                )}
                            />

                            <div className="flex items-center flex-col space-y-2 w-full md:w-1/3">
                                <Progress
                                    type="dashboard"
                                    percent={
                                        (
                                            (quizzReport.totalMarksObtained /
                                                quizzReport.totalMarks) as any
                                        ).toFixed(3) * 100 || 0
                                    }
                                    format={(percent) => (
                                        <span className="text-2xl">
                                            {percent}%
                                        </span>
                                    )}
                                />
                                <div className="text-center text-xs mx-4">
                                    Average marks of participated quizzes
                                </div>
                            </div>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                    <Typography.Title
                        level={4}
                        style={{
                            fontWeight: "bold",
                        }}
                    >
                        Quiz Marks
                    </Typography.Title>

                    <Typography.Text type="secondary">
                        At least 70% marks are shown as blue and less than 70%
                        marks are shown as red
                    </Typography.Text>

                    <Card bordered={false} loading={isGetDashboardDataLoading}>
                        <Row gutter={[16, 16]}>
                            {quizzWithMarks.length > 0 &&
                                quizzWithMarks.map((quizz, index) => (
                                    <Col key={quizz.id} xs={3} md={6} lg={3}>
                                        {quizz.quizzMark ? (
                                            <Popover
                                                content={
                                                    <Row
                                                        gutter={16}
                                                        align={"middle"}
                                                    >
                                                        <Col>
                                                            <Typography.Text
                                                                strong
                                                            >
                                                                Total marks -{" "}
                                                                {
                                                                    quizz
                                                                        .quizzMark
                                                                        ?.totalMarks
                                                                }
                                                            </Typography.Text>
                                                            <br />
                                                            <Typography.Text
                                                                strong
                                                            >
                                                                Marks obtained -{" "}
                                                                {
                                                                    quizz
                                                                        .quizzMark
                                                                        ?.marks
                                                                }
                                                            </Typography.Text>
                                                        </Col>
                                                        <Col>
                                                            <div className="flex flex-col items-center">
                                                                <Progress
                                                                    type="dashboard"
                                                                    percent={
                                                                        (
                                                                            (quizz
                                                                                .quizzMark
                                                                                ?.marks /
                                                                                quizz
                                                                                    .quizzMark
                                                                                    ?.totalMarks) as any
                                                                        ).toFixed(
                                                                            3
                                                                        ) * 100
                                                                    }
                                                                    size={70}
                                                                />
                                                                <span className="text-xs">
                                                                    Average Mark
                                                                </span>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                }
                                                title={
                                                    quizz.video.title.substring(
                                                        0,
                                                        30
                                                    ) + "..."
                                                }
                                            >
                                                <Button
                                                    danger={
                                                        (quizz.quizzMark
                                                            ?.marks /
                                                            quizz.quizzMark
                                                                .totalMarks) *
                                                            100 <
                                                        70
                                                            ? true
                                                            : false
                                                    }
                                                    type="primary"
                                                    block
                                                >
                                                    {index + 1}
                                                </Button>
                                            </Popover>
                                        ) : (
                                            <Button disabled block>
                                                {index + 1}
                                            </Button>
                                        )}
                                    </Col>
                                ))}
                        </Row>
                    </Card>
                </Col>
            </Row>
            <Divider />
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={24} md={14} lg={14} xl={14}>
                    <Typography.Title
                        level={4}
                        style={{
                            fontWeight: "bold",
                        }}
                    >
                        Assignment Marks
                    </Typography.Title>
                    <Card bordered={false}>
                        <div className="float-right mb-8 text-right text-xs">
                            <InfoCircleTwoTone /> - Not submitted yet
                            <br />
                            <LoadingOutlined /> - Marks not published yet
                            <br />* Click on the assignment to view the video
                            and details of the assignment
                        </div>
                        <Table
                            size="small"
                            scroll={{ x: true }}
                            loading={isGetDashboardDataLoading}
                            dataSource={assignmentWithMarks}
                            columns={[
                                {
                                    title: "Assignment",
                                    dataIndex: "title",
                                    key: "title",
                                    render: (text, record) => (
                                        <Link href={`/course/${record.video}`}>
                                            <span className="line-clamp-2">
                                                {text}
                                            </span>
                                        </Link>
                                    ),
                                },
                                {
                                    title: "Marks",
                                    dataIndex: "totalMarks",
                                    key: "totalMarks" + Math.random(),
                                    render: (text, record) => (
                                        <Typography.Text>
                                            {!record.assignmentMark ? (
                                                <InfoCircleTwoTone />
                                            ) : record.assignmentMark
                                                  ?.status !== "published" ? (
                                                <LoadingOutlined />
                                            ) : (
                                                record.assignmentMark?.marks
                                            )}{" "}
                                            / {text}
                                        </Typography.Text>
                                    ),
                                },
                                {
                                    title: "Submission Date",
                                    dataIndex: "assignmentMark",
                                    key: "assignmentMark" + Math.random(),
                                    render: (text, record) => (
                                        <Tag
                                            color={
                                                !text
                                                    ? "blue"
                                                    : dayjs(text.submittedAt) >
                                                      dayjs(record.dueDate)
                                                    ? "red"
                                                    : "green"
                                            }
                                        >
                                            {!text
                                                ? "NOT SUBMITTED"
                                                : dayjs(
                                                      text.submittedAt
                                                  ).format(
                                                      "DD MMM YYYY, h:mm A"
                                                  )}
                                        </Tag>
                                    ),
                                    filters: [
                                        {
                                            text: "Not Submitted",
                                            value: "notSubmitted",
                                        },
                                        {
                                            text: "Submitted",
                                            value: "submitted",
                                        },
                                        {
                                            text: "Late Submitted",
                                            value: "lateSubmitted",
                                        },
                                    ],
                                    onFilter: (value, record) => {
                                        if (!record.assignmentMark) {
                                            return value === "notSubmitted";
                                        } else if (
                                            dayjs(
                                                record.assignmentMark
                                                    .submittedAt
                                            ) > dayjs(record.dueDate)
                                        ) {
                                            return value === "lateSubmitted";
                                        } else {
                                            return value === "submitted";
                                        }
                                    },
                                },
                                {
                                    title: "Due Date",
                                    dataIndex: "dueDate",
                                    key: "dueDate",
                                    render: (text) => (
                                        <Tag color="blue">
                                            {dayjs(text).format(
                                                "DD MMM YYYY, h:mm A"
                                            )}
                                        </Tag>
                                    ),
                                },
                            ]}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={24} md={10} lg={10} xl={10}>
                    <Typography.Title
                        level={4}
                        style={{
                            fontWeight: "bold",
                        }}
                    >
                        Assignment Report Summary
                    </Typography.Title>
                    <Card bordered={false}>
                        <div className="flex items-center justify-between space-y-2 md:space-y-0 flex-wrap">
                            <List
                                className="w-full md:w-2/3"
                                loading={isGetDashboardDataLoading}
                                itemLayout="horizontal"
                                size="small"
                                dataSource={assignmentProgressList}
                                renderItem={(item) => (
                                    <List.Item>
                                        <List.Item.Meta
                                            avatar={item.icon}
                                            title={item.title}
                                            description={item.descriptions}
                                        />
                                        <div>{item.content}</div>
                                    </List.Item>
                                )}
                            />

                            <div className="flex items-center flex-col space-y-2 w-full md:w-1/3">
                                <Progress
                                    type="dashboard"
                                    percent={
                                        (
                                            (assignmentReport.totalMarksObtained /
                                                assignmentReport.totalMarks) as any
                                        ).toFixed(3) * 100 || 0
                                    }
                                    format={(percent) => (
                                        <span className="text-2xl">
                                            {percent}%
                                        </span>
                                    )}
                                />
                                <div className="text-center text-xs mx-4">
                                    Average marks of submitted assignments
                                </div>
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>
        </Auth.UserOnly>
    );
};

export default Dashboard;
