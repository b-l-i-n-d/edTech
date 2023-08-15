import {
    CheckCircleFilled,
    CloseCircleFilled,
    InfoCircleOutlined,
    MinusCircleFilled,
    QuestionOutlined,
} from "@ant-design/icons";
import {
    Badge,
    Button,
    Card,
    Checkbox,
    Col,
    Descriptions,
    Divider,
    Form,
    List,
    Modal,
    Progress,
    Row,
    Typography,
} from "antd";
import _map from "lodash/map";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { apiConfig } from "../../configs";
import { useAppSelector } from "../../hooks";
import { ModalType } from "../../interfaces";
import { selectUser } from "../../redux/features/auth/authSelector";
import {
    useAddQuizzMarkMutation,
    useGetQuizzMarksQuery,
} from "../../redux/features/quizzMarks/quizzMarksApi";
import { useGetQuizzesQuery } from "../../redux/features/quizzes/quizzesApi";
import { useGetVideoQuery } from "../../redux/features/videos/videosApi";

const checkOptionSelected = (
    arr: object[],
    quizzId: string,
    optionId: string
): boolean => {
    return arr.some((obj: any) => {
        const quizzKeys = Object.keys(obj);
        if (quizzKeys.includes(quizzId)) {
            const values = obj[quizzId];
            return values.includes(optionId);
        }
        return false;
    });
};

const modalTitle = {
    "submit-quizz": "Submit Quiz",
    "view-quizz": "View Quiz",
} as Record<ModalType, string>;

const modalOkText = {
    "submit-quizz": "Submit",
    "view-quizz": null,
} as Record<ModalType, string | null>;

const QuizzTab: React.FC = () => {
    const router = useRouter();
    const videoId = router.query.id as string;
    const user = useAppSelector(selectUser);

    const [form] = Form.useForm();

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [modalType, setModalType] = useState<ModalType>("submit-quizz");

    const {
        data: video,
        isLoading: isGetVideoLoading,
        error: getVideoError,
    } = useGetVideoQuery(videoId as string, {
        refetchOnMountOrArgChange: true,
        skip: !videoId,
    });
    const {
        data: quizzes,
        isLoading: isGetQuizzesLoading,
        error: getQuizzesError,
    } = useGetQuizzesQuery(
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
        data: quizzMark,
        isLoading: isGetQuizzMarkLoading,
        error: getQuizzMarkError,
    } = useGetQuizzMarksQuery(
        {
            video: videoId as string,
            student: user?.id as string,
            page: 1,
            limit: apiConfig.PAGE_SIZE,
        },
        {
            refetchOnMountOrArgChange: true,
            skip: !videoId,
        }
    );
    const [
        addQuizzMark,
        {
            data: addedQuizzMark,
            isLoading: isAddQuizzMarkLoading,
            error: addQuizzMarkError,
        },
    ] = useAddQuizzMarkMutation();

    const handleModal = (type: ModalType, data?: any) => {
        setModalType(type);
        setIsModalOpen(true);
    };

    const handleSubmit = (values: any) => {
        if (modalType === "submit-quizz") {
            const data = _map(values, (value, key) => ({ [key]: value }));
            addQuizzMark({
                selectedAnswers: data,
                student: user.id,
                video: videoId as string,
            });
        }
    };

    useEffect(() => {
        if (!isAddQuizzMarkLoading && !addQuizzMarkError && addedQuizzMark) {
            setIsModalOpen(false);
        }
    }, [isAddQuizzMarkLoading, addQuizzMarkError, addedQuizzMark]);

    return (
        !isGetQuizzesLoading &&
        !getQuizzesError &&
        quizzes &&
        quizzes.results.length > 0 && (
            <>
                <Card
                    bodyStyle={{ padding: "0px" }}
                    className="max-w-xs overflow-clip shadow"
                    actions={
                        !isGetQuizzMarkLoading &&
                        !getQuizzMarkError &&
                        quizzMark &&
                        quizzMark.totalResults > 0
                            ? [
                                  <div key={"start-quizz"} className="mx-2">
                                      <Button
                                          type="primary"
                                          block
                                          ghost
                                          icon={
                                              <QuestionOutlined className="font-semibold" />
                                          }
                                          onClick={() =>
                                              handleModal("view-quizz")
                                          }
                                      >
                                          <span className="font-semibold">
                                              View Answer
                                          </span>
                                      </Button>
                                  </div>,
                              ]
                            : [
                                  <div key={"start-quizz"} className="mx-2">
                                      <Button
                                          type="primary"
                                          block
                                          ghost
                                          icon={
                                              <QuestionOutlined className="font-semibold" />
                                          }
                                          onClick={() =>
                                              handleModal("submit-quizz")
                                          }
                                      >
                                          <span className="font-semibold">
                                              Start Quizz
                                          </span>
                                      </Button>
                                  </div>,
                              ]
                    }
                >
                    <div
                        className="flex text-center items-center justify-center font-semibold text-lg h-40 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600"
                        style={{
                            color: "white",
                        }}
                    >
                        <h3 className="px-2">{video && video.title} quizzes</h3>
                    </div>
                    <div className="space-y-4 p-4">
                        <div className="flex flex-row justify-between">
                            <span className="font-semibold">Total marks</span>
                            <Badge
                                count={quizzes.totalResults * 5}
                                style={{ backgroundColor: "#1890ff" }}
                            />
                        </div>
                        <div className="flex flex-row justify-between">
                            <span className="font-semibold">
                                Total questions
                            </span>
                            <Badge
                                count={quizzes.totalResults}
                                style={{ backgroundColor: "#1890ff" }}
                            />
                        </div>
                        {!isGetQuizzMarkLoading &&
                            !getQuizzMarkError &&
                            quizzMark &&
                            quizzMark.totalResults > 0 && (
                                <>
                                    <div className="flex flex-row justify-between">
                                        <span className="font-semibold">
                                            Correct answers
                                        </span>
                                        <Badge
                                            showZero
                                            status="success"
                                            count={
                                                quizzMark.results[0]
                                                    .totalCorrect
                                            }
                                            style={{
                                                backgroundColor: "#52c41a",
                                            }}
                                        />
                                    </div>
                                    <div className="flex flex-row justify-between">
                                        <span className="font-semibold">
                                            Wrong answers
                                        </span>
                                        <Badge
                                            showZero
                                            status="error"
                                            count={
                                                quizzMark.results[0].totalWrong
                                            }
                                            style={{
                                                backgroundColor: "#f5222d",
                                            }}
                                        />
                                    </div>
                                    <div className="flex flex-row justify-between">
                                        <span className="font-semibold">
                                            Your marks
                                        </span>
                                        <Badge
                                            showZero
                                            status="warning"
                                            count={quizzMark.results[0].marks}
                                        />
                                    </div>
                                </>
                            )}
                    </div>
                </Card>
                <Modal
                    open={isModalOpen}
                    width={"80%"}
                    style={{
                        top: "20px",
                    }}
                    onCancel={() => setIsModalOpen(false)}
                    okText={modalOkText[modalType]}
                    onOk={() =>
                        modalType === "submit-quizz"
                            ? form.submit()
                            : setIsModalOpen(false)
                    }
                    confirmLoading={isAddQuizzMarkLoading}
                    title={modalTitle[modalType]}
                >
                    {modalType === "submit-quizz" ? (
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleSubmit}
                        >
                            {!isGetQuizzesLoading &&
                                quizzes &&
                                quizzes.totalResults > 0 &&
                                quizzes.results.map((quizz, index) => (
                                    <>
                                        <Form.Item
                                            key={quizz.id}
                                            label={
                                                <span className="text-lg font-semibold inline-flex whitespace-pre">
                                                    {index + 1}.{" "}
                                                    <ReactMarkdown>
                                                        {quizz.question}
                                                    </ReactMarkdown>
                                                </span>
                                            }
                                            name={quizz.id}
                                            valuePropName="checked"
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Please select answer!",
                                                },
                                            ]}
                                        >
                                            <Checkbox.Group className="w-full">
                                                <Row gutter={[16, 16]}>
                                                    {quizz.options.map(
                                                        (option) => (
                                                            <Col
                                                                key={option._id}
                                                                xs={{
                                                                    span: 24,
                                                                }}
                                                                sm={{
                                                                    span: 24,
                                                                }}
                                                                md={{
                                                                    span: 12,
                                                                }}
                                                                lg={{
                                                                    span: 12,
                                                                }}
                                                            >
                                                                <Checkbox
                                                                    value={
                                                                        option._id
                                                                    }
                                                                >
                                                                    <span>
                                                                        <ReactMarkdown>
                                                                            {
                                                                                option.option
                                                                            }
                                                                        </ReactMarkdown>
                                                                    </span>
                                                                </Checkbox>
                                                            </Col>
                                                        )
                                                    )}
                                                </Row>
                                            </Checkbox.Group>
                                        </Form.Item>
                                        {index !== quizzes.totalResults - 1 && (
                                            <Divider />
                                        )}
                                    </>
                                ))}
                        </Form>
                    ) : modalType === "view-quizz" ? (
                        !isGetQuizzMarkLoading &&
                        !getQuizzMarkError &&
                        quizzMark &&
                        quizzMark.results.length > 0 && (
                            <Descriptions layout="vertical" column={1}>
                                <Descriptions.Item label="What you need to know to understand the answer">
                                    <Row gutter={[16, 16]} className="w-full">
                                        <Col
                                            xs={{
                                                span: 24,
                                            }}
                                            sm={{
                                                span: 24,
                                            }}
                                            md={{
                                                span: 16,
                                            }}
                                            lg={{
                                                span: 16,
                                            }}
                                        >
                                            <List size="small">
                                                <List.Item>
                                                    <List.Item.Meta
                                                        avatar={
                                                            <CheckCircleFilled
                                                                className="text-green-500"
                                                                style={{
                                                                    fontSize:
                                                                        "24px",
                                                                }}
                                                            />
                                                        }
                                                        title={
                                                            <Typography.Text
                                                                strong
                                                            >
                                                                Correct Answer
                                                            </Typography.Text>
                                                        }
                                                        description="Answers marked in green are correct answers and you selected it. But answers marked with blue are also correct but you didn't select it."
                                                    />
                                                </List.Item>
                                                <List.Item>
                                                    <List.Item.Meta
                                                        avatar={
                                                            <CloseCircleFilled
                                                                className="text-red-500"
                                                                style={{
                                                                    fontSize:
                                                                        "24px",
                                                                }}
                                                            />
                                                        }
                                                        title={
                                                            <Typography.Text
                                                                strong
                                                            >
                                                                Wrong Answer
                                                            </Typography.Text>
                                                        }
                                                        description="The answer marked in red is the wrong answer. Red will be shown only when you select the wrong answer"
                                                    />
                                                </List.Item>
                                                <List.Item>
                                                    <List.Item.Meta
                                                        avatar={
                                                            <MinusCircleFilled
                                                                className="text-blue-500"
                                                                style={{
                                                                    fontSize:
                                                                        "24px",
                                                                }}
                                                            />
                                                        }
                                                        title={
                                                            <Typography.Text
                                                                strong
                                                            >
                                                                Answered
                                                            </Typography.Text>
                                                        }
                                                        description="You selected the tick marked answer"
                                                    />
                                                </List.Item>
                                                <List.Item>
                                                    <List.Item.Meta
                                                        avatar={
                                                            <InfoCircleOutlined
                                                                className="text-gray-500"
                                                                style={{
                                                                    fontSize:
                                                                        "24px",
                                                                }}
                                                            />
                                                        }
                                                        title={
                                                            <Typography.Text
                                                                strong
                                                            >
                                                                How to get full
                                                                marks?
                                                            </Typography.Text>
                                                        }
                                                        description="You will get full marks only when
                                                all your ticked answers exactly
                                                match the green marked answers and
                                                you don't see any red marks or
                                                cross marks."
                                                    />
                                                </List.Item>
                                                <List.Item>
                                                    <List.Item.Meta
                                                        avatar={
                                                            <InfoCircleOutlined
                                                                className="text-gray-500"
                                                                style={{
                                                                    fontSize:
                                                                        "24px",
                                                                }}
                                                            />
                                                        }
                                                        title={
                                                            <Typography.Text
                                                                strong
                                                            >
                                                                Condition
                                                            </Typography.Text>
                                                        }
                                                        description="Questions may have more than one
                                                correct answer. If you do not select
                                                all the correct answers or select
                                                one/more wrong answers after
                                                selecting all the correct ones, then
                                                full marks will be deducted."
                                                    />
                                                </List.Item>
                                            </List>
                                        </Col>
                                        <Col
                                            xs={{
                                                span: 24,
                                            }}
                                            sm={{
                                                span: 24,
                                            }}
                                            md={{
                                                span: 8,
                                            }}
                                            lg={{
                                                span: 8,
                                            }}
                                        >
                                            <Card
                                                title="Your Score"
                                                className="w-full"
                                            >
                                                <div className="flex justify-center mb-4">
                                                    <Progress
                                                        type="dashboard"
                                                        format={(percent) =>
                                                            `${percent}%`
                                                        }
                                                        percent={
                                                            (
                                                                (quizzMark
                                                                    .results[0]
                                                                    .marks /
                                                                    quizzMark
                                                                        .results[0]
                                                                        .totalMarks) as any
                                                            ).toFixed(3) * 100
                                                        }
                                                    />
                                                </div>
                                                <Typography.Title
                                                    level={3}
                                                    className="text-center"
                                                >
                                                    {quizzMark.results[0].marks}{" "}
                                                    /{" "}
                                                    {
                                                        quizzMark.results[0]
                                                            .totalMarks
                                                    }
                                                </Typography.Title>
                                            </Card>
                                        </Col>
                                    </Row>
                                </Descriptions.Item>
                                {!isGetQuizzesLoading &&
                                    quizzes &&
                                    quizzes.totalResults > 0 &&
                                    quizzes.results.map((quizz, index) => (
                                        <>
                                            <Descriptions.Item>
                                                <span className="text-lg font-semibold inline-flex whitespace-pre">
                                                    {index + 1}.{" "}
                                                    <ReactMarkdown>
                                                        {quizz.question}
                                                    </ReactMarkdown>
                                                </span>
                                            </Descriptions.Item>
                                            <Descriptions.Item key={quizz.id}>
                                                <Row
                                                    gutter={[16, 16]}
                                                    className="w-full"
                                                >
                                                    {quizz.options.map(
                                                        (option) => (
                                                            <Col
                                                                key={option._id}
                                                                xs={{
                                                                    span: 24,
                                                                }}
                                                                sm={{
                                                                    span: 24,
                                                                }}
                                                                md={{
                                                                    span: 12,
                                                                }}
                                                                lg={{
                                                                    span: 12,
                                                                }}
                                                            >
                                                                <Checkbox
                                                                    value={
                                                                        option._id
                                                                    }
                                                                    checked={checkOptionSelected(
                                                                        quizzMark
                                                                            .results[0]
                                                                            .selectedAnswers,
                                                                        quizz.id,
                                                                        option._id as string
                                                                    )}
                                                                    style={
                                                                        checkOptionSelected(
                                                                            quizzMark
                                                                                .results[0]
                                                                                .correctAnswers,
                                                                            quizz.id,
                                                                            option._id as string
                                                                        ) &&
                                                                        checkOptionSelected(
                                                                            quizzMark
                                                                                .results[0]
                                                                                .selectedAnswers,
                                                                            quizz.id,
                                                                            option._id as string
                                                                        )
                                                                            ? {
                                                                                  backgroundColor:
                                                                                      "rgba(221,255,221,1.00)",
                                                                                  width: "100%",
                                                                                  padding:
                                                                                      "0.5rem",
                                                                                  borderRadius:
                                                                                      "0.5rem",
                                                                              }
                                                                            : checkOptionSelected(
                                                                                  quizzMark
                                                                                      .results[0]
                                                                                      .correctAnswers,
                                                                                  quizz.id,
                                                                                  option._id as string
                                                                              )
                                                                            ? {
                                                                                  backgroundColor:
                                                                                      // transparent blueish
                                                                                      "rgba(135, 183, 251, 0.3)",
                                                                                  width: "100%",
                                                                                  padding:
                                                                                      "0.5rem",
                                                                                  borderRadius:
                                                                                      "0.5rem",
                                                                              }
                                                                            : checkOptionSelected(
                                                                                  quizzMark
                                                                                      .results[0]
                                                                                      .selectedAnswers,
                                                                                  quizz.id,
                                                                                  option._id as string
                                                                              )
                                                                            ? {
                                                                                  backgroundColor:
                                                                                      // transparent redish
                                                                                      "rgba(255, 131, 128, 0.3)",
                                                                                  width: "100%",
                                                                                  padding:
                                                                                      "0.5rem",
                                                                                  borderRadius:
                                                                                      "0.5rem",
                                                                              }
                                                                            : {
                                                                                  width: "100%",
                                                                                  padding:
                                                                                      "0.5rem",
                                                                                  borderRadius:
                                                                                      "0.5rem",
                                                                              }
                                                                    }
                                                                >
                                                                    <Typography.Text>
                                                                        <ReactMarkdown>
                                                                            {
                                                                                option.option
                                                                            }
                                                                        </ReactMarkdown>
                                                                    </Typography.Text>
                                                                </Checkbox>
                                                            </Col>
                                                        )
                                                    )}
                                                </Row>
                                            </Descriptions.Item>
                                            {index !==
                                                quizzes.totalResults - 1 && (
                                                <Divider />
                                            )}
                                        </>
                                    ))}
                            </Descriptions>
                        )
                    ) : null}
                </Modal>
            </>
        )
    );
};

export default QuizzTab;
