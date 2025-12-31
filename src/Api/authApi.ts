import {
  ForgetPasswordDTO,
  FPCodeGeneratorDTO,
  ResetPasswordDTO,
} from "../interface/DTO";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_APP_APIBaseUrl}/auth`,
  }),
  endpoints: (builder) => ({
    getUserConfirmationType: builder.query({
      query: () => ({
        url: "getUserConfirmationType",
        method: "GET",
      }),
    }),
    registerUser: builder.mutation({
      query: (userData) => ({
        url: "register",
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: userData,
      }),
    }),
    loginUser: builder.mutation({
      query: (userCredentials) => ({
        url: "login",
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: userCredentials,
      }),
    }),
    forgetPassword: builder.mutation({
      query: ({ key, user }: { key: string; user: ForgetPasswordDTO }) => ({
        url: `forgetPassword/${key}`,
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: user,
      }),
    }),
    resetPassword: builder.mutation({
      query: ({
        code,
        userDetail,
      }: {
        code: string;
        userDetail: ResetPasswordDTO;
      }) => ({
        url: `resetPassword/${code}`,
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: userDetail,
      }),
    }),
    emailverification: builder.mutation({
      query: ({ userId, token }: { userId: string; token: string }) => ({
        url: `emailverification/${userId}/${token}`,
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: {},
      }),
    }),
    authenticateUser: builder.mutation({
      query: (token: string) => ({
        url: "authentication",
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-type": "application/json",
        },
      }),
    }),
    getFPCode: builder.mutation({
      query: (obj: FPCodeGeneratorDTO) => ({
        url: "generateFPCode",
        method: "POST",
        body: obj,
      }),
    }),
    logoutUser: builder.mutation({
      query: () => ({
        url: "logout",
        method: "Delete",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-type": "application/json",
        },
      }),
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useResetPasswordMutation,
  useForgetPasswordMutation,
  useEmailverificationMutation,
  useAuthenticateUserMutation,
  useGetFPCodeMutation,
  useLogoutUserMutation,
  useGetUserConfirmationTypeQuery,
} = authApi;
export default authApi;
