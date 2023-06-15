import { generateQueryUrl } from "../../../helpers";
import {
    Assignment,
    AssignmentParams,
    Assignments,
    AssignmentsQueryParams,
} from "../../../interfaces";
import { apiSlice } from "../../api/apiSlice";

export const assignmentsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAssignments: builder.query<Assignments, AssignmentsQueryParams>({
            query: ({ title, videoId, sortBy, page, limit }) => ({
                url: generateQueryUrl("assignments", {
                    title,
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
                          "Assignments",
                          ...result.results.map(({ id }) => ({
                              type: "Assignments" as const,
                              id,
                          })),
                          { type: "Assignments", id: "LIST" },
                      ]
                    : [{ type: "Assignments", id: "LIST" }],
        }),
        getAssignment: builder.query<Assignments, string>({
            query: (id) => ({
                url: `assignments/${id}`,
                method: "GET",
            }),
            providesTags: (result, error, id) => [{ type: "Assignments", id }],
        }),
        addAssignment: builder.mutation<Assignments, AssignmentParams>({
            query: ({ title, video, dueDate, totalMarks, description }) => ({
                url: "assignments",
                method: "POST",
                body: { title, video, dueDate, totalMarks, description },
            }),
            invalidatesTags: ["Assignments"],
        }),
        editAssignment: builder.mutation<Assignment, Assignment>({
            query: ({
                id,
                title,
                video,
                dueDate,
                totalMarks,
                description,
            }) => ({
                url: `assignments/${id}`,
                method: "PATCH",
                body: { title, video, dueDate, totalMarks, description },
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: "Assignments", id },
            ],
        }),
        deleteAssignment: builder.mutation<Assignments, string>({
            query: (id) => ({
                url: `assignments/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Assignments"],
        }),
    }),
});

export const {
    useGetAssignmentsQuery,
    useGetAssignmentQuery,
    useAddAssignmentMutation,
    useEditAssignmentMutation,
    useDeleteAssignmentMutation,
} = assignmentsApi;
