import { AppState } from "../../store";

export const selectUser = (state: AppState) => state.auth.user;
export const selectTokens = (state: AppState) => state.auth.tokens;
export const selectRefreshToken = (state: AppState) =>
    state.auth.tokens?.refresh.token;
export const selectAccessToken = (state: AppState) =>
    state.auth.tokens?.acess.token;
