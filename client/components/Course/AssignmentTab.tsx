import {
    Button,
    Card,
    Descriptions,
    Form,
    Input,
    Modal,
    Typography,
} from "antd";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { apiConfig } from "../../configs";
import { useAppSelector } from "../../hooks";
import { ModalType } from "../../interfaces";
import { useGetAssignmentsQuery } from "../../redux/features/assignments/assignmentsApi";
import {
    useAddAssignmentMarkMutation,
    useGetAssignmentsMarksQuery,
} from "../../redux/features/assignmentsMarks/assignmentsMarksApi";
import { selectUser } from "../../redux/features/auth/authSelector";

const modalTitle = {
    "submit-assignment": "Submit Assignment",
    "view-assignment": "View Assignment",
} as Record<ModalType, string>;

const modalOkText = {
    "submit-assignment": "Submit",
    "view-assignment": null,
} as Record<ModalType, string | null>;

const AssignmentTab: React.FC = () => {
    const router = useRouter();
    const user = useAppSelector(selectUser);
    const videoId = router.query.id as string;

    const [form] = Form.useForm();

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [modalType, setModalType] = useState<ModalType>("submit-assignment");

    const {
        data: assignment,
        isLoading: isGetAssignmentLoading,
        error: getAssignmentError,
    } = useGetAssignmentsQuery(
        {
            page: 1,
            limit: apiConfig.PAGE_SIZE,
            video: videoId as string,
        },
        {
            refetchOnMountOrArgChange: true,
            skip: !videoId,
        }
    );
    const {
        data: assignmentsMarks,
        isLoading: isGetAssignmentsMarksLoading,
        error: getAssignmentsMarksError,
    } = useGetAssignmentsMarksQuery({
        page: 1,
        limit: apiConfig.PAGE_SIZE,
        assignment: assignment?.results[0]?.id as string,
        student: user?.id as string,
    });
    const [
        addAssignmentMark,
        {
            data: addedAssignmentMark,
            isLoading: isAddAssignmentMarkLoading,
            error: addAssignmentMarkError,
        },
    ] = useAddAssignmentMarkMutation();

    const handleModal = (type: ModalType, data?: any) => {
        setModalType(type);
        setIsModalOpen(true);

        if (type === "submit-assignment") {
            form.resetFields();
            form.setFieldsValue({
                assignment: data.id,
                student: user.id,
            });
        }

        if (type === "view-assignment") {
            form.resetFields();
            form.setFieldsValue({
                repoLink: data.repoLink,
                webpageLink: data.webpageLink,
            });
        }
    };

    const handleSubmit = (values: any) => {
        if (modalType === "submit-assignment") {
            addAssignmentMark({
                assignment: form.getFieldValue("assignment"),
                student: form.getFieldValue("student"),
                repoLink: values.repoLink,
                webpageLink: values.webpageLink,
            });
        }
    };

    return (
        !isGetAssignmentLoading &&
        !isGetAssignmentsMarksLoading &&
        !getAssignmentError &&
        !getAssignmentsMarksError &&
        assignment &&
        assignmentsMarks &&
        assignment.results.length > 0 && (
            <>
                <h2 className="font-semibold text-lg mb-4">
                    <ReactMarkdown>{assignment.results[0].title}</ReactMarkdown>
                </h2>
                <div className="flex flex-row justify-between items-center mb-4">
                    <Typography.Text className="font-semibold">
                        Last date to submit -{" "}
                        <span
                            className={`font-bold ${
                                dayjs(assignment.results[0].dueDate) < dayjs()
                                    ? "text-red-500"
                                    : "text-green-500"
                            }`}
                        >
                            {dayjs(assignment.results[0].dueDate).fromNow()}
                        </span>
                        <span className="font-light">
                            {` (${dayjs(assignment.results[0].dueDate).format(
                                "DD-MMM-YYYY hh:mm a"
                            )})`}
                        </span>
                    </Typography.Text>
                    {dayjs(assignment.results[0].dueDate) > dayjs() &&
                        !(assignmentsMarks.totalResults > 0) && (
                            <Button
                                type="primary"
                                onClick={() =>
                                    handleModal(
                                        "submit-assignment",
                                        assignment.results[0]
                                    )
                                }
                            >
                                Submit Assignment
                            </Button>
                        )}
                </div>
                <div className="flex flex-row flex-wrap items-center mb-4">
                    <span className="font-semibold px-3 py-1 rounded-full bg-blue-500 text-white mr-2 mb-2">
                        Total marks - {assignment.results[0].totalMarks}
                    </span>
                    {assignmentsMarks.totalResults > 0 && (
                        <>
                            <span className="font-semibold px-3 py-1 rounded-full bg-green-500 text-white mr-2 mb-2">
                                Marks obtained -{" "}
                                {assignmentsMarks.results[0].status ===
                                "published"
                                    ? assignmentsMarks.results[0].marks
                                    : assignmentsMarks.results[0].status}
                            </span>
                            <Button
                                className="mb-2"
                                type="primary"
                                ghost
                                shape="round"
                                onClick={() =>
                                    handleModal(
                                        "view-assignment",
                                        assignmentsMarks.results[0]
                                    )
                                }
                            >
                                View submission
                            </Button>
                        </>
                    )}
                </div>

                {assignmentsMarks.totalResults > 0 &&
                    assignmentsMarks.results[0].status === "published" && (
                        <Card
                            style={{
                                marginBottom: "1rem",
                            }}
                            title="Course Instructor's Feedback"
                            bordered={false}
                        >
                            <Typography.Paragraph>
                                <ReactMarkdown>
                                    {
                                        assignmentsMarks.results[0]
                                            .feedback as string
                                    }
                                </ReactMarkdown>
                            </Typography.Paragraph>
                        </Card>
                    )}

                <div>
                    <p className="font-bold text-base mb-4 text-blue-500">
                        Assignment Detailed Description
                    </p>
                    <Typography.Paragraph>
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {assignment.results[0].description as string}
                        </ReactMarkdown>
                    </Typography.Paragraph>
                </div>

                <Modal
                    open={isModalOpen}
                    onCancel={() => setIsModalOpen(false)}
                    okText={modalOkText[modalType]}
                    onOk={() =>
                        modalType === "submit-assignment"
                            ? form.submit()
                            : setIsModalOpen(false)
                    }
                    confirmLoading={isAddAssignmentMarkLoading}
                    title={modalTitle[modalType]}
                >
                    {modalType === "submit-assignment" ? (
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleSubmit}
                        >
                            <Form.Item
                                label="Repo Link"
                                name="repoLink"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please input your repo link!",
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                label="Webpage Link"
                                name="webpageLink"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Please input your webpage link!",
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Form>
                    ) : modalType === "view-assignment" ? (
                        <Descriptions
                            bordered
                            column={1}
                            size="small"
                            className="w-full"
                        >
                            <Descriptions.Item label="Repo Link">
                                {assignmentsMarks?.results[0]?.repoLink}
                            </Descriptions.Item>
                            <Descriptions.Item label="Webpage Link">
                                {assignmentsMarks?.results[0]?.webpageLink}
                            </Descriptions.Item>
                        </Descriptions>
                    ) : null}
                </Modal>
            </>
        )
    );
};

export default AssignmentTab;
