import { generateQueryUrl } from "../../../helpers";
import { Video, Videos, VideosQueryParams } from "../../../interfaces";
import { apiSlice } from "../../api/apiSlice";

interface VideoParams {
    title: string;
    description: string;
    url: string;
    thumbnail: string;
    duration: number;
}

export const videosApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getVideos: builder.query<Videos, VideosQueryParams>({
            query: ({ title, description, sortBy, page, limit }) => ({
                url: generateQueryUrl("videos", {
                    title,
                    description,
                    sortBy,
                    page,
                    limit,
                }),
                method: "GET",
            }),
            providesTags: ["Videos"],
        }),
        getVideo: builder.query<Video, string>({
            query: (id) => ({
                url: `videos/${id}`,
                method: "GET",
            }),
            providesTags: (result, error, id) => [{ type: "Videos", id }],
        }),
        createVideo: builder.mutation<Video, VideoParams>({
            query: ({ title, description, url, thumbnail, duration }) => ({
                url: "videos",
                method: "POST",
                body: { title, description, url, thumbnail, duration },
            }),
            invalidatesTags: ["Videos"],
        }),
        updateVideo: builder.mutation<Video, Video>({
            query: ({ id, title, description, url, thumbnail, duration }) => ({
                url: `videos/${id}`,
                method: "PATCH",
                body: { title, description, url, thumbnail, duration },
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: "Videos", id },
                "Videos",
            ],
        }),
        deleteVideo: builder.mutation({
            query: (id: string) => ({
                url: `videos/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Videos"],
        }),
    }),
});

export const {
    useGetVideosQuery,
    useGetVideoQuery,
    useCreateVideoMutation,
    useUpdateVideoMutation,
    useDeleteVideoMutation,
} = videosApi;
