import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import type { TabsProps } from "antd";
import { Button, Col, Row, Skeleton, Spin, Tabs } from "antd";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player/lazy";
import { Auth, Course } from "../../components";
import { apiConfig } from "../../configs";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { IVideo } from "../../interfaces";
import { useGetAssignmentsQuery } from "../../redux/features/assignments/assignmentsApi";
import { selectUser } from "../../redux/features/auth/authSelector";
import { useGetQuizzesQuery } from "../../redux/features/quizzes/quizzesApi";
import { useUpdateUserMutation } from "../../redux/features/users/usersApi";
import {
    useGetVideoQuery,
    useLazyGetVideosQuery,
} from "../../redux/features/videos/videosApi";
import { videoSelected } from "../../redux/features/videos/videosSlice";

dayjs.extend(relativeTime);

const CoursePlayer: NextPage = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const videoId = router.query.id;
    const user = useAppSelector(selectUser);

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [listData, setListData] = useState<IVideo[]>([]);

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

    const tabItems: TabsProps["items"] = [
        {
            key: "video-description",
            label: <span className="font-bold">Video Description</span>,
            children: <Course.VideoTab />,
        },
        !isGetAssignmentLoading &&
            !getAssignmentError &&
            assignment &&
            assignment.results.length > 0 && {
                key: "assignment-description",
                label: <span className="font-bold">Assignment</span>,
                children: <Course.AssignmentTab />,
            },
        !isGetQuizzesLoading &&
            !getQuizzesError &&
            quizzes &&
            quizzes.results.length > 0 && {
                key: "quizzes",
                label: <span className="font-bold">Quizzes</span>,
                children: <Course.QuizzTab />,
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

    return (
        <Auth.UserOnly>
            <Head>
                <title>Course Player</title>
            </Head>
            <Row
                gutter={{
                    xs: 8,
                    sm: 16,
                    md: 16,
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
                        span: 24,
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
                        span: 24,
                    }}
                    lg={{
                        span: 8,
                    }}
                >
                    <Course.VideoList
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        listData={listData}
                        setListData={setListData}
                    />
                </Col>
            </Row>
        </Auth.UserOnly>
    );
};

export default CoursePlayer;
