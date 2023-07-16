import {
    Button,
    Col,
    Divider,
    Form,
    Input,
    Row,
    Space,
    Typography,
    notification,
} from "antd";
import { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Auth } from "../../components";
import { isFetchBaseQueryError } from "../../helpers";
import { useAppSelector } from "../../hooks";
import Logo from "../../public/assets/logos/logo_transparent.png";
import { useLoginMutation } from "../../redux/features/auth/authApi";
import { selectUser } from "../../redux/features/auth/authSelector";

const Login: NextPage = () => {
    const router = useRouter();
    const user = useAppSelector(selectUser);

    const [
        login,
        { data: userData, isLoading: isLoginLoading, error: loginError },
    ] = useLoginMutation();

    const onFinish = (values: any) => {
        login(values);
    };

    useEffect(() => {
        if (!isLoginLoading && loginError) {
            if (isFetchBaseQueryError(loginError)) {
                notification.error({
                    message: "Login Failed",
                    description: loginError.data.message,
                });
            }
        }

        if (!isLoginLoading && userData) {
            notification.success({
                message: "Login Success",
                description: "Welcome back",
            });

            if (userData?.role === "admin") {
                router.push("/admin");
            } else {
                router.push("/");
            }
        }
    }, [isLoginLoading, loginError, router, userData]);

    return (
        <Auth.LoginGuard>
            <Head>
                <title>Login</title>
            </Head>
            <Row
                wrap={true}
                gutter={[24, 24]}
                align={"middle"}
                className="mt-10"
            >
                <Col span={12}>
                    <Typography.Title level={3}>Login</Typography.Title>
                    <Typography.Text>
                        Don&apos;t have an account?{" "}
                        <Link href="/register">Register</Link>
                    </Typography.Text>
                    <Divider />
                    <Form name="login" layout="vertical" onFinish={onFinish}>
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your email!",
                                },
                                {
                                    type: "email",
                                    message: "Please input a valid email!",
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your password!",
                                },
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>
                        <Form.Item>
                            <Typography.Link href="/forgot-password">
                                Forgot Password?
                            </Typography.Link>
                        </Form.Item>
                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={isLoginLoading}
                            >
                                Login
                            </Button>
                        </Form.Item>
                    </Form>
                </Col>
                <Col span={12}>
                    <Space
                        className="w-full"
                        direction="vertical"
                        align="center"
                    >
                        <Image
                            className="object-contain h-20"
                            src={Logo}
                            width={200}
                            height={50}
                            alt="Logo"
                        />
                        <Typography.Title level={2}>
                            Login to explore!!!
                        </Typography.Title>
                    </Space>
                </Col>
            </Row>
        </Auth.LoginGuard>
    );
};

export async function getServerSideProps() {
    return {
        props: {},
    };
}

export default Login;
