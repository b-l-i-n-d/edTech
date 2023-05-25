import { Divider, Layout, theme } from "antd";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import Logo from "../public/assets/logos/logo_transparent.png";
import { useAppSelector } from "../redux/hooks";
import Menus from "./Menus";

interface Props {
    children: React.ReactNode;
}

const { Header, Content, Footer } = Layout;

const AppLayout: React.FC<Props> = ({ children }) => {
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const user = useAppSelector((state) => state.auth.user);
    const menu = !user ? (
        <Menus.NoAuthMenu />
    ) : user?.role === "admin" ? (
        <Menus.AdminMenu />
    ) : (
        <Menus.UserMenu />
    );

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
                <Link href="/">
                    <Image src={Logo} width={150} height={150} alt="Logo" />
                </Link>
                {menu}
            </Header>
            <Content className="max-w-6xl w-full mx-auto">
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
                <Image src={Logo} width={100} height={50} alt="Logo" />
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
