import { generateQueryUrl } from "../../../helpers";
import { ILeaderboard } from "../../../interfaces";
import { apiSlice } from "../../api/apiSlice";

export const leaderboardApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getLeaderboard: builder.query<ILeaderboard, { student?: string }>({
            query: ({ student }) => ({
                url: generateQueryUrl("leaderboard", {
                    student,
                }),
                method: "GET",
            }),
            providesTags: ["Leaderboard"],
        }),
    }),
});

export const { useGetLeaderboardQuery } = leaderboardApi;
