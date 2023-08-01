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
import { useForm } from "antd/es/form/Form";
import { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { Auth, Layouts } from "../../components";
import { useAppSelector } from "../../hooks";
import { selectUser } from "../../redux/features/auth/authSelector";
import { useUpdateUserMutation } from "../../redux/features/users/usersApi";

const Account: NextPage = () => {
    const user = useAppSelector(selectUser);
    const [form] = useForm();
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    const [
        updateUser,
        {
            data: updatedUser,
            isLoading: isUpdateUserLoading,
            error: updateUserError,
        },
    ] = useUpdateUserMutation();

    const onFinish = (values: any) => {
        console.log("Received values of form: ", values);
        updateUser({
            id: user?.id,
            photo: imageUrl as string,
        });
    };

    useEffect(() => {
        if (isUpdateUserLoading) {
            notification.info({
                key: "updateUser",
                icon: <LoadingOutlined spin />,
                message: "Updating your profile",
                description: "Please wait a moment 👍",
                duration: 0,
            });
        }

        if (!isUpdateUserLoading && !updateUserError && updatedUser) {
            notification.success({
                key: "updateUser",
                message: "Profile updated successfully",
                description: "Updated your profile successfully 👍",
            });
        }

        if (!isUpdateUserLoading && updateUserError) {
            notification.error({
                key: "updateUser",
                message: "Something went wrong",
                description: "Failed to update your profile 😥",
            });
        }
    }, [isUpdateUserLoading, updatedUser, updateUserError]);

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

                <Form form={form} layout="vertical" onFinish={onFinish}>
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
                    <Form.Item>
                        <Button
                            loading={isUpdateUserLoading}
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
