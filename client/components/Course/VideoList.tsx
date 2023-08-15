import { CheckCircleFilled, PlayCircleOutlined } from "@ant-design/icons";
import { List, Typography } from "antd";
import { useRouter } from "next/router";
import VirtualList from "rc-virtual-list";
import React, { useEffect } from "react";
import { apiConfig } from "../../configs";
import { useAppSelector } from "../../hooks";
import { IVideo } from "../../interfaces";
import { selectUser } from "../../redux/features/auth/authSelector";
import { useGetVideosQuery } from "../../redux/features/videos/videosApi";

interface IProps {
    currentPage: number;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
    listData: IVideo[];
    setListData: React.Dispatch<React.SetStateAction<IVideo[]>>;
}

const VideoList: React.FC<IProps> = ({
    currentPage,
    setCurrentPage,
    listData,
    setListData,
}) => {
    const router = useRouter();
    const user = useAppSelector(selectUser);
    const videoId = router.query.id as string;

    const {
        data: videos,
        isLoading: isGetVideosLoading,
        error: getVideosError,
    } = useGetVideosQuery({
        page: currentPage,
        limit: apiConfig.PAGE_SIZE,
    });

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
    }, [isGetVideosLoading, getVideosError, videos, setListData]);

    return (
        <List
            loading={isGetVideosLoading}
            bordered
            header={
                <Typography.Title level={5} className="px-4 pt-3">
                    {`Progress: ${
                        (user?.watchedVideos?.length /
                            (videos?.totalResults ?? 0)) *
                        100
                    }% (${user?.watchedVideos?.length}/${
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
                        onClick={() => router.push(`/course/${item.id}`)}
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
                            description={`${new Date(item.duration * 1000)
                                .toISOString()
                                .substring(11, 19)} miniutes`}
                        />
                        <div>
                            {user?.watchedVideos?.some((video) =>
                                typeof video === "string"
                                    ? video === item.id
                                    : video.id === item.id
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
    );
};

export default VideoList;
