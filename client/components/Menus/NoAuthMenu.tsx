import {
    HomeOutlined,
    InfoCircleOutlined,
    LoginOutlined,
    MenuOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Drawer, Menu, Typography } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";

const NoAuthMenu: React.FC = () => {
    const router = useRouter();
    const pathname = router.pathname;

    const [drawerOpen, setDrawerOpen] = useState(false);

    const items: MenuProps["items"] = [
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
            label: (
                <Link href="/about">
                    <Typography.Text strong>About</Typography.Text>
                </Link>
            ),
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
        {
            key: "drawer",
            label: (
                <span className="md:hidden">
                    <MenuOutlined />
                </span>
            ),
            onClick: () => setDrawerOpen(true),
        },
    ];

    return (
        <>
            <div className="hidden md:flex md:items-center md:justify-end md:flex-1">
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
            </div>
            <div className="flex items-center justify-end flex-1 md:hidden">
                <Menu
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        flex: 1,
                    }}
                    mode="horizontal"
                    selectedKeys={[pathname]}
                    items={items.filter(
                        (item) => item && item.key === "drawer"
                    )}
                />
            </div>

            <Drawer
                open={drawerOpen}
                placement="right"
                onClose={() => setDrawerOpen(false)}
            >
                <Menu
                    mode="inline"
                    selectedKeys={[pathname]}
                    items={items.filter(
                        (item) => item && item.key !== "drawer"
                    )}
                />
            </Drawer>
        </>
    );
};

export default NoAuthMenu;
