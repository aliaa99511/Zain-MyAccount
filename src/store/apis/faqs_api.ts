
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export type FAQSegment =
    | "B2C_Prepaid"
    | "B2C_Postpaid"
    | "B2B_Prepaid"
    | "B2B_Postpaid";

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

export interface FAQGroup {
    id: number;
    code: string;
    sortOrder: number;
    items: FAQItem[];
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

    baseQuery: fetchBaseQuery({
        baseUrl: "http://172.191.7.149:7777/api/",
    }),

    tagTypes: ["FAQs"],
    endpoints: (builder) => ({
        // 1. Get category information for the segment.
        getGroupInfo: builder.query<FAQCategory[], FAQSegment>({
            query: (segment) => ({
                url: `FAQs/GetGroupInfo/${segment}`,
                method: "GET",
            }),

            transformResponse: (response: ApiResponse<FAQCategory[]>) => response.result ?? [],
        }),

        // 2. Get all groups, questions and answers for the segment.
        getFAQsBySegment: builder.query<FAQGroup[], FAQSegment>({
            query: (segment) => ({
                url: `FAQs/GetFAQsBySegmentAsync/${segment}`,
                method: "GET",
            }),

            transformResponse: (response: NestedApiResponse<FAQGroup[]>) => response.result?.result ?? [],
        }),

        // 3. Get questions and answers for one category.
        getGrouped: builder.query<FAQGroup[], string>({
            query: (groupCode) => ({
                url: `FAQs/GetGrouped/${encodeURIComponent(groupCode)}`,
                method: "GET",
            }),

            transformResponse: (response: NestedApiResponse<FAQGroup[]>) => response.result?.result ?? [],
        }),
    }),
});

export const {
    useGetGroupInfoQuery,
    useGetFAQsBySegmentQuery,
    useGetGroupedQuery,
} = FAQsApi;