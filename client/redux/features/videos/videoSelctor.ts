import { AppState } from "../../store";

export const selectCurrentVideoId = (state: AppState): string =>
    state.videos.currentVideoId;
