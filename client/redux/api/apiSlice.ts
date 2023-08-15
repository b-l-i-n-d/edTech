import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { HYDRATE } from "next-redux-wrapper";
import { authApi } from "../features/auth/authApi";
import { AppState } from "../store";

const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: async (
        headers,
        { getState }: { getState: () => AppState }
    ) => {
        const token = getState().auth?.tokens?.access?.token;
        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }
        return headers;
    },
});

export const apiSlice = createApi({
    reducerPath: "api",
    baseQuery: async (args, api, extraOptions) => {
        const getState = api.getState as () => AppState;
        const refreshToken = getState().auth?.tokens?.refresh?.token;
        const isTokenExpired =
            getState().auth?.tokens?.refresh?.expires < Date.now();
        const result = await baseQuery(args, api, extraOptions);

        if ((result.error?.status === 401 || isTokenExpired) && refreshToken) {
            api.dispatch(authApi.endpoints.logout.initiate(refreshToken));
        }
        return result;
    },

    extractRehydrationInfo: (action, { reducerPath }) => {
        if (action.type === HYDRATE) {
            return action.payload[reducerPath];
        }
    },
    tagTypes: [
        "Assignments",
        "AssignmentsMarks",
        "Auth",
        "Dashboard",
        "Leaderboard",
        "Users",
        "Videos",
        "Quizzes",
        "QuizzMarks",
        "QuizzSets",
    ],
    endpoints: (builder) => ({}),
});
