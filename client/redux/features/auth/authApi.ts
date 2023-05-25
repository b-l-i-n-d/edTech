import { apiSlice } from "../../api/apiSlice";
import { userLoggedIn } from "./authSlice";

interface LoginParams {
    email: string;
    password: string;
}

interface RegisterParams {
    name: string;
    email: string;
    password: string;
}

export const authApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: ({ email, password }: LoginParams) => ({
                url: "auth/login",
                method: "POST",
                body: { email, password },
            }),

            async onQueryStarted(
                { email, password }: LoginParams,
                { dispatch, queryFulfilled }
            ) {
                try {
                    const { data } = await queryFulfilled;
                    if (data.user && data.tokens) {
                        await dispatch(userLoggedIn({ ...data }));
                    }
                } catch (err) {
                    // Handle error
                }
            },
        }),
        register: builder.mutation({
            query: ({ name, email, password }: RegisterParams) => ({
                url: "auth/register",
                method: "POST",
                body: { name, email, password },
            }),
        }),
        logout: builder.mutation({
            query: () => ({
                url: "auth/logout",
                method: "POST",
            }),
        }),
    }),
});

export const { useLoginMutation, useRegisterMutation, useLogoutMutation } =
    authApi;
