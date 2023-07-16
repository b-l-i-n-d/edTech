import { useEffect, useState } from "react";
import { apiConfig } from "../configs";
import { useGetVideosQuery } from "../redux/features/videos/videosApi";

// This hook is used to make sure all the data is loaded before rendering the app
const useCurrentVideoId = (): boolean => {
    const [isCurrentVideoIdLoaded, setIsCurrentVideoIdLoaded] =
        useState<boolean>(false);

    // const { data: videos, isLoading } = useGetVideosQuery({
    //     page: 1,
    //     limit: apiConfig.PAGE_SIZE,
    // });

    // useEffect(() => {
    //     if (!isLoading && videos) {
    //         setIsCurrentVideoIdLoaded(true);
    //     }
    // }, [isLoading, videos]);

    return isCurrentVideoIdLoaded;
};

export default useCurrentVideoId;
