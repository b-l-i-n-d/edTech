import { EditOutlined, UserOutlined } from "@ant-design/icons";
import { Col, Menu, Row } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

interface Props {
    children: React.ReactNode;
}

const AccoutLayout: React.FC<Props> = ({ children }) => {
    const router = useRouter();
    const pathName = router.pathname;

    return (
        <Row gutter={[16, 16]}>
            <Col xs={24} sm={24} md={24} lg={6} xl={6} xxl={6}>
                <Menu
                    mode="vertical"
                    selectedKeys={[pathName]}
                    items={[
                        {
                            key: "/account",
                            icon: <UserOutlined />,
                            label: <Link href="/account">Profile</Link>,
                        },
                        {
                            key: "/change-password",
                            icon: <EditOutlined />,
                            label: (
                                <Link href="/change-password">
                                    Change Password
                                </Link>
                            ),
                        },
                    ]}
                />
            </Col>
            <Col xs={24} sm={24} md={24} lg={18} xl={18} xxl={18}>
                {children}
            </Col>
        </Row>
    );
};

export default AccoutLayout;
