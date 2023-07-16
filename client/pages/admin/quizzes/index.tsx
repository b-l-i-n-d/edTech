import {
    DeleteOutlined,
    EditOutlined,
    EyeOutlined,
    LoadingOutlined,
    MinusOutlined,
    PlusCircleOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import {
    Button,
    Checkbox,
    Descriptions,
    Form,
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
import { Auth, Common } from "../../../components";
import { apiConfig } from "../../../configs";
import { IQuizz, IQuizzParams, ModalType } from "../../../interfaces";
import {
    useAddQuizzMutation,
    useDeleteQuizzMutation,
    useEditQuizzMutation,
    useGetQuizzesQuery,
} from "../../../redux/features/quizzes/quizzesApi";

const Quizzes: NextPage = () => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [modalType, setModalType] = useState<ModalType>("add");

    const [form] = Form.useForm();

    const { data: quizzes, isLoading: isGetQuizzesLoading } =
        useGetQuizzesQuery({
            page: currentPage,
            limit: apiConfig.PAGE_SIZE,
        });
    const [
        addQuizz,
        {
            data: addedQuizz,
            isLoading: isAddQuizzLoading,
            error: addQuizzError,
        },
    ] = useAddQuizzMutation();
    const [
        editQuizz,
        {
            data: editedQuizz,
            isLoading: isEditQuizzLoading,
            error: editQuizzError,
        },
    ] = useEditQuizzMutation();
    const [
        deleteQuizz,
        {
            isLoading: isDeleteQuizzLoading,
            error: deleteQuizzError,
            isSuccess: isDeleteQuizzSuccess,
        },
    ] = useDeleteQuizzMutation();

    const handleModal = (type: ModalType, data?: IQuizz) => {
        setModalType(type);
        setIsModalOpen(true);

        if (type === "add") {
            form.resetFields();
        }

        if (type === "edit" || type === "view") {
            form.setFieldsValue({
                id: data?.id,
                question: data?.question,
                description: data?.description,
                video:
                    typeof data?.video === "string"
                        ? data?.video
                        : data?.video?.id,
                videoTitle:
                    typeof data?.video === "string" ? "" : data?.video?.title,
                options: data?.options,
            });
        }
    };

    const handleDelete = (id: string) => {
        deleteQuizz(id);
    };

    const handleSubmit = (values: IQuizzParams) => {
        if (modalType === "add") {
            addQuizz(values);
        } else if (modalType === "edit") {
            editQuizz({ ...values, id: form.getFieldValue("id") });
        }
    };

    const tableColumns = [
        {
            title: "Question",
            dataIndex: "question",
            key: "question",
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
            title: "Video",
            dataIndex: "video",
            key: "video",
            render: (text: string, record: IQuizz) => (
                <Typography.Paragraph
                    ellipsis={{
                        rows: 2,
                    }}
                >
                    {typeof record.video === "string"
                        ? record.video
                        : record.video?.title}
                </Typography.Paragraph>
            ),
        },
        {
            title: "Actions",
            dataIndex: "action",
            key: "actions",
            render: (text: string, record: IQuizz) => (
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
        if (addedQuizz || editedQuizz) {
            setIsModalOpen(false);
            form.resetFields();
        }
    }, [addedQuizz, editedQuizz, form]);

    useEffect(() => {
        if (addQuizzError || editQuizzError) {
            setIsModalOpen(false);
        }
    }, [addQuizzError, editQuizzError]);

    useEffect(() => {
        if (isAddQuizzLoading) {
            notification.info({
                key: "addQuizz",
                message: "Creating Quizz",
                description: "Please wait a moment! 👍",
                icon: <LoadingOutlined spin />,
                duration: 0,
            });
        }
        if (!isAddQuizzLoading && !addQuizzError && addedQuizz) {
            notification.success({
                key: "addQuizz",
                message: "Quizz added successfully",
                description: "Oh, that was fast. 🚀",
            });
        }
        if (!isAddQuizzLoading && addQuizzError) {
            notification.error({
                key: "addQuizz",
                message: "Failed to add quizz",
                description: "Please try again! 🥺",
            });
        }
    }, [isAddQuizzLoading, addQuizzError, addedQuizz]);

    useEffect(() => {
        if (isEditQuizzLoading) {
            notification.info({
                key: "editQuizz",
                message: "Updating Quizz",
                description: "Please wait a moment! 👍",
                icon: <LoadingOutlined spin />,
                duration: 0,
            });
        }
        if (!isEditQuizzLoading && !editQuizzError && editedQuizz) {
            notification.success({
                key: "editQuizz",
                message: "Quizz updated successfully",
                description: "Oh, that was fast. 🚀",
            });
        }
        if (!isEditQuizzLoading && editQuizzError) {
            notification.error({
                key: "editQuizz",
                message: "Failed to update quizz",
                description: "Please try again! 🥺",
            });
        }
    }, [isEditQuizzLoading, editQuizzError, editedQuizz]);

    useEffect(() => {
        if (isDeleteQuizzLoading) {
            notification.info({
                key: "deleteQuizz",
                message: "Deleting Quizz",
                description: "Please wait a moment! 👍",
                icon: <LoadingOutlined spin />,
                duration: 0,
            });
        }
        if (
            !isDeleteQuizzLoading &&
            !deleteQuizzError &&
            isDeleteQuizzSuccess
        ) {
            notification.success({
                key: "deleteQuizz",
                message: "Quizz deleted successfully",
                description: "Oh, that was fast. 🚀",
            });
        }
        if (!isDeleteQuizzLoading && deleteQuizzError) {
            notification.error({
                key: "deleteQuizz",
                message: "Failed to delete quizz",
                description: "Please try again! 🥺",
            });
        }
    }, [isDeleteQuizzSuccess, deleteQuizzError, isDeleteQuizzLoading]);

    return (
        <Auth.AdminOnly>
            <Head>
                <title>Quizzes</title>
            </Head>
            <Space
                align="center"
                className="w-full justify-between mb-6"
                size="large"
            >
                <Typography.Title level={5}>Quizzes</Typography.Title>
                <Button
                    type="primary"
                    onClick={() => handleModal("add")}
                    icon={<PlusCircleOutlined />}
                >
                    Add Quizz
                </Button>
            </Space>
            <Table
                bordered
                loading={isGetQuizzesLoading}
                columns={tableColumns}
                dataSource={quizzes?.results}
                pagination={{
                    total: quizzes?.totalResults,
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
                        ? isAddQuizzLoading
                        : modalType === "edit"
                        ? isEditQuizzLoading
                        : false
                }
                title={
                    modalType === "add"
                        ? "Add Quizz"
                        : modalType === "edit"
                        ? "Edit Quizz"
                        : "Quizz Details"
                }
            >
                <Typography.Text type="secondary">
                    {(modalType === "add" || modalType === "edit") &&
                        "Use markdown syntax for question and options."}
                </Typography.Text>

                {modalType === "view" ? (
                    <Descriptions layout="vertical">
                        <Descriptions.Item label="Question" span={24}>
                            <Typography.Text>
                                <ReactMarkdown>
                                    {form.getFieldValue("question")}
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
                        <Descriptions.Item label="Options" span={24}>
                            <Space direction="vertical">
                                {form
                                    .getFieldValue("options")
                                    ?.map((option: any) => (
                                        <Checkbox
                                            key={option.option}
                                            checked={option.isCorrect}
                                        >
                                            <Typography.Text>
                                                <ReactMarkdown>
                                                    {option.option}
                                                </ReactMarkdown>
                                            </Typography.Text>
                                        </Checkbox>
                                    ))}
                            </Space>
                        </Descriptions.Item>
                    </Descriptions>
                ) : (
                    <Form form={form} layout="vertical" onFinish={handleSubmit}>
                        <Form.Item
                            label="Question"
                            name="question"
                            tooltip="Use markdown syntax to format text"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input question!",
                                },
                            ]}
                        >
                            <Input placeholder="ex: Whats on your mind" />
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
                                placeholder="ex: Write something about your question"
                                autoSize={{ minRows: 4 }}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Video"
                            name="video"
                            rules={[
                                {
                                    required: true,
                                    message: "Please select video!",
                                },
                            ]}
                        >
                            <Common.DebounceSelect
                                placeholder="Select video"
                                form={form}
                            />
                        </Form.Item>
                        <Form.List
                            name="options"
                            initialValue={[
                                {
                                    option: "",
                                    isCorrect: false,
                                },
                                {
                                    option: "",
                                    isCorrect: false,
                                },
                            ]}
                            rules={[
                                {
                                    validator: async (_, fields) => {
                                        if (
                                            fields.filter(
                                                (field: {
                                                    isCorrect: boolean;
                                                }) => field.isCorrect === true
                                            ).length < 1
                                        ) {
                                            throw new Error(
                                                "Please select at least one correct option!"
                                            );
                                        }
                                        if (fields.length < 2) {
                                            throw new Error(
                                                "Please add at least two options!"
                                            );
                                        }
                                    },
                                },
                            ]}
                        >
                            {(fields, { add, remove }, { errors }) => (
                                <>
                                    {fields.map(({ key, name }) => (
                                        <div
                                            key={key}
                                            className="flex space-x-4 items-center"
                                        >
                                            <Form.Item
                                                style={{
                                                    flexGrow: 1,
                                                }}
                                                label={`Option ${key + 1}`}
                                                name={[name, "option"]}
                                                tooltip="Use markdown syntax to format text"
                                                required
                                                rules={[
                                                    {
                                                        required: true,
                                                        message:
                                                            "Please input option!",
                                                    },
                                                ]}
                                            >
                                                <Input placeholder="ex: Option 1" />
                                            </Form.Item>

                                            <Form.Item
                                                label="Check if correct"
                                                name={[name, "isCorrect"]}
                                                valuePropName="checked"
                                            >
                                                <Checkbox>Is Correct</Checkbox>
                                            </Form.Item>

                                            <Button
                                                size="small"
                                                danger
                                                onClick={() => remove(name)}
                                                icon={<MinusOutlined />}
                                            />
                                        </div>
                                    ))}

                                    <Form.Item>
                                        <Button
                                            type="dashed"
                                            onClick={() => add()}
                                            block
                                            icon={<PlusOutlined />}
                                        >
                                            Add Option
                                        </Button>
                                        <Form.ErrorList errors={errors} />
                                    </Form.Item>
                                </>
                            )}
                        </Form.List>
                    </Form>
                )}
            </Modal>
        </Auth.AdminOnly>
    );
};

export default Quizzes;
