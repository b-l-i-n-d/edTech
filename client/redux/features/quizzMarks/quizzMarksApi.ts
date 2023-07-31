import { generateQueryUrl } from "../../../helpers";
import {
    IQuizzMark,
    IQuizzMarkParams,
    IQuizzMarks,
    IQuizzMarksQueryParams,
} from "../../../interfaces";
import { apiSlice } from "../../api/apiSlice";

export const quizzMarksApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getQuizzMarks: builder.query<IQuizzMarks, IQuizzMarksQueryParams>({
            query: ({ video, student, sortBy, page, limit }) => ({
                url: generateQueryUrl("quizzes-marks", {
                    video,
                    student,
                    sortBy,
                    page,
                    limit,
                }),
                method: "GET",
            }),
            providesTags: (result) =>
                result
                    ? [
                          "QuizzMarks",
                          ...result.results.map(({ id }) => ({
                              type: "QuizzMarks" as const,
                              id,
                          })),
                          { type: "QuizzMarks", id: "LIST" },
                      ]
                    : [{ type: "QuizzMarks", id: "LIST" }],
        }),
        addQuizzMark: builder.mutation<IQuizzMark, IQuizzMarkParams>({
            query: ({ video, student, selectedAnswers }) => ({
                url: "quizzes-marks",
                method: "POST",
                body: { video, student, selectedAnswers },
            }),
            invalidatesTags: ["QuizzMarks", "Dashboard", "Leaderboard"],
        }),
    }),
});

export const { useGetQuizzMarksQuery, useAddQuizzMarkMutation } = quizzMarksApi;
