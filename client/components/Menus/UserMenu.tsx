import { Button, Menu, Typography } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
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

    const handleLogout = () => {
        logout(refreshToken);
        dispatch(videoSelected(null));
    };

    const items = [
        {
            key: "",
            label: (
                <Link href="/">
                    <Button type="text">
                        <Typography.Text strong>Home</Typography.Text>
                    </Button>
                </Link>
            ),
        },
        {
            key: "course",
            label: (
                <Link href={`/course/${currentVideoId}`}>
                    <Button type="text">
                        <Typography.Text strong>Course Access</Typography.Text>
                    </Button>
                </Link>
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
