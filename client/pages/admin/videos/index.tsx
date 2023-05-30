import {
    DeleteOutlined,
    EditOutlined,
    EyeOutlined,
    LoadingOutlined,
    PlusCircleOutlined,
} from "@ant-design/icons";
import {
    Button,
    Descriptions,
    Form,
    Image,
    Input,
    Modal,
    Space,
    Table,
    Typography,
    notification,
} from "antd";
import { useForm } from "antd/es/form/Form";
import { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { Auth } from "../../../components";
import { apiConfig } from "../../../configs";
import { Video } from "../../../interfaces";
import {
    useCreateVideoMutation,
    useDeleteVideoMutation,
    useGetVideosQuery,
    useUpdateVideoMutation,
} from "../../../redux/features/videos/videosApi";

const Videos: NextPage = () => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [modalType, setModalType] = useState<"add" | "edit" | "show">("add");

    const [form] = useForm();

    const { data: videos, isLoading: isGetVideosLoading } = useGetVideosQuery({
        page: currentPage,
        limit: apiConfig.PAGE_SIZE,
    });
    const [
        createVideo,
        {
            data: createdVideo,
            isLoading: isCreateVideoLoading,
            error: createVideoError,
        },
    ] = useCreateVideoMutation();
    const [
        updateVideo,
        {
            data: updatedVideo,
            isLoading: isUpdateVideoLoading,
            error: updateVideoError,
        },
    ] = useUpdateVideoMutation();
    const [
        deleteVideo,
        {
            data: deletedVideo,
            isLoading: isDeleteVideoLoading,
            error: deleteVideoError,
        },
    ] = useDeleteVideoMutation();

    const handleShowModal = (vidoe: Video) => {
        form.setFieldsValue(vidoe);
        setIsModalOpen(true);
        setModalType("show");
    };

    const handleAddModal = () => {
        form.resetFields();
        setIsModalOpen(true);
        setModalType("add");
    };

    const handleEditModal = (vidoe: Video) => {
        form.setFieldsValue(vidoe);
        setIsModalOpen(true);
        setModalType("edit");
    };

    const handleDelete = (id: string) => {
        deleteVideo(id);
    };

    const handleSubmit = (values: Video) => {
        if (modalType === "add") {
            createVideo(values);
        } else if (modalType === "edit") {
            updateVideo({
                ...values,
                id: form.getFieldValue("id"),
            });
        }
    };

    const tableColumns = [
        {
            title: "Title",
            dataIndex: "title",
            key: "title",
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            render: (description: string) => (
                <Typography.Paragraph
                    ellipsis={{
                        rows: 2,
                    }}
                >
                    {description}
                </Typography.Paragraph>
            ),
        },
        {
            title: "Thumbnail",
            dataIndex: "thumbnail",
            key: "thumbnail",
            render: (thumbnail: string) => (
                <Image
                    style={{
                        objectFit: "cover",
                    }}
                    src={thumbnail}
                    width={100}
                    height={100}
                    alt={thumbnail}
                />
            ),
        },
        {
            title: "Url",
            dataIndex: "url",
            key: "url",
        },
        {
            title: "Duration",
            dataIndex: "duration",
            key: "duration",
            render: (duration: number) => (
                <Typography.Text>
                    {new Date(duration * 1000).toISOString().substr(11, 8)}
                </Typography.Text>
            ),
        },
        {
            title: "Action",
            dataIndex: "action",
            key: "action",
            render: (_: any, record: Video) => (
                <Space>
                    <Button
                        type="primary"
                        ghost
                        icon={<EyeOutlined />}
                        onClick={() => handleShowModal(record)}
                    />

                    <Button
                        type="primary"
                        ghost
                        icon={<EditOutlined />}
                        onClick={() => handleEditModal(record)}
                    />
                    <Button
                        type="primary"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record.id)}
                    />
                </Space>
            ),
        },
    ];

    useEffect(() => {
        if (createdVideo || updatedVideo || deletedVideo) {
            setIsModalOpen(false);
            form.resetFields();
        }
    }, [createdVideo, updatedVideo, deletedVideo, form]);

    useEffect(() => {
        if (createVideoError || updateVideoError || deleteVideoError) {
            setIsModalOpen(false);
            form.resetFields();
        }
    }, [createVideoError, updateVideoError, deleteVideoError, form]);

    useEffect(() => {
        if (isCreateVideoLoading) {
            notification.info({
                key: "createVideo",
                message: "Creating Video",
                description: "Please wait a moment! 👍",
                icon: <LoadingOutlined spin />,
                duration: 0,
            });
        }
        if (!isCreateVideoLoading && !createVideoError && createdVideo) {
            notification.success({
                key: "createVideo",
                message: "Video added successfully",
                description: "Oh, that was fast. 🚀",
            });
        }
        if (!isCreateVideoLoading && createVideoError) {
            notification.error({
                key: "createVideo",
                message: "Failed to create video",
                description: "Please try again! 🥺",
            });
        }
    }, [isCreateVideoLoading, createVideoError, createdVideo]);

    useEffect(() => {
        if (isUpdateVideoLoading) {
            notification.info({
                key: "updateVideo",
                message: "Updating Video",
                description: "Please wait a moment! 👍",
                icon: <LoadingOutlined spin />,
                duration: 0,
            });
        }
        if (!isUpdateVideoLoading && !updateVideoError && updatedVideo) {
            notification.success({
                key: "updateVideo",
                message: "Video updated successfully",
                description: "Oh, that was fast. 🚀",
            });
        }
        if (!isUpdateVideoLoading && updateVideoError) {
            notification.error({
                key: "updateVideo",
                message: "Failed to update video",
                description: "Please try again! 🥺",
            });
        }
    }, [isUpdateVideoLoading, updateVideoError, updatedVideo]);

    useEffect(() => {
        if (isDeleteVideoLoading) {
            notification.info({
                key: "deleteVideo",
                message: "Deleting Video",
                description: "Please wait a moment! 👍",
                icon: <LoadingOutlined spin />,
                duration: 0,
            });
        }
        if (!isDeleteVideoLoading && !deleteVideoError && deletedVideo) {
            notification.success({
                key: "deleteVideo",
                message: "Video deleted successfully",
                description: "Oh, that was fast. 🚀",
            });
        }
        if (!isDeleteVideoLoading && deleteVideoError) {
            notification.error({
                key: "deleteVideo",
                message: "Failed to delete video",
                description: "Please try again! 🥺",
            });
        }
    }, [isDeleteVideoLoading, deleteVideoError, deletedVideo]);

    return (
        <Auth.AdminOnly>
            <Head>
                <title>Videos</title>
            </Head>
            <Space
                align="center"
                className="w-full justify-between mb-6"
                size="large"
            >
                <Typography.Title level={5}>Videos</Typography.Title>
                <Button
                    type="primary"
                    onClick={handleAddModal}
                    icon={<PlusCircleOutlined />}
                >
                    Add Videos
                </Button>
            </Space>
            <Table
                bordered
                loading={isGetVideosLoading}
                columns={tableColumns}
                dataSource={videos?.results}
                pagination={{
                    total: videos?.totalResults,
                    pageSize: apiConfig.PAGE_SIZE,
                    onChange: (page) => setCurrentPage(page),
                }}
            />
            <Modal
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                okText={
                    modalType === "add"
                        ? "Add"
                        : modalType === "edit"
                        ? "Edit"
                        : null
                }
                onOk={() =>
                    modalType === "add" || modalType === "edit"
                        ? form.submit()
                        : setIsModalOpen(false)
                }
                confirmLoading={
                    modalType === "add"
                        ? isCreateVideoLoading
                        : modalType === "edit"
                        ? isUpdateVideoLoading
                        : false
                }
            >
                <Typography.Title level={5}>
                    {modalType === "add"
                        ? "Add Video"
                        : modalType === "edit"
                        ? "Edit Video"
                        : null}
                </Typography.Title>
                {modalType === "show" ? (
                    <Descriptions title="Video Info" layout="vertical">
                        <Descriptions.Item label="Title" span={24}>
                            {form.getFieldValue("title")}
                        </Descriptions.Item>
                        <Descriptions.Item
                            label="Description"
                            span={24}
                            contentStyle={{
                                maxHeight: 100,
                                overflow: "auto",
                            }}
                        >
                            {form.getFieldValue("description")}
                        </Descriptions.Item>
                        <Descriptions.Item label="Thumbnail" span={24}>
                            {form.getFieldValue("thumbnail")}
                        </Descriptions.Item>
                        <Descriptions.Item label="Url" span={24}>
                            {form.getFieldValue("url")}
                        </Descriptions.Item>
                        <Descriptions.Item label="Duration" span={24}>
                            {form.getFieldValue("duration")}
                        </Descriptions.Item>
                    </Descriptions>
                ) : (
                    <Form form={form} layout="vertical" onFinish={handleSubmit}>
                        <Form.Item
                            label="Title"
                            name="title"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input title!",
                                },
                            ]}
                        >
                            <Input placeholder="ex: Video title" />
                        </Form.Item>
                        <Form.Item
                            label="Description"
                            name="description"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input description!",
                                },
                            ]}
                        >
                            <Input placeholder="ex: Video description" />
                        </Form.Item>
                        <Form.Item
                            label="Thumbnail"
                            name="thumbnail"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input thumbnail url!",
                                },
                            ]}
                        >
                            <Input placeholder="ex: http://url.example.com" />
                        </Form.Item>
                        <Form.Item
                            label="Url"
                            name="url"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input url!",
                                },
                                {
                                    pattern:
                                        /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/,
                                    message: "Please input valid youtube url!",
                                },
                            ]}
                        >
                            <Input placeholder="ex: http://youtube.com/embded/ghjgadas8" />
                        </Form.Item>
                        <Form.Item
                            label="Duration"
                            name="duration"
                            rules={[
                                {
                                    required: true,
                                    message:
                                        "Please input duration in seconds!",
                                },
                                {
                                    pattern: /^[0-9]*$/,
                                    message: "Please input valid duration!",
                                },
                            ]}
                        >
                            <Input placeholder="ex: In seconds (60)" />
                        </Form.Item>
                    </Form>
                )}
            </Modal>
        </Auth.AdminOnly>
    );
};

export default Videos;
