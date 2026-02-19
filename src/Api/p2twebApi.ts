import baseApi from "./baseApi";

const baseUrl = '/AuthDataGet/ExecuteJson/P2TWebapi'

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
  }),
});

export const { useDownloadCertificateMutation } = p2tWebApi;
export default p2tWebApi;
