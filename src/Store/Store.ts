import { configureStore } from "@reduxjs/toolkit";
import { captchaApi, authApi, spAppApi } from "../Api";

import McqSlice from "./Slice/McqSlice";
import DetailedSlice from "./Slice/DetailSlice";
import p2tWebApi from "../Api/p2twebApi";

const store = configureStore({
  reducer: {
    [spAppApi.reducerPath]: spAppApi.reducer,
    [captchaApi.reducerPath]: captchaApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [p2tWebApi.reducerPath]: p2tWebApi.reducer,
    mcqQuestion: McqSlice,
    detailed: DetailedSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(spAppApi.middleware)
      .concat(captchaApi.middleware)
      .concat(authApi.middleware)
      .concat(p2tWebApi.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
