import {
    DeleteOutlined,
    EditOutlined,
    EyeOutlined,
    LoadingOutlined,
    PlusCircleOutlined,
} from "@ant-design/icons";
import {
    Button,
    DatePicker,
    Descriptions,
    Form,
    Input,
    InputNumber,
    Modal,
    Space,
    Table,
    Tag,
    Typography,
    notification,
} from "antd";
import dayjs from "dayjs";
import localeData from "dayjs/plugin/localeData";
import weekday from "dayjs/plugin/weekday";
import { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Auth, Common } from "../../../components";
import { apiConfig } from "../../../configs";
import { IAssignment, IAssignmentParams, ModalType } from "../../../interfaces";
import {
    useAddAssignmentMutation,
    useDeleteAssignmentMutation,
    useEditAssignmentMutation,
    useGetAssignmentsQuery,
} from "../../../redux/features/assignments/assignmentsApi";

dayjs.extend(weekday);
dayjs.extend(localeData);

const Assignments: NextPage = () => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [modalType, setModalType] = useState<ModalType>("add");

    const [form] = Form.useForm();

    const { data: assignments, isLoading: isGetAssignmentsLoading } =
        useGetAssignmentsQuery({
            page: currentPage,
            limit: apiConfig.PAGE_SIZE,
        });
    const [
        addAssignment,
        {
            data: addedAssignment,
            isLoading: isAddAssignmentLoading,
            error: addAssignmentError,
        },
    ] = useAddAssignmentMutation();
    const [
        editAssignment,
        {
            data: editedAssignment,
            isLoading: isEditAssignmentLoading,
            error: editAssignmentError,
        },
    ] = useEditAssignmentMutation();
    const [
        deleteAssignment,
        {
            isLoading: isDeleteAssignmentLoading,
            error: deleteAssignmentError,
            isSuccess: isDeleteAssignmentSuccess,
        },
    ] = useDeleteAssignmentMutation();

    const handleModal = (type: ModalType, data?: IAssignment) => {
        setModalType(type);
        setIsModalOpen(true);

        if (type === "add") {
            form.resetFields();
        }

        if (type === "edit" || type === "view") {
            form.setFieldsValue({
                id: data?.id,
                title: data?.title,
                description: data?.description,
                video:
                    typeof data?.video === "string"
                        ? data?.video
                        : data?.video?.id,
                videoTitle:
                    typeof data?.video === "string"
                        ? data?.video
                        : data?.video?.title,
                dueDate: data?.dueDate ? dayjs(data?.dueDate) : undefined,
                totalMarks: data?.totalMarks,
            });
        }
    };

    const handleDelete = (id: string) => {
        deleteAssignment(id);
    };

    const handlSubmit = (values: IAssignmentParams) => {
        if (modalType === "add") {
            addAssignment(values);
        } else if (modalType === "edit") {
            editAssignment({ ...values, id: form.getFieldValue("id") });
        }
    };

    const tableColumns = [
        {
            title: "Title",
            dataIndex: "title",
            key: "title",
            width: "20%",
            render: (text: string) => (
                <Typography.Paragraph
                    ellipsis={{
                        rows: 2,
                    }}
                >
                    <ReactMarkdown>{text}</ReactMarkdown>
                </Typography.Paragraph>
            ),
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            width: "30%",
            render: (text: string) => (
                <Typography.Paragraph ellipsis={{ rows: 2 }}>
                    {text}
                </Typography.Paragraph>
            ),
        },
        {
            title: "Video",
            dataIndex: "video",
            key: "video",
            width: "20%",
            render: (text: string, record: IAssignment) => (
                <Typography.Paragraph
                    ellipsis={{
                        rows: 2,
                    }}
                >
                    <ReactMarkdown>
                        {typeof record.video === "string"
                            ? record.video
                            : record.video?.title}
                    </ReactMarkdown>
                </Typography.Paragraph>
            ),
        },
        {
            title: "Due Date",
            dataIndex: "dueDate",
            key: "dueDate",
            render: (text: string) => {
                if (text) {
                    if (dayjs(text).isBefore(dayjs())) {
                        return (
                            <Tag color="error">
                                {dayjs(text).format("DD MMM YYYY")}
                            </Tag>
                        );
                    } else {
                        return (
                            <Tag color="success">
                                {dayjs(text).format("DD MMM YYYY")}
                            </Tag>
                        );
                    }
                }
            },
        },
        {
            title: "Total Marks",
            dataIndex: "totalMarks",
            key: "totalMarks",
        },
        {
            title: "Actions",
            dataIndex: "actions",
            key: "actions",
            render: (text: string, record: IAssignment) => (
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
        if (addedAssignment || editedAssignment) {
            setIsModalOpen(false);
            form.resetFields();
        }
    }, [addedAssignment, editedAssignment, form]);

    useEffect(() => {
        if (addAssignmentError || editAssignmentError) {
            setIsModalOpen(false);
        }
    }, [addAssignmentError, editAssignmentError]);

    useEffect(() => {
        if (isAddAssignmentLoading) {
            notification.info({
                key: "addAssignment",
                message: "Creating Assignment",
                description: "Please wait a moment! 👍",
                icon: <LoadingOutlined spin />,
                duration: 0,
            });
        }
        if (!isAddAssignmentLoading && !addAssignmentError && addedAssignment) {
            notification.success({
                key: "addAssignment",
                message: "Assignment Created Successfully",
                description: "Oh, that was fast. 🚀",
            });
        }
        if (!isAddAssignmentLoading && addAssignmentError) {
            notification.error({
                key: "addAssignment",
                message: "Failed to create Assignment",
                description: "Please try again! 🥺",
            });
        }
    }, [isAddAssignmentLoading, addAssignmentError, addedAssignment]);

    useEffect(() => {
        if (isEditAssignmentLoading) {
            notification.info({
                key: "editAssignment",
                message: "Updating Assignment",
                description: "Please wait a moment! 👍",
                icon: <LoadingOutlined spin />,
                duration: 0,
            });
        }
        if (
            !isEditAssignmentLoading &&
            !editAssignmentError &&
            editedAssignment
        ) {
            notification.success({
                key: "editAssignment",
                message: "Assignment Updated Successfully",
                description: "Oh, that was fast. 🚀",
            });
        }
        if (!isEditAssignmentLoading && editAssignmentError) {
            notification.error({
                key: "editAssignment",
                message: "Failed to update Assignment",
                description: "Please try again! 🥺",
            });
        }
    }, [isEditAssignmentLoading, editAssignmentError, editedAssignment]);

    useEffect(() => {
        if (isDeleteAssignmentLoading) {
            notification.info({
                key: "deleteAssignment",
                message: "Deleting Assignment",
                description: "Please wait a moment! 👍",
                icon: <LoadingOutlined spin />,
                duration: 0,
            });
        }
        if (
            !isDeleteAssignmentLoading &&
            deleteAssignmentError &&
            isDeleteAssignmentSuccess
        ) {
            notification.success({
                key: "deleteAssignment",
                message: "Assignment Deleted Successfully",
                description: "Oh, that was fast. 🚀",
            });
        }
        if (!isDeleteAssignmentLoading && deleteAssignmentError) {
            notification.error({
                key: "deleteAssignment",
                message: "Failed to delete Assignment",
                description: "Please try again! 🥺",
            });
        }
    }, [
        isDeleteAssignmentLoading,
        deleteAssignmentError,
        isDeleteAssignmentSuccess,
    ]);

    return (
        <Auth.AdminOnly>
            <Head>
                <title>Assignments</title>
            </Head>
            <Space
                align="center"
                className="w-full justify-between mb-6"
                size="large"
            >
                <Typography.Title level={5}>Assignments</Typography.Title>
                <Button
                    type="primary"
                    icon={<PlusCircleOutlined />}
                    onClick={() => handleModal("add")}
                >
                    Add Assignment
                </Button>
            </Space>
            <Table
                bordered
                loading={isGetAssignmentsLoading}
                columns={tableColumns}
                dataSource={assignments?.results}
                pagination={{
                    total: assignments?.totalResults,
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
                        ? isAddAssignmentLoading
                        : modalType === "edit"
                        ? isEditAssignmentLoading
                        : false
                }
                title={
                    modalType === "add"
                        ? "Add Assignment"
                        : modalType === "edit"
                        ? "Edit Assignment"
                        : "Assignment Details"
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
                            <Typography.Text>
                                <ReactMarkdown>
                                    {form.getFieldValue("description")}
                                </ReactMarkdown>
                            </Typography.Text>
                        </Descriptions.Item>
                        <Descriptions.Item label="Video" span={24}>
                            {form.getFieldValue("videoTitle")}
                        </Descriptions.Item>
                        <Descriptions.Item label="Due Date" span={24}>
                            {dayjs(form.getFieldValue("dueDate")).format(
                                "DD MMM YYYY"
                            )}
                        </Descriptions.Item>
                        <Descriptions.Item label="Total Marks" span={24}>
                            {form.getFieldValue("totalMarks")}
                        </Descriptions.Item>
                    </Descriptions>
                ) : (
                    <Form form={form} layout="vertical" onFinish={handlSubmit}>
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
                            <Input placeholder="Please input title!" />
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
                                placeholder="Please input description and use Markdown."
                                autoSize={{ minRows: 4 }}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Video"
                            name="video"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input video!",
                                },
                            ]}
                        >
                            <Common.DebounceSelect
                                placeholder="Select Video"
                                form={form}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Due Date"
                            name="dueDate"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input due date!",
                                },
                            ]}
                        >
                            <DatePicker
                                style={{
                                    width: "100%",
                                }}
                                showTime={{ format: "HH:mm" }}
                                format="DD MMM YYYY HH:mm"
                                placeholder="Please select due date!"
                                disabledDate={(current) => {
                                    return current && current < dayjs();
                                }}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Total Marks"
                            name="totalMarks"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input total marks!",
                                },
                            ]}
                        >
                            <InputNumber
                                placeholder="Please input total marks!"
                                style={{
                                    width: "100%",
                                }}
                            />
                        </Form.Item>
                    </Form>
                )}
            </Modal>
        </Auth.AdminOnly>
    );
};

export default Assignments;
