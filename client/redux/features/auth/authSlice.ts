import { AnyAction, createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import storage from "redux-persist/lib/storage";

export interface User {
    id: number;
    name: string;
    email: string;
    isEmailVerified: boolean;
    role: "user" | "admin";
}

export interface AuthState {
    tokens: {
        acess: {
            token: string;
        };
        refresh: {
            token: string;
        };
    } | null;
    user: User | null;
}

const initialState: AuthState = {
    tokens: null,
    user: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        userLoggedIn: (state, action) => {
            state.tokens = action.payload.tokens;
            state.user = action.payload.user;
        },
        logout: (state) => {
            storage.removeItem("persist:nextjs");
            return initialState;
        },
    },

    extraReducers: (builder) =>
        builder.addCase(HYDRATE, (state, action: AnyAction) => {
            return {
                ...state,
                ...action.payload.auth,
            };
        }),
});

export const { userLoggedIn, logout } = authSlice.actions;

export default authSlice.reducer;
