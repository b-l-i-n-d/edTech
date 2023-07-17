import { generateQueryUrl } from "../../../helpers";
import { IUser, IUsers, IUsersQueryParams } from "../../../interfaces";
import { apiSlice } from "../../api/apiSlice";
import { userLoggedIn } from "../auth/authSlice";

export const usersApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getUsers: builder.query<IUsers, IUsersQueryParams>({
            query: ({ name, role, sortBy, page, limit }) => ({
                url: generateQueryUrl("users", {
                    name,
                    role,
                    sortBy,
                    page,
                    limit,
                }),
                method: "GET",
            }),
            providesTags: (result) =>
                result
                    ? [
                          "Users",
                          ...result.results.map(({ id }) => ({
                              type: "Users" as const,
                              id,
                          })),
                          { type: "Users", id: "LIST" },
                      ]
                    : [{ type: "Users", id: "LIST" }],
        }),
        getUser: builder.query<IUser, string>({
            query: (id) => ({
                url: `users/${id}`,
                method: "GET",
            }),
            providesTags: (result, error, id) => [{ type: "Users", id }],
        }),
        updateUser: builder.mutation<IUser, Partial<IUser>>({
            query: ({ id, ...patch }) => ({
                url: `users/${id}`,
                method: "PATCH",
                body: patch,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: "Users", id }],

            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data: user } = await queryFulfilled;
                    dispatch(
                        userLoggedIn({
                            user,
                        })
                    );
                } catch (error) {
                    // TODO: Handle error
                }
            },
        }),
    }),
});

export const { useGetUsersQuery, useGetUserQuery, useUpdateUserMutation } =
    usersApi;
