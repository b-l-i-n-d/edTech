import { generateQueryUrl } from "../../../helpers";
import {
    AssignmentMark,
    AssignmentMarkParams,
    AssignmentsMarks,
    AssignmentsMarksQueryParams,
} from "../../../interfaces";
import { apiSlice } from "../../api/apiSlice";

export const assignmentsMarksApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAssignmentsMarks: builder.query<
            AssignmentsMarks,
            AssignmentsMarksQueryParams
        >({
            query: ({ assignment, student, status, sortBy, page, limit }) => ({
                url: generateQueryUrl("assignments-marks", {
                    assignment,
                    student,
                    status,
                    sortBy,
                    page,
                    limit,
                }),
                method: "GET",
            }),
            providesTags: (result) =>
                result
                    ? [
                          "AssignmentsMarks",
                          ...result.results.map(({ id }) => ({
                              type: "AssignmentsMarks" as const,
                              id,
                          })),
                          { type: "AssignmentsMarks", id: "LIST" },
                      ]
                    : [{ type: "AssignmentsMarks", id: "LIST" }],
        }),
        getAssignmentMark: builder.query<AssignmentsMarks, string>({
            query: (id) => ({
                url: `assignments-marks/${id}`,
                method: "GET",
            }),
            providesTags: (result, error, id) => [
                { type: "AssignmentsMarks", id },
            ],
        }),
        addAssignmentMark: builder.mutation<
            AssignmentsMarks,
            AssignmentMarkParams
        >({
            query: ({ assignment, student, marks, status, feedback }) => ({
                url: "assignments-marks",
                method: "POST",
                body: { assignment, student, marks, status, feedback },
            }),
            invalidatesTags: ["AssignmentsMarks"],
        }),
        editAssignmentMark: builder.mutation<AssignmentMark, AssignmentMark>({
            query: ({ id, assignment, student, marks, status, feedback }) => ({
                url: `assignments-marks/${id}`,
                method: "PATCH",
                body: { assignment, student, marks, status, feedback },
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: "AssignmentsMarks", id },
            ],
        }),
        deleteAssignmentMark: builder.mutation<AssignmentMark, string>({
            query: (id) => ({
                url: `assignments-marks/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["AssignmentsMarks"],
        }),
    }),
});

export const {
    useGetAssignmentsMarksQuery,
    useGetAssignmentMarkQuery,
    useAddAssignmentMarkMutation,
    useEditAssignmentMarkMutation,
    useDeleteAssignmentMarkMutation,
} = assignmentsMarksApi;
