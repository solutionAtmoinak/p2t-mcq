import baseApi from "./baseApi";

const baseUrl = "/AuthDataGet/ExecuteJson/SpP2TWebapi";

const p2tWebApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    downloadCertificate: builder.mutation({
      query: (data) => ({
        url: `${baseUrl}/11`,
        body: data,
        providesTags: ["p2tWebApi"],
      }),
    }),
    mcqExamServiceType: builder.query({
      query: (data) => ({
        url: `${baseUrl}/21`,
        body: data,
        providesTags: ["p2tWebApi"],
      }),
    }),
    fetchAnsAfterExamSubmit: builder.mutation({
      query: (data) => ({
        url: `${baseUrl}/31`,
        body: data,
        providesTags: ["p2tWebApi"],
      }),
    }),
  }),
});

export const {
  useDownloadCertificateMutation,
  useMcqExamServiceTypeQuery,
  useFetchAnsAfterExamSubmitMutation,
} = p2tWebApi;
export default p2tWebApi;
