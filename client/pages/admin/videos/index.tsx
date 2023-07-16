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
import { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Auth } from "../../../components";
import { apiConfig } from "../../../configs";
import { IVideo, ModalType } from "../../../interfaces";
import {
    useAddVideoMutation,
    useDeleteVideoMutation,
    useEditVideoMutation,
    useGetVideosQuery,
} from "../../../redux/features/videos/videosApi";

const Videos: NextPage = () => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [modalType, setModalType] = useState<ModalType>("add");

    const [form] = Form.useForm();

    const { data: videos, isLoading: isGetVideosLoading } = useGetVideosQuery({
        page: currentPage,
        limit: apiConfig.PAGE_SIZE,
    });
    const [
        addVideo,
        {
            data: addedVideo,
            isLoading: isAddVideoLoading,
            error: addVideoError,
        },
    ] = useAddVideoMutation();
    const [
        editVideo,
        {
            data: editedVideo,
            isLoading: isEditVideoLoading,
            error: editVideoError,
        },
    ] = useEditVideoMutation();
    const [
        deleteVideo,
        {
            isLoading: isDeleteVideoLoading,
            error: deleteVideoError,
            isSuccess: isDeleteVideoSuccess,
        },
    ] = useDeleteVideoMutation();

    const handleModal = (type: ModalType, data?: IVideo) => {
        setModalType(type);
        setIsModalOpen(true);

        if (type === "add") {
            form.resetFields();
        }

        if (type === "edit" || type === "view") {
            form.setFieldsValue(data);
        }
    };

    const handleDelete = (id: string) => {
        deleteVideo(id);
    };

    const handleSubmit = (values: IVideo) => {
        if (modalType === "add") {
            addVideo(values);
        } else if (modalType === "edit") {
            editVideo({
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
            width: "25%",
            render: (title: string) => (
                <Typography.Paragraph
                    ellipsis={{
                        rows: 2,
                    }}
                >
                    <ReactMarkdown>{title}</ReactMarkdown>
                </Typography.Paragraph>
            ),
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            width: "25%",
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
            render: (url: string) => (
                <Typography.Link
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {url}
                </Typography.Link>
            ),
        },
        {
            title: "Duration",
            dataIndex: "duration",
            key: "duration",
            render: (duration: number) => (
                <Typography.Text ellipsis>
                    {new Date(duration * 1000).toISOString().substr(11, 8)}
                </Typography.Text>
            ),
        },
        {
            title: "Actions",
            dataIndex: "actions",
            key: "actions",
            render: (_: any, record: IVideo) => (
                <Space>
                    <Button
                        type="primary"
                        ghost
                        icon={<EyeOutlined />}
                        onClick={() => handleModal("view", record)}
                    />

                    <Button
                        type="primary"
                        ghost
                        icon={<EditOutlined />}
                        onClick={() => handleModal("edit", record)}
                    />
                    <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record.id)}
                    />
                </Space>
            ),
        },
    ];

    useEffect(() => {
        if (addedVideo || editedVideo) {
            setIsModalOpen(false);
            form.resetFields();
        }
    }, [addedVideo, editedVideo, form]);

    useEffect(() => {
        if (addVideoError || editVideoError) {
            setIsModalOpen(false);
            form.resetFields();
        }
    }, [addVideoError, editVideoError, deleteVideoError, form]);

    useEffect(() => {
        if (isAddVideoLoading) {
            notification.info({
                key: "addVideo",
                message: "Creating Video",
                description: "Please wait a moment! 👍",
                icon: <LoadingOutlined spin />,
                duration: 0,
            });
        }
        if (!isAddVideoLoading && !addVideoError && addedVideo) {
            notification.success({
                key: "addVideo",
                message: "Video added successfully",
                description: "Oh, that was fast. 🚀",
            });
        }
        if (!isAddVideoLoading && addVideoError) {
            notification.error({
                key: "addVideo",
                message: "Failed to create video",
                description: "Please try again! 🥺",
            });
        }
    }, [isAddVideoLoading, addVideoError, addedVideo]);

    useEffect(() => {
        if (isEditVideoLoading) {
            notification.info({
                key: "editVideo",
                message: "Updating Video",
                description: "Please wait a moment! 👍",
                icon: <LoadingOutlined spin />,
                duration: 0,
            });
        }
        if (!isEditVideoLoading && !editVideoError && editedVideo) {
            notification.success({
                key: "editVideo",
                message: "Video updated successfully",
                description: "Oh, that was fast. 🚀",
            });
        }
        if (!isEditVideoLoading && editVideoError) {
            notification.error({
                key: "editVideo",
                message: "Failed to update video",
                description: "Please try again! 🥺",
            });
        }
    }, [isEditVideoLoading, editVideoError, editedVideo]);

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
        if (
            !isDeleteVideoLoading &&
            !deleteVideoError &&
            isDeleteVideoSuccess
        ) {
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
    }, [isDeleteVideoLoading, deleteVideoError, isDeleteVideoSuccess]);

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
                    onClick={() => handleModal("add")}
                    icon={<PlusCircleOutlined />}
                >
                    Add Video
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
                width={"70%"}
                style={{ top: 20 }}
                bodyStyle={{
                    maxHeight: "80vh",
                    overflowY: "auto",
                    paddingRight: "8px",
                }}
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
                        ? isAddVideoLoading
                        : modalType === "edit"
                        ? isEditVideoLoading
                        : false
                }
                title={
                    modalType === "add"
                        ? "Add Video"
                        : modalType === "edit"
                        ? "Edit Video"
                        : "Video Info"
                }
            >
                <Typography.Text type="secondary">
                    {(modalType === "add" || modalType === "edit") &&
                        "Use markdown syntax for title and description."}
                </Typography.Text>

                {modalType === "view" ? (
                    <Descriptions layout="vertical">
                        <Descriptions.Item label="Title" span={24}>
                            <Typography.Text>
                                <ReactMarkdown>
                                    {form.getFieldValue("title")}
                                </ReactMarkdown>
                            </Typography.Text>
                        </Descriptions.Item>
                        <Descriptions.Item label="Description" span={24}>
                            <Typography.Paragraph>
                                <ReactMarkdown>
                                    {form.getFieldValue("description")}
                                </ReactMarkdown>
                            </Typography.Paragraph>
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
                            tooltip="Use markdown syntax to format text"
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
                            tooltip="Use markdown syntax to format text"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input description!",
                                },
                            ]}
                        >
                            <Input.TextArea
                                placeholder="ex: Video description"
                                autoSize={{ minRows: 4 }}
                            />
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
