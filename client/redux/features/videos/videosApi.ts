import { generateQueryUrl } from "../../../helpers";
import { IVideo, IVideos, IVideosQueryParams } from "../../../interfaces";
import { apiSlice } from "../../api/apiSlice";
import { AppState } from "../../store";
import { selectCurrentVideoId } from "./videoSelctor";
import { videoSelected } from "./videosSlice";

interface VideoParams {
    title: string;
    description: string;
    url: string;
    thumbnail: string;
    duration: number;
}

export const videosApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getVideos: builder.query<IVideos, IVideosQueryParams>({
            query: ({ title, description, sortBy, page, limit, search }) => ({
                url: generateQueryUrl("videos", {
                    title,
                    description,
                    sortBy,
                    page,
                    limit,
                    search,
                }),
                method: "GET",
            }),
            providesTags: (result) =>
                result
                    ? [
                          "Videos",
                          ...result.results.map(({ id }) => ({
                              type: "Videos" as const,
                              id,
                          })),
                          { type: "Videos", id: "LIST" },
                      ]
                    : [{ type: "Videos", id: "LIST" }],
            async onQueryStarted(arg, { getState, dispatch, queryFulfilled }) {
                try {
                    const state: AppState = getState();
                    const currentVideoId = selectCurrentVideoId(state);
                    const { data: videosData } = await queryFulfilled;
                    const { results: videos } = videosData;

                    if (currentVideoId) {
                        dispatch(videoSelected(currentVideoId));
                    } else if (videos.length > 0) {
                        dispatch(videoSelected(videos[0].id));
                    }
                } catch (error) {
                    // TODO: Handle error
                }
            },
        }),
        getVideo: builder.query<IVideo, string>({
            query: (id) => ({
                url: `videos/${id}`,
                method: "GET",
            }),
            providesTags: (result, error, id) => [{ type: "Videos", id }],
        }),
        addVideo: builder.mutation<IVideo, VideoParams>({
            query: ({ title, description, url, thumbnail, duration }) => ({
                url: "videos",
                method: "POST",
                body: { title, description, url, thumbnail, duration },
            }),
            invalidatesTags: ["Videos"],
        }),
        editVideo: builder.mutation<IVideo, IVideo>({
            query: ({ id, title, description, url, thumbnail, duration }) => ({
                url: `videos/${id}`,
                method: "PATCH",
                body: { title, description, url, thumbnail, duration },
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: "Videos", id },
            ],
        }),
        deleteVideo: builder.mutation<IVideo, string>({
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
    useLazyGetVideosQuery,
    useGetVideoQuery,
    useAddVideoMutation,
    useEditVideoMutation,
    useDeleteVideoMutation,
} = videosApi;
