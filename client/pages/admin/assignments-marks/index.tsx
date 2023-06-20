import {
    CheckCircleOutlined,
    EditOutlined,
    EyeOutlined,
    LoadingOutlined,
    SyncOutlined,
} from "@ant-design/icons";
import {
    Button,
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
import { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Auth } from "../../../components";
import { apiConfig } from "../../../configs";
import {
    AssignmentMark,
    AssignmentMarkParams,
    ModalType,
} from "../../../interfaces";
import {
    useEditAssignmentMarkMutation,
    useGetAssignmentsMarksQuery,
} from "../../../redux/features/assignmentsMarks/assignmentsMarksApi";

const AssignmentsMarks: NextPage = () => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [modalType, setModalType] = useState<ModalType>("show");

    const [form] = Form.useForm();

    const { data: assignmnetsMarks, isLoading: isGetAssignmentsMarksLoading } =
        useGetAssignmentsMarksQuery({
            page: currentPage,
            limit: apiConfig.PAGE_SIZE,
        });

    const [
        editAssignmentMark,
        {
            data: editedAssignmentMark,
            isLoading: isEditAssignmentMarkLoading,
            error: editAssignmentMarkError,
        },
    ] = useEditAssignmentMarkMutation();

    const handleModal = (type: ModalType, data?: AssignmentMark) => {
        setModalType(type);
        setIsModalOpen(true);

        if (type === "edit" || type === "show") {
            form.setFieldsValue({
                id: data?.id,
                assignment:
                    typeof data?.assignment === "string"
                        ? data?.assignment
                        : data?.assignment?.id,
                assignmentTitle:
                    typeof data?.assignment === "string"
                        ? data?.assignment
                        : data?.assignment?.title,
                student:
                    typeof data?.student === "string"
                        ? data?.student
                        : data?.student?.id,
                sudentName:
                    typeof data?.student === "string"
                        ? data?.student
                        : data?.student?.name,
                marks: data?.marks,
                totalMarks:
                    typeof data?.assignment === "string"
                        ? 0
                        : data?.assignment?.totalMarks,
                status: data?.status,
                feedback: data?.feedback,
            });
        }
    };

    const handleSubmit = (values: AssignmentMarkParams) => {
        if (modalType === "edit") {
            editAssignmentMark({ ...values, id: form.getFieldValue("id") });
        }
    };

    const tableColumns = [
        {
            title: "Assignment",
            dataIndex: "assignment",
            key: "assignment",
            render: (text: string, record: AssignmentMark) => (
                <Typography.Text>
                    <ReactMarkdown>
                        {typeof record.assignment === "string"
                            ? record.assignment
                            : record.assignment?.title}
                    </ReactMarkdown>
                </Typography.Text>
            ),
        },
        {
            title: "Student",
            dataIndex: "student",
            key: "student",
            render: (text: string, record: AssignmentMark) => (
                <Typography.Text>
                    {typeof record.student === "string"
                        ? record.student
                        : record.student?.name}
                </Typography.Text>
            ),
        },
        {
            title: "Marks",
            dataIndex: "marks",
            key: "marks",
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (text: string) => (
                <Tag
                    icon={
                        text === "pending" ? (
                            <SyncOutlined spin />
                        ) : (
                            <CheckCircleOutlined />
                        )
                    }
                    color={text === "pending" ? "processing" : "success"}
                >
                    {text.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: "Feedback",
            dataIndex: "feedback",
            key: "feedback",
            render: (text: string) => (
                <Typography.Paragraph
                    ellipsis={{
                        rows: 2,
                    }}
                >
                    {text}
                </Typography.Paragraph>
            ),
        },
        {
            title: "Actions",
            dataIndex: "actions",
            key: "actions",
            render: (text: string, record: AssignmentMark) => (
                <Space>
                    <Button
                        type="primary"
                        ghost
                        icon={<EyeOutlined />}
                        onClick={() => handleModal("show", record)}
                    />

                    <Button
                        type="primary"
                        ghost
                        icon={<EditOutlined />}
                        onClick={() => handleModal("edit", record)}
                    />
                </Space>
            ),
        },
    ];

    useEffect(() => {
        if (editedAssignmentMark) {
            setIsModalOpen(false);
            form.resetFields();
        }
    }, [editedAssignmentMark, form]);

    useEffect(() => {
        if (editAssignmentMarkError) {
            setIsModalOpen(false);
        }
    }, [editAssignmentMarkError]);

    useEffect(() => {
        if (isEditAssignmentMarkLoading) {
            notification.info({
                key: "editAssignmentMark",
                message: "Updating Assignment Mark",
                description: "Please wait a moment! 👍",
                icon: <LoadingOutlined spin />,
                duration: 0,
            });
        }
        if (
            !isEditAssignmentMarkLoading &&
            !editAssignmentMarkError &&
            editedAssignmentMark
        ) {
            notification.success({
                key: "editAssignmentMark",
                message: "Assignment Mark Updated Successfully",
                description: "Oh, that was fast. 🚀",
            });
        }
        if (!isEditAssignmentMarkLoading && editAssignmentMarkError) {
            notification.error({
                key: "editAssignmentMark",
                message: "Failed to Update Assignment Mark",
                description: "Please try again! 🥺",
            });
        }
    }, [
        isEditAssignmentMarkLoading,
        editAssignmentMarkError,
        editedAssignmentMark,
    ]);

    return (
        <Auth.AdminOnly>
            <Head>
                <title>Assignments Marks</title>
            </Head>
            <Space
                align="center"
                className="w-full justify-between mb-6"
                size="large"
            >
                <Typography.Title level={5}>Assignments Marks</Typography.Title>
            </Space>

            <Table
                bordered
                loading={isGetAssignmentsMarksLoading}
                columns={tableColumns}
                dataSource={assignmnetsMarks?.results}
                pagination={{
                    total: assignmnetsMarks?.totalResults,
                    pageSize: apiConfig.PAGE_SIZE,
                    current: currentPage,
                    onChange: (page) => setCurrentPage(page),
                }}
            />
            <Modal
                style={{ top: 20 }}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                okText={modalType === "edit" ? "Edit" : null}
                onOk={() =>
                    modalType === "edit" ? form.submit() : setIsModalOpen(false)
                }
                confirmLoading={
                    modalType === "edit" && isEditAssignmentMarkLoading
                }
                title={modalType === "edit" ? "Edit Assignment Mark" : null}
            >
                <Typography.Text type="secondary">
                    {modalType === "edit" &&
                        "Use markdown syntax for feedback."}
                </Typography.Text>

                {modalType === "show" ? (
                    <Descriptions
                        title="Assignmnet Mark Details"
                        layout="vertical"
                    >
                        <Descriptions.Item label="Assignment" span={24}>
                            <Typography.Text>
                                <ReactMarkdown>
                                    {form.getFieldValue("assignmentTitle")}
                                </ReactMarkdown>
                            </Typography.Text>
                        </Descriptions.Item>
                        <Descriptions.Item label="Student" span={24}>
                            {form.getFieldValue("sudentName")}
                        </Descriptions.Item>
                        <Descriptions.Item label="Marks" span={24}>
                            {form.getFieldValue("marks")}
                        </Descriptions.Item>
                        <Descriptions.Item label="Total Marks" span={24}>
                            {form.getFieldValue("totalMarks")}
                        </Descriptions.Item>
                        <Descriptions.Item label="Status" span={24}>
                            {
                                <Tag
                                    icon={
                                        form.getFieldValue("status") ===
                                        "pending" ? (
                                            <SyncOutlined spin />
                                        ) : (
                                            <CheckCircleOutlined />
                                        )
                                    }
                                    color={
                                        form.getFieldValue("status") ===
                                        "pending"
                                            ? "processing"
                                            : "success"
                                    }
                                >
                                    {form
                                        .getFieldValue("status")
                                        ?.toUpperCase()}
                                </Tag>
                            }
                        </Descriptions.Item>
                        <Descriptions.Item label="Feedback" span={24}>
                            <Typography.Paragraph>
                                <ReactMarkdown>
                                    {form.getFieldValue("feedback")}
                                </ReactMarkdown>
                            </Typography.Paragraph>
                        </Descriptions.Item>
                    </Descriptions>
                ) : (
                    <Form form={form} layout="vertical" onFinish={handleSubmit}>
                        <Form.Item
                            label="Marks"
                            name="marks"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter marks!",
                                },
                                {
                                    type: "number",
                                    message: "Please enter valid marks!",
                                    min: 0,
                                    max: form.getFieldValue("totalMarks"),
                                },
                            ]}
                        >
                            <InputNumber
                                placeholder="Enter marks"
                                style={{
                                    width: "100%",
                                }}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Feedback"
                            name="feedback"
                            tooltip="Use markdown syntax to fromat text"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter feedback!",
                                },
                            ]}
                        >
                            <Input.TextArea
                                placeholder="Enter feedback"
                                autoSize={{ minRows: 4 }}
                            />
                        </Form.Item>
                    </Form>
                )}
            </Modal>
        </Auth.AdminOnly>
    );
};

export default AssignmentsMarks;
