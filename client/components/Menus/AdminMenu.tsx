import {
    ContainerOutlined,
    DashboardOutlined,
    PlaySquareOutlined,
    QuestionCircleFilled,
    QuestionCircleOutlined,
    QuestionOutlined,
    SnippetsOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { Avatar, Menu, Typography } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useAppSelector } from "../../hooks";
import { useLogoutMutation } from "../../redux/features/auth/authApi";
import {
    selectRefreshToken,
    selectUser,
} from "../../redux/features/auth/authSelector";

const AdminMenu: React.FC = () => {
    const router = useRouter();
    const pathname = router.pathname;
    const user = useAppSelector(selectUser);
    const refreshToken = useAppSelector(selectRefreshToken);
    const [logout, { isLoading: isLogoutLoading }] = useLogoutMutation();

    const handleLogout = () => {
        logout(refreshToken);
        router.push("/login");
    };

    const items = [
        {
            key: "/admin",
            icon: <DashboardOutlined />,
            label: (
                <Link href="/admin">
                    <Typography.Text strong>Dashboard</Typography.Text>
                </Link>
            ),
        },
        {
            key: "/admin/videos",
            icon: <PlaySquareOutlined />,
            label: (
                <Link href="/admin/videos">
                    <Typography.Text strong>Videos</Typography.Text>
                </Link>
            ),
        },
        {
            key: "/admin/quizzes",
            icon: <QuestionOutlined />,
            label: (
                <Link href="/admin/quizzes">
                    <Typography.Text strong>Quizzes</Typography.Text>
                </Link>
            ),
        },
        {
            key: "/admin/assignments",
            icon: <ContainerOutlined />,
            label: (
                <Link href="/admin/assignments">
                    <Typography.Text strong>Assignments</Typography.Text>
                </Link>
            ),
        },
        {
            key: "/admin/assignments-marks",
            icon: <SnippetsOutlined />,
            label: (
                <Link href="/admin/assignments-marks">
                    <Typography.Text strong>Assignments Mark</Typography.Text>
                </Link>
            ),
        },
        {
            key: "user",
            label: (
                <>
                    <Avatar
                        style={{ backgroundColor: "#1677ff" }}
                        icon={<UserOutlined />}
                    />
                    <Typography.Text strong className="ml-2 md:hidden">
                        {user?.name}
                    </Typography.Text>
                </>
            ),
            children: [
                {
                    key: "logout",
                    label: "Logout",
                    onClick: handleLogout,
                },
            ],
        },
    ];

    return (
        <Menu
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                flex: 1,
            }}
            mode="horizontal"
            selectedKeys={[pathname]}
            items={items}
        />
    );
};

export default AdminMenu;
