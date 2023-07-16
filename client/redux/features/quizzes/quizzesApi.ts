import { generateQueryUrl } from "../../../helpers";
import {
    IQuizz,
    IQuizzes,
    IQuizzesQueryParams,
    IQuizzParams,
} from "../../../interfaces";
import { apiSlice } from "../../api/apiSlice";

export const quizzesApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getQuizzes: builder.query<IQuizzes, IQuizzesQueryParams>({
            query: ({ question, video, sortBy, page, limit }) => ({
                url: generateQueryUrl("quizzes", {
                    question,
                    video,
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
        getQuizz: builder.query<IQuizz, string>({
            query: (id) => ({
                url: `quizzes/${id}`,
                method: "GET",
            }),
            providesTags: (result, error, id) => [{ type: "Quizzes", id }],
        }),
        addQuizz: builder.mutation<IQuizz, IQuizzParams>({
            query: ({ question, description, video, options }) => ({
                url: "quizzes",
                method: "POST",
                body: { question, description, video, options },
            }),
            invalidatesTags: ["Quizzes"],
        }),
        editQuizz: builder.mutation<IQuizz, IQuizz>({
            query: ({ id, question, description, video, options }) => ({
                url: `quizzes/${id}`,
                method: "PATCH",
                body: { question, description, video, options },
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: "Quizzes", id },
            ],
        }),
        deleteQuizz: builder.mutation<IQuizz, string>({
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
