import { apiSlice } from "../../api/apiSlice";
import { videoSelected } from "../videos/videosSlice";
import { userLoggOut, userLoggedIn } from "./authSlice";

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
            query: (refreshToken: string) => ({
                url: "auth/logout",
                method: "POST",
                body: { refreshToken },
            }),

            async onQueryStarted(
                refreshToken: string,
                { dispatch, queryFulfilled }
            ) {
                try {
                    await queryFulfilled;
                    await dispatch(userLoggOut());
                    await dispatch(videoSelected(null));
                } catch (err) {
                    // Handle error
                }
            },
        }),
        refreshTokens: builder.mutation({
            query: (refreshToken: string) => ({
                url: "auth/refresh-tokens",
                method: "POST",
                body: { refreshToken },
            }),

            async onQueryStarted(
                refreshToken: string,
                { dispatch, queryFulfilled }
            ) {
                try {
                    const { data } = await queryFulfilled;
                    if (data) {
                        await dispatch(userLoggedIn({ tokens: data }));
                    }
                } catch (err) {
                    // Handle error
                }
            },
        }),
        forgotPassword: builder.mutation<void, string>({
            query: (email) => ({
                url: "auth/forgot-password",
                method: "POST",
                body: { email },
            }),
        }),
        resetPassword: builder.mutation<
            void,
            { token: string; password: string }
        >({
            query: ({ token, password }) => ({
                url: "auth/reset-password?token=" + token,
                method: "POST",
                body: { password },
            }),
        }),
    }),
});

export const {
    useLoginMutation,
    useRegisterMutation,
    useLogoutMutation,
    useRefreshTokensMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation,
} = authApi;
