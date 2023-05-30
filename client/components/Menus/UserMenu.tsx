import { Button, Menu, Typography, notification } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useLogoutMutation } from "../../redux/features/auth/authApi";
import {
    selectRefreshToken,
    selectUser,
} from "../../redux/features/auth/authSelector";
import { useAppSelector } from "../../redux/hooks";

const UserMenu: React.FC = () => {
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
            key: "/",
            label: (
                <Link href="/">
                    <Button type="text">
                        <Typography.Text strong>Home</Typography.Text>
                    </Button>
                </Link>
            ),
        },
        {
            key: "/course",
            label: (
                <Button type="text">
                    <Typography.Text strong>Course Access</Typography.Text>
                </Button>
            ),
        },
        {
            key: "user",
            label: <Typography.Text strong>{user?.name}</Typography.Text>,
            children: [
                {
                    key: "/profile",
                    label: <Link href="/profile">Profile</Link>,
                },
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

export default UserMenu;
