import { configureStore } from "@reduxjs/toolkit";
import { authApi, captchaApi } from "../Api";

import baseApi from "../Api/baseApi";
import DetailedSlice from "./Slice/DetailSlice";
import McqSlice from "./Slice/McqSlice";

const store = configureStore({
  reducer: {
    [captchaApi.reducerPath]: captchaApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [baseApi.reducerPath]: baseApi.reducer,
    mcqQuestion: McqSlice,
    detailed: DetailedSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    })
      .concat(baseApi.middleware)
      .concat(captchaApi.middleware)
      .concat(authApi.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
