import {
    Action,
    ThunkAction,
    combineReducers,
    configureStore,
} from "@reduxjs/toolkit";
import { MakeStore, createWrapper } from "next-redux-wrapper";
import { persistReducer, persistStore } from "redux-persist";
import { apiSlice } from "./api/apiSlice";
import storage from "./customStorage";
import authSliceReducer from "./features/auth/authSlice";
import videosSliceReducer from "./features/videos/videosSlice";

const rootReducer = combineReducers({
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authSliceReducer,
    videos: videosSliceReducer,
});

const makeConfiguredStore = () =>
    configureStore({
        reducer: rootReducer,
        devTools: process.env.NODE_ENV !== "production",
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
                serializableCheck: false,
            }).concat(apiSlice.middleware),
    });

export const makeStore: MakeStore<any> = () => {
    const isServer = typeof window === "undefined";
    if (isServer) {
        return makeConfiguredStore();
    } else {
        // we need it only on client side
        const persistConfig = {
            key: "nextjs",
            whitelist: ["auth", "videos"], // make sure it does not clash with server keys
            storage,
        };
        const persistedReducer = persistReducer(persistConfig, rootReducer);
        let store: any = configureStore({
            reducer: persistedReducer,
            devTools: process.env.NODE_ENV !== "production",
            middleware: (getDefaultMiddleware) =>
                getDefaultMiddleware({
                    serializableCheck: false,
                }).concat(apiSlice.middleware),
        });
        store.__persistor = persistStore(store); // Nasty hack
        return store;
    }
};

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore["dispatch"];
export type AppState = ReturnType<AppStore["getState"]>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    AppStore,
    unknown,
    Action<string>
>;

export const wrapper = createWrapper<AppStore>(makeStore, {
    debug: process.env.NODE_ENV !== "production",
});
