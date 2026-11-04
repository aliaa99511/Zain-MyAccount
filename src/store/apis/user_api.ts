
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./base_api";

export interface ChangeSecurityQuestion {
    questionSetId: string;
    text: string;
}

export interface ChangeQuestionsResponse {
    succeeded: boolean;
    messageEn: string | null;
    messageAr: string | null;
    errors?: string[];
    result: {
        status: string;
        messageEn: string | null;
        messageAr: string | null;
        questions: ChangeSecurityQuestion[] | null;
    };
}

export interface ChangeAnswersRequest {
    answers: {
        questionSetId: string;
        answer: string;
    }[];
    captchaAnswer: string;
}

export interface ChangeAnswersResponse {
    succeeded: boolean;
    messageEn: string | null;
    messageAr: string | null;
    errors?: string[];
    result: {
        status: string;
        messageEn: string | null;
        messageAr: string | null;
    } | null;
}

export interface ChangePasswordRequest {
    oldPassword: string;
    newPassword: string;
}

export interface ChangePasswordResponse {
    succeeded: boolean;
    messageEn: string | null;
    messageAr: string | null;
    errors?: string[];
    result?: {
        status?: string;
        messageEn?: string | null;
        messageAr?: string | null;
    } | null;
}

export interface GenerateUserOTPRequest {
    service_id: string;
    reference_id: string;
    language: string;
}

export interface GenerateUserOTPResponse {
    succeeded: boolean;
    messageEn: string | null;
    messageAr: string | null;
    result: {
        transaction_Id: string;
        expires_In: string;
        reference_Id: string;
    } | null;
}
export interface ValidateUserOTPRequest {
    otp: string;
    transaction_id: string;
    service_id: string;
}

export interface ValidateUserOTPResponse {
    succeeded: boolean;
    messageEn: string | null;
    messageAr: string | null;
}
export interface ChangeSecurityAnswer {
    questionSetId: string;
    questionId: string;
    question: string;
    answer: string;
}

export interface ChangeSecurityAnswersRequest {
    currentPassword: string;
    answers: ChangeSecurityAnswer[];
}

export interface ChangeSecurityAnswersResponse {
    succeeded: boolean;
    messageEn: string | null;
    messageAr: string | null;
    errors?: string[];
    result?: {
        status?: string;
        messageEn?: string | null;
        messageAr?: string | null;
    } | null;
}

export const UserApi = createApi({
    reducerPath: "UserApi",
    baseQuery: baseQueryWithAuth,
    tagTypes: ["User"],
    endpoints: (builder) => ({
        getChangeQuestions: builder.mutation<
            ChangeQuestionsResponse,
            void
        >({
            query: () => ({
                url: "/User/change-password/questions",
                method: "POST",
                credentials: "include",
            }),
        }),

        submitChangeAnswers: builder.mutation<
            ChangeAnswersResponse,
            ChangeAnswersRequest
        >({
            query: ({ answers, captchaAnswer }) => ({
                url: "/User/change-password/answers",
                method: "POST",
                body: { answers },
                credentials: "include",
                headers: {
                    "X-Captcha-Answer": captchaAnswer,
                },
            }),
        }),

        changePassword: builder.mutation<
            ChangePasswordResponse,
            ChangePasswordRequest
        >({
            query: (body) => ({
                url: "/User/change-password",
                method: "POST",
                body,
                credentials: "include",
            }),
        }),

        generateUserOTP: builder.mutation<
            GenerateUserOTPResponse,
            GenerateUserOTPRequest
        >({
            query: (body) => ({
                url: "/User/generate-otp",
                method: "POST",
                body,
                credentials: "include",
            }),
        }),

        validateUserOTP: builder.mutation<
            ValidateUserOTPResponse,
            ValidateUserOTPRequest
        >({
            query: (body) => ({
                url: "/User/validate-otp",
                method: "POST",
                body,
                credentials: "include",
            }),
        }),

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        deletePrimaryAccount: builder.mutation<any, void>({
            query: () => ({
                url: "/User",
                method: "DELETE",
                credentials: "include",
            }),
            invalidatesTags: ["User"],
        }),
        changeSecurityAnswers: builder.mutation<
            ChangeSecurityAnswersResponse,
            ChangeSecurityAnswersRequest
        >({
            query: (body) => ({
                url: "/User/changeanswers",
                method: "POST",
                body,
            }),
        }),
    }),
});

export const {
    useGetChangeQuestionsMutation,
    useSubmitChangeAnswersMutation,
    useChangePasswordMutation,
    useGenerateUserOTPMutation,
    useValidateUserOTPMutation,
    useDeletePrimaryAccountMutation,
    useChangeSecurityAnswersMutation,
} = UserApi;