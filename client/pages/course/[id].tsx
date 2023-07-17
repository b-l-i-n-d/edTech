import {
    ArrowLeftOutlined,
    ArrowRightOutlined,
    CheckCircleFilled,
    CloseCircleFilled,
    InfoCircleOutlined,
    MinusCircleFilled,
    PlayCircleOutlined,
    QuestionOutlined,
} from "@ant-design/icons";
import type { TabsProps } from "antd";
import {
    Badge,
    Button,
    Card,
    Checkbox,
    Col,
    Collapse,
    Descriptions,
    Divider,
    Form,
    Input,
    List,
    Modal,
    Progress,
    Row,
    Skeleton,
    Spin,
    Tabs,
    Typography,
} from "antd";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import _map from "lodash/map";
import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import VirtualList from "rc-virtual-list";
import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import ReactPlayer from "react-player";
import { Auth } from "../../components";
import { apiConfig } from "../../configs";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { IVideo } from "../../interfaces";
import { useGetAssignmentsQuery } from "../../redux/features/assignments/assignmentsApi";
import {
    useAddAssignmentMarkMutation,
    useGetAssignmentsMarksQuery,
} from "../../redux/features/assignmentsMarks/assignmentsMarksApi";
import {
    useAddQuizzMarkMutation,
    useGetQuizzMarksQuery,
} from "../../redux/features/quizzMarks/quizzMarksApi";
import { useGetQuizzesQuery } from "../../redux/features/quizzes/quizzesApi";
import { useUpdateUserMutation } from "../../redux/features/users/usersApi";
import {
    useGetVideoQuery,
    useLazyGetVideosQuery,
} from "../../redux/features/videos/videosApi";
import { videoSelected } from "../../redux/features/videos/videosSlice";

dayjs.extend(relativeTime);

type ModalType =
    | "submit-assignment"
    | "submit-quizz"
    | "view-assignment"
    | "view-quizz";

const CoursePlayer: NextPage = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const videoId = router.query.id;
    const user = useAppSelector((state) => state.auth.user);

    const [form] = Form.useForm();

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [listData, setListData] = useState<IVideo[]>([]);
    const [modalType, setModalType] = useState<ModalType>("submit-assignment");

    const [
        getVideos,
        { data: videos, isLoading: isGetVideosLoading, error: getVideosError },
    ] = useLazyGetVideosQuery();
    const {
        data: video,
        isLoading: isGetVideoLoading,
        error: getVideoError,
    } = useGetVideoQuery(videoId as string, {
        refetchOnMountOrArgChange: true,
        skip: !videoId,
    });
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
    const [
        addQuizzMark,
        {
            data: addedQuizzMark,
            isLoading: isAddQuizzMarkLoading,
            error: addQuizzMarkError,
        },
    ] = useAddQuizzMarkMutation();
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
        upadteUser,
        {
            data: updatedUser,
            isLoading: isUpdateUserLoading,
            error: updateUserError,
        },
    ] = useUpdateUserMutation();

    const handleScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
        const { target }: any = e;
        if (
            target.scrollTop + target.clientHeight + 1 >= target.scrollHeight &&
            !isGetVideosLoading &&
            !getVideosError &&
            videos &&
            videos.totalResults > listData.length
        ) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    const isPrevVideoId = () => {
        const index = listData.findIndex((item) => item.id === videoId);
        return index > 0 ? listData[index - 1].id : null;
    };

    const isNextVideoId = () => {
        const index = listData.findIndex((item) => item.id === videoId);
        return index < listData.length - 1 ? listData[index + 1].id : null;
    };

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

        if (type === "submit-quizz") {
            //
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
        } else if (modalType === "submit-quizz") {
            const data = _map(values, (value, key) => ({ [key]: value }));
            console.log(data);
            addQuizzMark({
                selectedAnswers: data,
                student: user.id,
                video: videoId as string,
            });
        }
    };

    const checkOptionSelected = (
        arr: object[],
        quizzId: string,
        optionId: string
    ): boolean => {
        console.log(arr, quizzId, optionId);
        return arr.some((obj: any) => {
            const quizzKeys = Object.keys(obj);
            if (quizzKeys.includes(quizzId)) {
                const values = obj[quizzId];
                console.log(values.includes(optionId));
                return values.includes(optionId);
            }
            return false;
        });
    };

    const videoTab = !isGetVideoLoading && !getVideoError && video && (
        <Row>
            <Col
                xs={{
                    span: 24,
                }}
                md={{
                    span: 0,
                }}
            >
                <Collapse ghost expandIconPosition="end">
                    <Collapse.Panel
                        header={
                            <Typography.Title level={4}>
                                <ReactMarkdown>
                                    {video.title ? video.title : "No title"}
                                </ReactMarkdown>
                            </Typography.Title>
                        }
                        key="1"
                    >
                        <Typography.Paragraph>
                            {video.description ? (
                                <ReactMarkdown>
                                    {video.description}
                                </ReactMarkdown>
                            ) : (
                                "No description"
                            )}
                        </Typography.Paragraph>
                    </Collapse.Panel>
                </Collapse>
            </Col>
            <Col
                xs={{
                    span: 0,
                }}
                md={{
                    span: 24,
                }}
            >
                <Typography.Title level={4}>
                    <ReactMarkdown>
                        {video.title ? video.title : "No title"}
                    </ReactMarkdown>
                </Typography.Title>
                <Typography.Paragraph>
                    {video.description ? (
                        <ReactMarkdown>{video.description}</ReactMarkdown>
                    ) : (
                        "No description"
                    )}
                </Typography.Paragraph>
            </Col>
        </Row>
    );

    const assignmentTab = !isGetAssignmentLoading &&
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

                <div>
                    <p className="font-bold text-base mb-4 text-blue-500">
                        Assignment Detailed Description
                    </p>
                    <Typography.Paragraph>
                        <ReactMarkdown>
                            {assignment.results[0].description as string}
                        </ReactMarkdown>
                    </Typography.Paragraph>
                </div>
            </>
        );

    const quizzTab = !isGetQuizzesLoading &&
        !getQuizzesError &&
        quizzes &&
        quizzes.results.length > 0 && (
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
                                      onClick={() => handleModal("view-quizz")}
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
                        <span className="font-semibold">Total questions</span>
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
                                            quizzMark.results[0].totalCorrect
                                        }
                                        style={{ backgroundColor: "#52c41a" }}
                                    />
                                </div>
                                <div className="flex flex-row justify-between">
                                    <span className="font-semibold">
                                        Wrong answers
                                    </span>
                                    <Badge
                                        showZero
                                        status="error"
                                        count={quizzMark.results[0].totalWrong}
                                        style={{ backgroundColor: "#f5222d" }}
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
        );

    const tabItems: TabsProps["items"] = [
        {
            key: "video-description",
            label: <span className="font-bold">Video Description</span>,
            children: videoTab,
        },
        !isGetAssignmentLoading &&
            !getAssignmentError &&
            assignment &&
            assignment.results.length > 0 && {
                key: "assignment-description",
                label: <span className="font-bold">Assignment</span>,
                children: assignmentTab,
            },
        !isGetQuizzesLoading &&
            !getQuizzesError &&
            quizzes &&
            quizzes.results.length > 0 && {
                key: "quizzes",
                label: <span className="font-bold">Quizzes</span>,
                children: quizzTab,
            },
    ].filter(Boolean) as TabsProps["items"];

    useEffect(() => {
        getVideos({
            page: currentPage,
            limit: apiConfig.PAGE_SIZE,
        });
    }, [currentPage, getVideos]);

    useEffect(() => {
        if (!isGetVideosLoading && !getVideosError && videos) {
            setListData((prevOptions) => {
                const newOptions = [...prevOptions, ...videos.results];

                const uniqueOptions = newOptions.filter(
                    (option, index, self) =>
                        index === self.findIndex((t) => t.id === option.id)
                );

                return uniqueOptions;
            });
        }
    }, [isGetVideosLoading, getVideosError, videos]);

    useEffect(() => {
        if (videoId) {
            dispatch(videoSelected(videoId as string));
        }
    }, [dispatch, videoId]);

    useEffect(() => {
        if (
            !isAddAssignmentMarkLoading &&
            !addAssignmentMarkError &&
            addedAssignmentMark
        ) {
            setIsModalOpen(false);
        }
    }, [
        isAddAssignmentMarkLoading,
        addAssignmentMarkError,
        addedAssignmentMark,
    ]);

    useEffect(() => {
        if (!isAddQuizzMarkLoading && !addQuizzMarkError && addedQuizzMark) {
            setIsModalOpen(false);
        }
    }, [isAddQuizzMarkLoading, addQuizzMarkError, addedQuizzMark]);

    return (
        <Auth.UserOnly>
            <Head>
                <title>Course Player</title>
            </Head>
            <Row
                gutter={{
                    xs: 8,
                    sm: 16,
                    md: 24,
                    lg: 32,
                }}
            >
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
                    className="space-y-4 mb-4 md:mb-4"
                >
                    <Spin spinning={isGetVideoLoading}>
                        <div className="aspect-video">
                            <ReactPlayer
                                width={"100%"}
                                height={"100%"}
                                url={
                                    !isGetVideoLoading &&
                                    !getVideoError &&
                                    video &&
                                    video.url
                                        ? video.url
                                        : ""
                                }
                                controls
                                light={
                                    !isGetVideoLoading &&
                                    !getVideoError &&
                                    video &&
                                    video.thumbnail ? (
                                        video.thumbnail
                                    ) : (
                                        <Skeleton.Image />
                                    )
                                }
                                onEnded={() => {
                                    if (isNextVideoId()) {
                                        router.push(
                                            `/course/${isNextVideoId()}`
                                        );
                                    }
                                    upadteUser({
                                        id: user.id,
                                        watchedVideos: [videoId as string],
                                    });
                                }}
                            />
                        </div>
                    </Spin>

                    <div className="flex justify-between items-center flex-wrap">
                        <Button type="primary" disabled={!isPrevVideoId()}>
                            <span
                                className="flex items-center"
                                onClick={
                                    !isPrevVideoId()
                                        ? () => {}
                                        : () =>
                                              router.push(
                                                  `/course/${isPrevVideoId()}`
                                              )
                                }
                            >
                                <ArrowLeftOutlined className="mr-2" />
                                Previous Video
                            </span>
                        </Button>
                        <Button type="primary" disabled={!isNextVideoId()}>
                            <span
                                className="flex items-center"
                                onClick={
                                    !isNextVideoId()
                                        ? () => {}
                                        : () =>
                                              router.push(
                                                  `/course/${isNextVideoId()}`
                                              )
                                }
                            >
                                Next Video
                                <ArrowRightOutlined className="ml-2" />
                            </span>
                        </Button>
                    </div>

                    <Tabs
                        defaultActiveKey="video-description"
                        items={tabItems}
                    />
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
                    <List
                        loading={isGetVideosLoading}
                        className="border-2 rounded-lg"
                        header={
                            <Typography.Title level={5} className="px-4 pt-4">
                                {`Progress: ${
                                    (user.watchedVideos.length /
                                        (videos?.totalResults ?? 0)) *
                                    100
                                }% (${user.watchedVideos.length}/${
                                    videos?.totalResults ?? 0
                                })`}
                            </Typography.Title>
                        }
                        size="small"
                    >
                        <VirtualList
                            className="pb-4"
                            data={listData}
                            height={420}
                            itemHeight={30}
                            itemKey="id"
                            onScroll={handleScroll}
                        >
                            {(item: IVideo) => (
                                <List.Item
                                    className={
                                        videoId === item.id
                                            ? "bg-blue-100/70"
                                            : "hover:bg-gray-100"
                                    }
                                    key={item.id}
                                    style={{
                                        paddingInline: "16px",
                                        cursor: "pointer",
                                    }}
                                    onClick={() =>
                                        router.push(`/course/${item.id}`)
                                    }
                                >
                                    <List.Item.Meta
                                        avatar={
                                            <PlayCircleOutlined
                                                style={{
                                                    fontSize: "24px",
                                                    marginTop: "8px",
                                                }}
                                            />
                                        }
                                        title={
                                            <Typography.Text strong ellipsis>
                                                {item.title}
                                            </Typography.Text>
                                        }
                                        description={`${new Date(
                                            item.duration * 1000
                                        )
                                            .toISOString()
                                            .substring(11, 19)} miniutes`}
                                    />
                                    <div>
                                        {user.watchedVideos.includes(
                                            item.id
                                        ) && (
                                            <CheckCircleFilled
                                                className="text-green-500"
                                                style={{
                                                    fontSize: "16px",
                                                }}
                                            />
                                        )}
                                    </div>
                                </List.Item>
                            )}
                        </VirtualList>
                    </List>
                </Col>
            </Row>
            <Modal
                width={
                    !(
                        modalType === "submit-assignment" ||
                        modalType === "view-assignment"
                    )
                        ? "80%"
                        : undefined
                }
                style={
                    !(
                        modalType === "submit-assignment" ||
                        modalType === "view-assignment"
                    )
                        ? { top: 20 }
                        : undefined
                }
                bodyStyle={{
                    maxHeight: "80vh",
                    overflowY: "auto",
                    paddingRight: "8px",
                }}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                okText={
                    modalType === "submit-assignment" ||
                    modalType === "submit-quizz"
                        ? "Submit"
                        : null
                }
                onOk={() =>
                    modalType === "submit-assignment" ||
                    modalType === "submit-quizz"
                        ? form.submit()
                        : setIsModalOpen(false)
                }
                confirmLoading={
                    isAddAssignmentMarkLoading || isAddQuizzMarkLoading
                }
                title={
                    modalType === "submit-assignment"
                        ? "Submit Assignment"
                        : modalType === "submit-quizz"
                        ? "Submit Quiz"
                        : modalType === "view-assignment"
                        ? "View Assignment"
                        : modalType === "view-quizz"
                        ? "View Quiz"
                        : null
                }
            >
                {modalType === "submit-assignment" && (
                    <Form form={form} layout="vertical" onFinish={handleSubmit}>
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
                                    message: "Please input your webpage link!",
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Form>
                )}

                {modalType === "view-assignment" && (
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
                )}

                {modalType === "submit-quizz" && (
                    <Form form={form} layout="vertical" onFinish={handleSubmit}>
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
                                                message: "Please input answer!",
                                            },
                                        ]}
                                    >
                                        <Checkbox.Group className="w-full">
                                            <Row gutter={[16, 16]}>
                                                {quizz.options.map((option) => (
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
                                                            value={option._id}
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
                                                ))}
                                            </Row>
                                        </Checkbox.Group>
                                    </Form.Item>
                                    {index !== quizzes.totalResults - 1 && (
                                        <Divider />
                                    )}
                                </>
                            ))}
                    </Form>
                )}
                {modalType === "view-quizz" &&
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
                                                        <Typography.Text strong>
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
                                                        <Typography.Text strong>
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
                                                        <Typography.Text strong>
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
                                                        <Typography.Text strong>
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
                                                        <Typography.Text strong>
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
                                                    type="circle"
                                                    percent={
                                                        (quizzMark.results[0]
                                                            .marks /
                                                            quizzMark.results[0]
                                                                .totalMarks) *
                                                        100
                                                    }
                                                />
                                            </div>
                                            <Typography.Title
                                                level={3}
                                                className="text-center"
                                            >
                                                {quizzMark.results[0].marks} /{" "}
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
                                                {quizz.options.map((option) => (
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
                                                            value={option._id}
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
                                                ))}
                                            </Row>
                                        </Descriptions.Item>
                                        {index !== quizzes.totalResults - 1 && (
                                            <Divider />
                                        )}
                                    </>
                                ))}
                        </Descriptions>
                    )}
            </Modal>
        </Auth.UserOnly>
    );
};

export default CoursePlayer;
