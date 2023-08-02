import {
    HomeOutlined,
    InfoCircleOutlined,
    LoginOutlined,
} from "@ant-design/icons";
import { Menu, Typography } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

const NoAuthMenu: React.FC = () => {
    const router = useRouter();
    const pathname = router.pathname;

    const items = [
        {
            key: "/",
            icon: <HomeOutlined />,
            label: (
                <Link href="/">
                    <Typography.Text strong>Home</Typography.Text>
                </Link>
            ),
        },
        {
            key: "/about",
            icon: <InfoCircleOutlined />,
            label: <Typography.Text strong>About</Typography.Text>,
        },
        {
            key: "/login",
            icon: <LoginOutlined />,
            label: (
                <Link href="/login">
                    <Typography.Text strong>Login</Typography.Text>
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
