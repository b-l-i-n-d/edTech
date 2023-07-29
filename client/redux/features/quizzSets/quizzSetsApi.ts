import { generateQueryUrl } from "../../../helpers";
import { IQuizzSets, IQuizzSetsQueryParams } from "../../../interfaces";
import { apiSlice } from "../../api/apiSlice";

export const quizzSetsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getQuizzSets: builder.query<IQuizzSets, IQuizzSetsQueryParams>({
            query: ({ video, sortBy, page, limit }) => ({
                url: generateQueryUrl("quizzes-sets", {
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
                          "QuizzSets",
                          ...result.results.map(({ id }) => ({
                              type: "QuizzSets" as const,
                              id,
                          })),
                          { type: "QuizzSets", id: "LIST" },
                      ]
                    : [{ type: "QuizzSets", id: "LIST" }],
        }),
    }),
});

export const { useGetQuizzSetsQuery } = quizzSetsApi;
