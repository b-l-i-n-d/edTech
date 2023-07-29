import {
    CheckCircleOutlined,
    EditOutlined,
    EyeOutlined,
    LoadingOutlined,
    SyncOutlined,
} from "@ant-design/icons";
import {
    Badge,
    Button,
    Descriptions,
    Form,
    Input,
    InputNumber,
    Modal,
    Segmented,
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
import { IAssignmentMark, ModalType } from "../../../interfaces";
import {
    useEditAssignmentMarkMutation,
    useGetAssignmentsMarksQuery,
} from "../../../redux/features/assignmentsMarks/assignmentsMarksApi";

type AssignmentMarksProps = "pending" | "published" | "";

const AssignmentsMarks: NextPage = () => {
    const [status, setStatus] = useState<AssignmentMarksProps>("");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [modalType, setModalType] = useState<ModalType>("view");

    const [form] = Form.useForm();

    const { data: assignmnetsMarks, isLoading: isGetAssignmentsMarksLoading } =
        useGetAssignmentsMarksQuery(
            {
                page: currentPage,
                limit: apiConfig.PAGE_SIZE,
                status,
            },
            {
                refetchOnMountOrArgChange: true,
            }
        );

    const {
        data: pendingAssignmnetsMarks,
        isLoading: isGetPendingAssignmentsMarksLoading,
    } = useGetAssignmentsMarksQuery({
        page: 1,
        limit: apiConfig.PAGE_SIZE,
        status: "pending",
    });

    const {
        data: publishedAssignmnetsMarks,
        isLoading: isGetPublishedAssignmentsMarksLoading,
    } = useGetAssignmentsMarksQuery({
        page: 1,
        limit: apiConfig.PAGE_SIZE,
        status: "published",
    });

    const [
        editAssignmentMark,
        {
            data: editedAssignmentMark,
            isLoading: isEditAssignmentMarkLoading,
            error: editAssignmentMarkError,
        },
    ] = useEditAssignmentMarkMutation();

    const handleModal = (type: ModalType, data?: IAssignmentMark) => {
        setModalType(type);
        setIsModalOpen(true);

        if (type === "edit" || type === "view") {
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

    const handleSubmit = (values: IAssignmentMark) => {
        if (modalType === "edit") {
            editAssignmentMark({ ...values, id: form.getFieldValue("id") });
        }
    };

    const handleStatusChange = (status: AssignmentMarksProps) => {
        setStatus(status);
        setCurrentPage(1);
    };

    const tableColumns = [
        {
            title: "Assignment",
            dataIndex: "assignment",
            key: "assignment",
            render: (text: string, record: IAssignmentMark) => (
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
            render: (text: string, record: IAssignmentMark) => (
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
            render: (text: string, record: IAssignmentMark) => (
                <span>
                    {text} /{" "}
                    {typeof record.assignment !== "string" &&
                        record.assignment.totalMarks}
                </span>
            ),
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
            width: "20%",
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
            render: (text: string, record: IAssignmentMark) => (
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
                <Segmented
                    value={status}
                    onChange={(value) =>
                        handleStatusChange(value as AssignmentMarksProps)
                    }
                    options={[
                        {
                            label: (
                                <Space align="center">
                                    All
                                    <Badge
                                        status="default"
                                        color="orange"
                                        showZero
                                        count={
                                            pendingAssignmnetsMarks &&
                                            publishedAssignmnetsMarks &&
                                            pendingAssignmnetsMarks.totalResults +
                                                publishedAssignmnetsMarks.totalResults
                                        }
                                    />
                                </Space>
                            ),
                            value: "",
                        },
                        {
                            label: (
                                <Space align="center">
                                    Pending
                                    <Badge
                                        status="processing"
                                        color="blue"
                                        showZero
                                        count={
                                            pendingAssignmnetsMarks?.totalResults
                                        }
                                    />
                                </Space>
                            ),
                            value: "pending",
                        },
                        {
                            label: (
                                <Space align="center">
                                    Published
                                    <Badge
                                        showZero
                                        color="green"
                                        count={
                                            publishedAssignmnetsMarks?.totalResults
                                        }
                                    />
                                </Space>
                            ),
                            value: "published",
                        },
                    ]}
                />
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
                width={"70%"}
                style={{ top: 20 }}
                bodyStyle={{
                    maxHeight: "80vh",
                    overflowY: "auto",
                    paddingRight: "8px",
                }}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                okText={modalType === "edit" ? "Edit" : null}
                onOk={() =>
                    modalType === "edit" ? form.submit() : setIsModalOpen(false)
                }
                confirmLoading={
                    modalType === "edit" && isEditAssignmentMarkLoading
                }
                title={
                    modalType === "edit"
                        ? "Edit Assignment Mark"
                        : "Assignment Mark Details"
                }
            >
                <Typography.Text type="secondary">
                    {modalType === "edit" &&
                        "Use markdown syntax for feedback."}
                </Typography.Text>

                {modalType === "view" ? (
                    <Descriptions layout="vertical">
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
                        <span className="text-xs text-gray-400">
                            Total Marks: {form.getFieldValue("totalMarks")}
                        </span>
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
