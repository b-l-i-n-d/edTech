import { LoadingOutlined } from "@ant-design/icons";
import {
    Button,
    Col,
    Divider,
    Form,
    Input,
    Row,
    Typography,
    notification,
} from "antd";
import { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { Auth, Layouts } from "../../components";
import { useAppSelector } from "../../hooks";
import { useForgotPasswordMutation } from "../../redux/features/auth/authApi";
import { selectUser } from "../../redux/features/auth/authSelector";

const Account: NextPage = () => {
    const user = useAppSelector(selectUser);
    const [form] = Form.useForm();
    const [imageUrl, setImageUrl] = useState<string | null>(null);

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
    ]);

    return (
        <Auth.UserOnly>
            <Head>
                <title>Change Password</title>
            </Head>
            <Layouts.AccoutLayout>
                <Typography.Title
                    level={4}
                    style={{
                        fontWeight: "bold",
                    }}
                >
                    Change Password
                </Typography.Title>
                <Typography.Text type="secondary">
                    Update or change your password
                </Typography.Text>
                <Divider />

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Row gutter={[32, 32]}>
                        <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
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
                                We will send you a password reset link to your
                                email
                            </Typography.Text>
                        </Col>
                    </Row>
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
            </Layouts.AccoutLayout>
        </Auth.UserOnly>
    );
};

export default Account;
