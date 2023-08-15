import { LoadingOutlined } from "@ant-design/icons";
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
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Auth } from "../../components";
import Logo from "../../public/assets/logos/logo_transparent.png";
import { useForgotPasswordMutation } from "../../redux/features/auth/authApi";

const ForgotPassword: NextPage = () => {
    const [form] = Form.useForm();
    const router = useRouter();

    const [
        forgotPassword,
        {
            isLoading: isForgotPasswordLoading,
            error: updateForgotPasswordError,
            isSuccess: isForgotPasswordSuccess,
        },
    ] = useForgotPasswordMutation();

    const onFinish = (values: any) => {
        forgotPassword(values.email);
    };

    useEffect(() => {
        if (isForgotPasswordLoading) {
            notification.info({
                key: "updateUser",
                icon: <LoadingOutlined spin />,
                message: "Sending request",
                description: "Please wait a moment 👍",
                duration: 0,
            });
        }

        if (
            !isForgotPasswordLoading &&
            !updateForgotPasswordError &&
            isForgotPasswordSuccess
        ) {
            notification.success({
                key: "updateUser",
                message: "Email sent",
                description: "Email sent succesfully 👍",
            });
            form.resetFields();
            router.push("/login");
        }

        if (!isForgotPasswordLoading && updateForgotPasswordError) {
            notification.error({
                key: "updateUser",
                message: "Something went wrong",
                description: "Failed to sent email 😥",
            });
        }
    }, [
        isForgotPasswordLoading,
        updateForgotPasswordError,
        isForgotPasswordSuccess,
        form,
        router,
    ]);

    return (
        <Auth.LoginGuard>
            <Head>
                <title>Forgot Password</title>
            </Head>
            <Row
                wrap={true}
                gutter={[24, 24]}
                align={"middle"}
                className="mt-10"
            >
                <Col span={12}>
                    <Typography.Title
                        level={4}
                        style={{
                            fontWeight: "bold",
                        }}
                    >
                        Forgot Password
                    </Typography.Title>
                    <Typography.Text>
                        Enter your email to reset your password
                    </Typography.Text>
                    <Divider />
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        autoComplete="off"
                    >
                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your email!",
                                },
                                {
                                    type: "email",
                                    message: "Please enter a valid email",
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Typography.Text type="secondary">
                            We will send you a password reset link to your email
                        </Typography.Text>
                        <Form.Item className="mt-4">
                            <Button
                                loading={isForgotPasswordLoading}
                                type="primary"
                                htmlType="submit"
                            >
                                Request Password Reset
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
                        <Typography.Title
                            level={2}
                            style={{
                                fontWeight: "bold",
                            }}
                        >
                            Dont worry we got you covered.
                        </Typography.Title>
                    </Space>
                </Col>
            </Row>
        </Auth.LoginGuard>
    );
};

export default ForgotPassword;
