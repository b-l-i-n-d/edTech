import { Button, Menu, Typography } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useLogoutMutation } from "../../redux/features/auth/authApi";
import {
    selectRefreshToken,
    selectUser,
} from "../../redux/features/auth/authSelector";
import { useAppSelector } from "../../redux/hooks";

const AdminMenu: React.FC = () => {
    const router = useRouter();
    const pathname = router.pathname;
    const user = useAppSelector(selectUser);
    const refreshToken = useAppSelector(selectRefreshToken);
    const [logout, { isLoading: isLogoutLoading }] = useLogoutMutation();

    const handleLogout = () => {
        logout(refreshToken);
    };

    const items = [
        {
            key: "/admin",
            label: (
                <Link href="/admin">
                    <Button type="text">
                        <Typography.Text strong>Dashboard</Typography.Text>
                    </Button>
                </Link>
            ),
        },
        {
            key: "/admin/videos",
            label: (
                <Link href="/admin/videos">
                    <Button type="text">
                        <Typography.Text strong>Videos</Typography.Text>
                    </Button>
                </Link>
            ),
        },
        {
            key: "/quizzes",
            label: (
                <Button type="text">
                    <Typography.Text strong>Quizzes</Typography.Text>
                </Button>
            ),
        },
        {
            key: "/assignments",
            label: (
                <Button type="text">
                    <Typography.Text strong>Assignments</Typography.Text>
                </Button>
            ),
        },
        {
            key: "/assignments-mark",
            label: (
                <Button type="text">
                    <Typography.Text strong>Assignments Mark</Typography.Text>
                </Button>
            ),
        },
        {
            key: "user",
            label: <Typography.Text strong>{user?.name}</Typography.Text>,
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
