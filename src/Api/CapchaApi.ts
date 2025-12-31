import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const captchaApi = createApi({
  reducerPath: "captchaApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_APP_APIBaseUrl}/captcha`,
  }),
  endpoints: (builder) => ({
    getCaptcha: builder.query({
      query: () => ({
        url: "generate",
      }),
    }),
  }),
});

export const { useGetCaptchaQuery } = captchaApi;
export default captchaApi;
