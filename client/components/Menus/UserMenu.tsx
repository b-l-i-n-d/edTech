import { Button, Menu, Typography } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { logout } from "../../redux/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";

const UserMenu: React.FC = () => {
    const router = useRouter();
    const pathname = router.pathname;
    const user = useAppSelector((state) => state.auth.user);
    const dispatch = useAppDispatch();

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
                    onClick: () => {
                        dispatch(logout());
                    },
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
