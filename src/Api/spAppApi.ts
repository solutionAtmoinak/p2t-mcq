import baseApi from "./baseApi";

const baseUrl = '/AuthDataGet/ExecuteJson/spAppApi'

const spAppApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getPackage: builder.query({
      query: () => ({
        url: `${baseUrl}/14`,
        body: {},
      }),
      providesTags: ["Package"],
    }),
    getMcq: builder.query({
      query: (data: any) => ({
        url: `${baseUrl}/23`,
        body: data,
      }),
      providesTags: ["Package"],
    }),
    getTheory: builder.query({
      query: (data: any) => ({
        url: `${baseUrl}/35`,
        body: data,
      }),
      providesTags: ["Package"],
    }),
    submitAnswer: builder.mutation({
      query: (data: any) => ({
        url: `${baseUrl}/26`,
        body: data,
      }),
    }),
    submitExam: builder.mutation({
      query: (data: any) => ({
        url: `${baseUrl}/41`,
        body: data,
      }),
    }),
    fetchDbAnswers: builder.mutation({
      query: (data: any) => ({
        url: `${baseUrl}/46`,
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
