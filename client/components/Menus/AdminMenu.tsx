import { Menu, Typography } from "antd";
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
    };

    const items = [
        {
            key: "/admin",
            label: (
                <Link href="/admin">
                    <Typography.Text strong>Dashboard</Typography.Text>
                </Link>
            ),
        },
        {
            key: "/admin/videos",
            label: (
                <Link href="/admin/videos">
                    <Typography.Text strong>Videos</Typography.Text>
                </Link>
            ),
        },
        {
            key: "/admin/quizzes",
            label: (
                <Link href="/admin/quizzes">
                    <Typography.Text strong>Quizzes</Typography.Text>
                </Link>
            ),
        },
        {
            key: "/admin/assignments",
            label: (
                <Link href="/admin/assignments">
                    <Typography.Text strong>Assignments</Typography.Text>
                </Link>
            ),
        },
        {
            key: "/admin/assignments-marks",
            label: (
                <Link href="/admin/assignments-marks">
                    <Typography.Text strong>Assignments Mark</Typography.Text>
                </Link>
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
