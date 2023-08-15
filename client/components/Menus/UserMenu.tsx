import {
    BarChartOutlined,
    DashboardOutlined,
    HomeOutlined,
    LogoutOutlined,
    MenuOutlined,
    PlaySquareOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { Avatar, Drawer, Menu, Typography } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { useLogoutMutation } from "../../redux/features/auth/authApi";
import {
    selectRefreshToken,
    selectUser,
} from "../../redux/features/auth/authSelector";
import { selectCurrentVideoId } from "../../redux/features/videos/videoSelctor";
import { videoSelected } from "../../redux/features/videos/videosSlice";

const UserMenu: React.FC = () => {
    const router = useRouter();
    const pathname = router.pathname.split("/")[1];

    const dispatch = useAppDispatch();
    const user = useAppSelector(selectUser);
    const currentVideoId = useAppSelector(selectCurrentVideoId);
    const refreshToken = useAppSelector(selectRefreshToken);
    const [logout, { isLoading: isLogoutLoading }] = useLogoutMutation();

    const [drawerOpen, setDrawerOpen] = useState(false);

    const handleLogout = () => {
        logout(refreshToken);
        dispatch(videoSelected(null));
    };

    const items = [
        {
            key: "",
            icon: <HomeOutlined />,
            label: (
                <Link href="/">
                    <Typography.Text strong>Home</Typography.Text>
                </Link>
            ),
        },
        {
            key: "course",
            icon: <PlaySquareOutlined />,
            label: (
                <Link href={`/course/${currentVideoId}`}>
                    <Typography.Text strong>Course Access</Typography.Text>
                </Link>
            ),
        },
        {
            key: "dashboard",
            icon: <DashboardOutlined />,
            label: (
                <Link href="/dashboard">
                    <Typography.Text strong>Dashboard</Typography.Text>
                </Link>
            ),
        },
        {
            key: "leaderboard",
            icon: <BarChartOutlined />,
            label: (
                <Link href="/leaderboard">
                    <Typography.Text strong>Leaderboard</Typography.Text>
                </Link>
            ),
        },
        {
            key: "user",
            label: (
                <>
                    <Avatar src={user?.photo ? user?.photo : undefined}>
                        {!user?.photo && user?.name?.charAt(0).toUpperCase()}
                    </Avatar>
                    <Typography.Text strong className="ml-2 lg:hidden">
                        {user?.name}
                    </Typography.Text>
                </>
            ),
            children: [
                {
                    key: "account",
                    icon: <UserOutlined />,
                    label: <Link href="/account">Account</Link>,
                },
                {
                    key: "logout",
                    icon: <LogoutOutlined />,
                    label: "Logout",
                    onClick: handleLogout,
                },
            ],
        },
        {
            key: "drawer",
            label: (
                <span className="lg:hidden">
                    <MenuOutlined />
                </span>
            ),
            onClick: () => setDrawerOpen(true),
        },
    ];

    return (
        <>
            <div className="hidden lg:flex lg:items-center lg:justify-end lg:flex-1">
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
            <div className="flex items-center justify-end flex-1 lg:hidden">
                <Menu
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        flex: 1,
                    }}
                    mode="horizontal"
                    selectedKeys={[pathname]}
                    items={items.filter((item) => item.key === "drawer")}
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
                    items={items.filter((item) => item.key !== "drawer")}
                />
            </Drawer>
        </>
    );
};

export default UserMenu;
