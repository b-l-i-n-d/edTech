import { TrophyTwoTone } from "@ant-design/icons";
import { Card, Divider, Table, Typography } from "antd";
import Head from "next/head";
import { useAppSelector } from "../../hooks";
import { selectUser } from "../../redux/features/auth/authSelector";
import { useGetLeaderboardQuery } from "../../redux/features/leaderboard/leaderboardApi";

const Leaderboard = () => {
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
        <>
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
                        Top 25
                    </Typography.Title>

                    <Table
                        loading={isLeaderboardLoading}
                        pagination={false}
                        dataSource={leaderboard}
                        columns={tableColumns}
                    />
                </Card>
            </div>
        </>
    );
};

export default Leaderboard;
