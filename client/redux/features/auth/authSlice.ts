import { AnyAction, createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import storage from "redux-persist/lib/storage";
import { AuthState } from "../../../interfaces";

const initialState: AuthState = {
    tokens: null,
    user: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        userLoggedIn: (state, action) => {
            state.tokens = action.payload.tokens
                ? action.payload.tokens
                : state.tokens;
            state.user = action.payload.user ? action.payload.user : state.user;
        },
        userLoggOut: (state) => {
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

export const { userLoggedIn, userLoggOut } = authSlice.actions;

export default authSlice.reducer;
