import { TrophyTwoTone } from "@ant-design/icons";
import { Avatar, Card, Divider, Table, Typography } from "antd";
import { NextPage } from "next";
import Head from "next/head";
import { Auth } from "../../components";
import { useAppSelector } from "../../hooks";
import { selectUser } from "../../redux/features/auth/authSelector";
import { useGetLeaderboardQuery } from "../../redux/features/leaderboard/leaderboardApi";

const Leaderboard: NextPage = () => {
    const user = useAppSelector(selectUser);
    const {
        data: leaderboardData,
        isLoading: isLeaderboardLoading,
        error: getLeaderboardError,
    } = useGetLeaderboardQuery({
        student: user?.id,
    });

    const { student, leaderboard } =
        (!isLeaderboardLoading && !getLeaderboardError && leaderboardData) ||
        {};

    const tableColumns = [
        {
            title: "Rank",
            dataIndex: "rank",
            key: "rank",
            render: (rank: number) => {
                return rank === 1 ? <TrophyTwoTone /> : rank;
            },
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            render: (name: string, record: any) => {
                return (
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <Avatar
                            size={"small"}
                            src={record.photo && record.photo}
                        >
                            {!record.photo && name[0]}
                        </Avatar>
                        <span
                            style={{
                                marginLeft: 10,
                            }}
                        >
                            {name}
                        </span>
                    </div>
                );
            },
        },
        {
            title: "Quiz Marks",
            dataIndex: "quizzTotalMarks",
            key: "quizzTotalMarks",
        },
        {
            title: "Assignment Marks",
            dataIndex: "assignmentTotalMarks",
            key: "assignmentTotalMarks",
        },
        {
            title: "Total Marks",
            dataIndex: "totalMarks",
            key: "totalMarks",
        },
    ];

    return (
        <Auth.UserOnly>
            <Head>
                <title>Leaderboard</title>
            </Head>
            <div>
                <Typography.Title
                    level={4}
                    style={{
                        fontWeight: "bold",
                    }}
                >
                    Leaderboard
                </Typography.Title>
                <Card bordered={false}>
                    <Typography.Title
                        level={5}
                        style={{
                            fontWeight: "semibold",
                        }}
                    >
                        Your position in the leaderboard
                    </Typography.Title>

                    <Table
                        loading={isLeaderboardLoading}
                        pagination={false}
                        dataSource={student && [student]}
                        columns={tableColumns}
                    />

                    <Divider />

                    <Typography.Title
                        level={5}
                        style={{
                            fontWeight: "semibold",
                        }}
                    >
                        Top 25 students
                    </Typography.Title>

                    <Table
                        loading={isLeaderboardLoading}
                        pagination={false}
                        dataSource={leaderboard}
                        columns={tableColumns}
                    />
                </Card>
            </div>
        </Auth.UserOnly>
    );
};

export default Leaderboard;
