import { Button, Menu, Typography } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

const NoAuthMenu: React.FC = () => {
    const router = useRouter();
    const pathname = router.pathname;

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
            key: "/about",
            label: <Button type="text">About</Button>,
        },
        {
            key: "/login",
            label: (
                <Link href="/login">
                    <Button type="text">Login</Button>
                </Link>
            ),
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

export default NoAuthMenu;
