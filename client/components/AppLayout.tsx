import { Divider, Layout, theme } from "antd";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";
import { useAppSelector } from "../hooks";
import Logo from "../public/assets/logos/logo_transparent.png";
import { useRefreshTokensMutation } from "../redux/features/auth/authApi";
import {
    selectRefreshToken,
    selectUser,
} from "../redux/features/auth/authSelector";
import Menus from "./Menus";

interface Props {
    children: React.ReactNode;
}

const { Header, Content, Footer } = Layout;

const AppLayout: React.FC<Props> = ({ children }) => {
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    const user = useAppSelector(selectUser);
    const refreshToken = useAppSelector(selectRefreshToken);

    const [refreshAuthToekn, { data, isLoading, error }] =
        useRefreshTokensMutation();

    const menu = !user ? (
        <Menus.NoAuthMenu />
    ) : user?.role === "admin" ? (
        <Menus.AdminMenu />
    ) : (
        <Menus.UserMenu />
    );

    useEffect(() => {
        if (refreshToken) {
            refreshAuthToekn(refreshToken);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Layout
            className="min-h-screen"
            style={{
                background: colorBgContainer,
            }}
        >
            <Header
                style={{
                    position: "sticky",
                    top: 0,
                    zIndex: 1,
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    background: colorBgContainer,
                    boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
                }}
            >
                <Link href="/" className="w-32">
                    <Image
                        src={Logo}
                        className="w-full h-full align-middle"
                        alt="Logo"
                    />
                </Link>
                {menu}
            </Header>
            <Content className="max-w-7xl w-full mx-auto">
                <div
                    style={{
                        padding: 24,
                        background: colorBgContainer,
                        minHeight: "80vh",
                    }}
                >
                    {children}
                </div>
            </Content>
            <Footer className="flex justify-center items-center">
                <Link href="/" className="object-cover w-32">
                    <Image
                        src={Logo}
                        className="w-full h-full align-middle"
                        alt="Logo"
                    />
                </Link>
                <Divider
                    style={{
                        background: "gray",
                    }}
                    type="vertical"
                />
                Made with ❤️
            </Footer>
        </Layout>
    );
};

export default AppLayout;
