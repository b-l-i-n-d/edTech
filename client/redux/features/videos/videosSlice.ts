import { AnyAction, PayloadAction, createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import { IVideoState } from "../../../interfaces";

const initialState: IVideoState = {
    currentVideoId: null,
};

const videosSlice = createSlice({
    name: "videos",
    initialState,
    reducers: {
        videoSelected: (state, action: PayloadAction<string | null>) => {
            state.currentVideoId = action.payload;
        },
    },

    extraReducers: (builder) =>
        builder.addCase(HYDRATE, (state, action: AnyAction) => {
            return {
                ...state,
                ...action.payload.videos,
            };
        }),
});

export const { videoSelected } = videosSlice.actions;

export default videosSlice.reducer;
