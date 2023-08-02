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
import { useRouter } from "next/router";
import { useEffect } from "react";
import {
    useLogoutMutation,
    useResetPasswordMutation,
} from "../../redux/features/auth/authApi";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { selectRefreshToken } from "../../redux/features/auth/authSelector";
import { videoSelected } from "../../redux/features/videos/videosSlice";

const ResetPassword: NextPage = () => {
    const [
        resetPassword,
        {
            isLoading: isResetPasswordLoading,
            error: resetPasswordError,
            isSuccess: isResetPasswordSuccess,
        },
    ] = useResetPasswordMutation();
    const [logout, { isLoading: isLogoutLoading }] = useLogoutMutation();

    const dispatch = useAppDispatch();
    const refreshToken = useAppSelector(selectRefreshToken);

    const router = useRouter();
    const { token } = router.query;
    const [form] = Form.useForm();

    const onFinish = (values: any) => {
        if (token) {
            resetPassword({
                token: token as string,
                password: values.password,
            });
        } else {
            notification.error({
                message: "Something went wrong",
                description: "Please try again later 👍",
            });
        }
    };

    useEffect(() => {
        if (isResetPasswordLoading) {
            notification.info({
                key: "resetPassword",
                icon: <LoadingOutlined spin />,
                message: "Sending request",
                description:
                    "After success, you will be redirected to login page 👍",
                duration: 0,
            });
        }

        if (
            !isResetPasswordLoading &&
            !resetPasswordError &&
            isResetPasswordSuccess
        ) {
            notification.success({
                key: "resetPassword",
                message: "Password reset succesfully",
                description: "Please login with your new password 👍",
            });
            logout(refreshToken);
            dispatch(videoSelected(null));
            router.push("/login");
        }

        if (!isResetPasswordLoading && resetPasswordError) {
            notification.error({
                key: "resetPassword",
                message: "Something went wrong",
                description: "Please try again later 👍",
            });
        }
    }, [
        dispatch,
        isResetPasswordLoading,
        isResetPasswordSuccess,
        logout,
        refreshToken,
        resetPasswordError,
        router,
    ]);
    return (
        <div>
            <Head>
                <title>Reset Password</title>
            </Head>

            <Typography.Title
                level={4}
                style={{
                    fontWeight: "bold",
                }}
            >
                Reset Password
            </Typography.Title>
            <Typography.Text type="secondary">
                Plese enter your new password
            </Typography.Text>

            <Divider />

            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Row gutter={[32, 32]}>
                    <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                        <Form.Item
                            name="password"
                            label="Password"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your password!",
                                },
                                {
                                    pattern:
                                        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/,
                                    message:
                                        "Password should be combination of one uppercase, one lower case, one special char.",
                                },
                                {
                                    min: 6,
                                    message:
                                        "Password must be at least 6 characters.",
                                },
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>
                        <Typography.Text type="secondary">
                            Password must be at least 6 characters and must
                            contain a number, one uppercase, one lowercase and
                            one special character.
                        </Typography.Text>
                        <Divider />
                        <Form.Item
                            name="confirmPassword"
                            label="Confirm Password"
                            rules={[
                                {
                                    required: true,
                                    message: "Please confirm your password!",
                                },
                                {
                                    validator: (_, value) =>
                                        value === form.getFieldValue("password")
                                            ? Promise.resolve()
                                            : Promise.reject(
                                                  new Error(
                                                      "The two passwords that you entered do not match!"
                                                  )
                                              ),
                                },
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>
                        <Typography.Text type="secondary">
                            Please confirm your password.
                        </Typography.Text>
                    </Col>
                </Row>
                <Form.Item className="mt-4">
                    <Button
                        loading={isResetPasswordLoading}
                        type="primary"
                        htmlType="submit"
                        disabled={!token}
                    >
                        Reset Password
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default ResetPassword;
