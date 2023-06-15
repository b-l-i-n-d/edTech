import { generateQueryUrl } from "../../../helpers";
import {
    Quizz,
    QuizzParams,
    Quizzes,
    QuizzesQueryParams,
} from "../../../interfaces";
import { apiSlice } from "../../api/apiSlice";

export const quizzesApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getQuizzes: builder.query<Quizzes, QuizzesQueryParams>({
            query: ({ question, videoId, sortBy, page, limit }) => ({
                url: generateQueryUrl("quizzes", {
                    question,
                    videoId,
                    sortBy,
                    page,
                    limit,
                }),
                method: "GET",
            }),
            providesTags: (result) =>
                result
                    ? [
                          "Quizzes",
                          ...result.results.map(({ id }) => ({
                              type: "Quizzes" as const,
                              id,
                          })),
                          { type: "Quizzes", id: "LIST" },
                      ]
                    : [{ type: "Quizzes", id: "LIST" }],
        }),
        getQuizz: builder.query<Quizzes, string>({
            query: (id) => ({
                url: `quizzes/${id}`,
                method: "GET",
            }),
            providesTags: (result, error, id) => [{ type: "Quizzes", id }],
        }),
        addQuizz: builder.mutation<Quizzes, QuizzParams>({
            query: ({ question, video, options }) => ({
                url: "quizzes",
                method: "POST",
                body: { question, video, options },
            }),
            invalidatesTags: ["Quizzes"],
        }),
        editQuizz: builder.mutation<Quizz, Quizz>({
            query: ({ id, question, video, options }) => ({
                url: `quizzes/${id}`,
                method: "PATCH",
                body: { question, video, options },
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: "Quizzes", id },
            ],
        }),
        deleteQuizz: builder.mutation<Quizzes, string>({
            query: (id) => ({
                url: `quizzes/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Quizzes"],
        }),
    }),
});

export const {
    useGetQuizzesQuery,
    useGetQuizzQuery,
    useAddQuizzMutation,
    useEditQuizzMutation,
    useDeleteQuizzMutation,
} = quizzesApi;
