import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const BASE_URL = "http://localhost:9000";

export const apiService = createApi({
  reducerPath: "apiService",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api/v1`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("accessToken");
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Users"],
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (data) => ({ url: "/auth/registration", method: "POST", body: data }),
    }),
    loginUser: builder.mutation({
      query: (data) => ({ url: "/auth/login", method: "POST", body: data }),
    }),
    forgotPassword: builder.mutation({
      query: (data) => ({ url: "/auth/forgot-password", method: "POST", body: data }),
    }),
    resetPassword: builder.mutation({
      query: ({ token, password }) => ({
        url: `/auth/reset-password/${token}`,
        method: "POST",
        body: { password },
      }),
    }),

    getUsers: builder.query({
      query: () => "/dashboard/alluser",
      providesTags: ["Users"],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({ url: `/dashboard/delete-user/${id}`, method: "DELETE" }),
      invalidatesTags: ["Users"],
    }),
    updateUser: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/dashboard/update/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Users"],
    }),
    approveUser: builder.mutation({
      query: (id) => ({ url: `/dashboard/approved-user/${id}`, method: "PATCH" }),
      invalidatesTags: ["Users"],
    }),
    deactiveUser: builder.mutation({
      query: (id) => ({ url: `/dashboard/deactive-user/${id}`, method: "PATCH" }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGetUsersQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useApproveUserMutation,
  useDeactiveUserMutation,
} = apiService;