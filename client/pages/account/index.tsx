import { LoadingOutlined, PlusCircleOutlined } from "@ant-design/icons";
import {
    Button,
    Col,
    Divider,
    Form,
    Image,
    Input,
    Row,
    Typography,
    Upload,
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

const getBase64 = (img: any, callback: any) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
};

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

    const handleImageUpload = (info: any) => {
        getBase64(info.file.originFileObj, (imageUrl: any) => {
            setImageUrl(imageUrl);
        });
    };

    const onFinish = (values: any) => {
        updateUser({
            id: user?.id,
            photo: imageUrl as string,
        });
    };

    useEffect(() => {
        form.setFieldsValue({
            name: user?.name,
            email: user?.email,
        });
    }, [form, user]);

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
                <title>Account</title>
            </Head>
            <Layouts.AccoutLayout>
                <Typography.Title
                    level={4}
                    style={{
                        fontWeight: "bold",
                    }}
                >
                    Profile Update
                </Typography.Title>
                <Typography.Text type="secondary">
                    Update your profile information
                </Typography.Text>
                <Divider />

                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Row gutter={[32, 32]}>
                        <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                            <Form.Item
                                name="name"
                                label="Full name"
                                help="This name will be given on the course completion certificate. can't change"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please input your name!",
                                    },
                                ]}
                            >
                                <Input disabled />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                            <Form.Item
                                name="email"
                                label="Email"
                                help="This email will be given on the course completion certificate. can't change"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please input your email!",
                                    },
                                ]}
                            >
                                <Input disabled />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                            <Form.Item
                                name="photo"
                                label="Photo"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please upload your photo!",
                                    },
                                ]}
                                getValueFromEvent={(e) => {
                                    if (Array.isArray(e)) {
                                        return e;
                                    }
                                    return e?.fileList;
                                }}
                                valuePropName="fileList"
                            >
                                <Upload
                                    name="files"
                                    accept="image/png, image/jpeg, image/jpg"
                                    maxCount={1}
                                    listType="picture-card"
                                    showUploadList={false}
                                    onChange={handleImageUpload}
                                >
                                    {imageUrl ? (
                                        <Image
                                            preview={false}
                                            src={imageUrl}
                                            alt="avatar"
                                            style={{ width: "100%" }}
                                        />
                                    ) : user?.photo ? (
                                        <Image
                                            preview={false}
                                            src={user?.photo}
                                            alt="avatar"
                                            style={{ width: "100%" }}
                                        />
                                    ) : (
                                        <div>
                                            <PlusCircleOutlined />
                                            <div style={{ marginTop: 8 }}>
                                                Upload
                                            </div>
                                        </div>
                                    )}
                                </Upload>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item>
                        <Button
                            loading={isUpdateUserLoading}
                            type="primary"
                            htmlType="submit"
                        >
                            Update
                        </Button>
                    </Form.Item>
                </Form>
            </Layouts.AccoutLayout>
        </Auth.UserOnly>
    );
};

export default Account;
