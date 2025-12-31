import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const p2tWebApi = createApi({
  reducerPath: "p2tWebApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_APP_APIBaseUrl}/AuthDataGet/ExecuteJson/SpP2TWebapi`,
  }),
  endpoints: (builder) => ({
    downloadCertificate: builder.mutation({
      query: (data) => ({
        url: "11",
        method: "POST",
        body: data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-type": "application/json",
        },
        providesTags: ["p2tWebApi"],
      }),
    }),
  }),
});

export const { useDownloadCertificateMutation } = p2tWebApi;
export default p2tWebApi;
