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
import { useEffect } from "react";
import { isFetchBaseQueryError } from "../../helpers";
import Logo from "../../public/assets/logos/logo_transparent.png";
import { useRegisterMutation } from "../../redux/features/auth/authApi";
import { useRouter } from "next/router";

const Register: NextPage = () => {
    const router = useRouter();
    const [
        register,
        { data: userData, isLoading: isRegisterLoading, error: registerError },
    ] = useRegisterMutation();
    const onFinish = (values: any) => {
        register(values);
    };

    useEffect(() => {
        if (!isRegisterLoading && registerError) {
            if (isFetchBaseQueryError(registerError)) {
                notification.error({
                    message: "Registration Failed",
                    description: registerError.data.message,
                });
            }
        }

        if (!isRegisterLoading && userData) {
            notification.success({
                message: "Registration Success",
                description: "Please login to continue",
            });
            router.push("/login");
        }
    }, [isRegisterLoading, registerError, router, userData]);

    return (
        <>
            <Head>
                <title>Register</title>
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
                        Register
                    </Typography.Title>
                    <Typography.Text>
                        Already have an account?{" "}
                        <Link href="/login">Login</Link>
                    </Typography.Text>
                    <Divider />
                    <Form
                        name="register"
                        layout="vertical"
                        onFinish={onFinish}
                        autoComplete="off"
                    >
                        <Form.Item
                            label="Name"
                            name="name"
                            rules={[
                                {
                                    type: "string",
                                    required: true,
                                    message: "Please input your name!",
                                },
                                {
                                    min: 3,
                                    message:
                                        "Name must be at least 3 characters.",
                                },
                            ]}
                        >
                            <Input placeholder="ex: John Doe" />
                        </Form.Item>
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
                            <Input placeholder="ex: who.is.it@its.me" />
                        </Form.Item>
                        <Form.Item
                            label="Password"
                            name="password"
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
                            <Input.Password placeholder="Enter your password" />
                        </Form.Item>
                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={isRegisterLoading}
                            >
                                Register
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
                            Register to try!
                        </Typography.Title>
                    </Space>
                </Col>
            </Row>
        </>
    );
};

export async function getServerSideProps() {
    return {
        props: {},
    };
}

export default Register;
