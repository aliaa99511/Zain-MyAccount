import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./base_api";

export const AuthApi = createApi({
  reducerPath: "AuthApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Auth"],
  endpoints: (builder) => ({
    getUserInfo: builder.query({
      query: () => ({
        url: `/auth/me`,
        method: "GET",
        credentials: "include",
      }),
    }),
    getSessionStatus: builder.query({
      query: () => ({
        url: `/auth/me`,
        method: "GET",
        credentials: "include",
      }),
    }),
    refreshToken: builder.mutation({
      query: () => ({
        url: `/auth/refresh`,
        method: "POST",
        credentials: "include",
      }),
    }),
    logout: builder.mutation<void, unknown>({
      query: () => ({
        url: `/auth/logout`,
        method: "POST",
        credentials: "include",
      }),
    })
  }),
});
export const { useLogoutMutation } = AuthApi;

