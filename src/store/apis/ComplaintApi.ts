
import type {
    ApiResponse,
    Complaint,
    ComplaintEligibilityResponse,
    ComplaintsFilterParams,
    ComplaintsListResult,
    CreateComplaintRequest,
    CreateComplaintResponse,
} from "../../pages/complaints/Types";

import { baseQueryWithAuth } from "./base_api";
import { createApi } from "@reduxjs/toolkit/query/react";

export const ComplaintApi = createApi({
    reducerPath: "ComplaintApi",
    baseQuery: baseQueryWithAuth,
    tagTypes: ["Complaint"],

    endpoints: (builder) => ({
        checkComplaintEligibility: builder.query<
            ComplaintEligibilityResponse,
            void
        >({
            query: () => ({
                url: "/Complaints/eligibility",
                method: "GET",
            }),
        }),

        createComplaint: builder.mutation<
            CreateComplaintResponse,
            CreateComplaintRequest
        >({
            query: (body) => ({
                url: "/Complaints",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Complaint"],
        }),

        getComplaints: builder.query<
            ApiResponse<ComplaintsListResult>,
            ComplaintsFilterParams
        >({
            query: (params) => ({
                url: "/Complaints",
                method: "GET",
                params: {
                    Search: params.Search || undefined,
                    Status: params.Status,
                    DateFrom: params.DateFrom || undefined,
                    DateTo: params.DateTo || undefined,
                    PageIndex: params.PageIndex,
                    PageSize: params.PageSize,
                },
            }),
            providesTags: ["Complaint"],
        }),

        getComplaintById: builder.query<
            ApiResponse<Complaint>,
            string
        >({
            query: (complaintId) => ({
                url: `/Complaints/${encodeURIComponent(complaintId)}`,
                method: "GET",
            }),
            providesTags: ["Complaint"],
        }),
    }),
});

export const {
    useLazyCheckComplaintEligibilityQuery,
    useCreateComplaintMutation,
    useGetComplaintsQuery,
    useGetComplaintByIdQuery,
} = ComplaintApi;
