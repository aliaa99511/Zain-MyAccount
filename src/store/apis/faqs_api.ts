
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./base_api";

export interface FAQItem {
    id: number;
    questionEn: string;
    questionAr: string;
    answerEn: string;
    answerAr: string;
    sortOrder: number;
}

export interface FAQCategory {
    id: number;
    code: string;
    nameEn: string;
    nameAr: string;
    iconDataUri: string | null;
    sortOrder: number;
    segmentId: number;
    segment: unknown;
}

export interface FAQSubGroup {
    id: number;
    code: string;
    nameEn: string;
    nameAr: string;
    sortOrder: number;
    items: FAQItem[];
}

export interface FAQGroup {
    id: number;
    code: string;
    sortOrder: number;
    faqSubGrouped: FAQSubGroup[];
}

interface ApiResponse<T> {
    succeeded: boolean;
    message: string | null;
    errors: unknown[];
    result: T;
}

interface NestedApiResponse<T> {
    succeeded: boolean;
    message: string | null;
    errors: unknown[];
    result: ApiResponse<T>;
}

export const FAQsApi = createApi({
    reducerPath: "FAQsApi",

    baseQuery: baseQueryWithAuth,

    tagTypes: ["FAQs"],

    endpoints: (builder) => ({
        // 1. Get all main categories.
        getGroupsInfo: builder.query<FAQCategory[], void>({
            query: () => "FAQs/GetGroupsInfo",

            transformResponse: (
                response: ApiResponse<FAQCategory[]>
            ) => response.result ?? [],
        }),

        // 2. Get all FAQs for the initial page.
        getFAQsBySegment: builder.query<FAQItem[], void>({
            query: () => "FAQs/GetFAQsBySegmentAsync",

            transformResponse: (
                response: NestedApiResponse<FAQItem[]>
            ) => response.result?.result ?? [],
        }),

        // 3. Get a category and its Prepaid/Postpaid/Other subgroups.
        getGrouped: builder.query<FAQGroup[], string>({
            query: (groupCode) =>
                `FAQs/GetGrouped/${encodeURIComponent(groupCode)}`,

            transformResponse: (
                response: NestedApiResponse<FAQGroup[]>
            ) => response.result?.result ?? [],
        }),
    }),
});

export const {
    useGetGroupsInfoQuery,
    useGetFAQsBySegmentQuery,
    useGetGroupedQuery,
} = FAQsApi;
