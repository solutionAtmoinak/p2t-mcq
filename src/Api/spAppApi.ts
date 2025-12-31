import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { SD_SPNameList } from "../Utility/StaticData";

const baseQuery = fetchBaseQuery({
  baseUrl: `${import.meta.env.VITE_APP_APIBaseUrl}/AuthDataGet/ExecuteJson/${
    SD_SPNameList.DB_SP_Package
  }`,
});

const spAppApi = createApi({
  reducerPath: "spPackageApi",
  baseQuery: async (args, api, extraOptions) => {
    try {
      const result = await baseQuery(args, api, extraOptions);
      if (result.error?.status === 401) {
        localStorage.removeItem("token");
        window.location.replace("/");
      }
      return result;
    } catch (error: any) {
      if (error.status === 401) {
        localStorage.removeItem("token");
        window.location.replace("/");
      }
      throw error;
    }
  },
  tagTypes: ["Package", "Mcq", "Theory"],
  endpoints: (builder) => ({
    getPackage: builder.query({
      query: () => ({
        url: "14",
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-type": "application/json",
        },
        body: {},
      }),
      providesTags: ["Package"],
    }),
    getMcq: builder.query({
      query: (data: any) => ({
        url: "23",
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-type": "application/json",
        },
        body: data,
      }),
      providesTags: ["Package"],
    }),
    getTheory: builder.query({
      query: (data: any) => ({
        url: "35",
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-type": "application/json",
        },
        body: data,
      }),
      providesTags: ["Package"],
    }),
    submitAnswer: builder.mutation({
      query: (data: any) => ({
        url: "26",
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-type": "application/json",
        },
        body: data,
      }),
    }),
    submitExam: builder.mutation({
      query: (data: any) => ({
        url: "41",
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-type": "application/json",
        },
        body: data,
      }),
    }),
    fetchDbAnswers: builder.mutation({
      query: (data: any) => ({
        url: "46",
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-type": "application/json",
        },
        body: data,
      }),
    }),
  }),
});

export const {
  useGetPackageQuery,
  useGetMcqQuery,
  useGetTheoryQuery,
  useSubmitAnswerMutation,
  useSubmitExamMutation,
  useFetchDbAnswersMutation,
} = spAppApi;
export default spAppApi;
