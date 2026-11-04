import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { env } from "../../configurations/env";

interface LoginWithPasswordResponse {
  succeeded: boolean;
  messageEn: string | null;
  messageAr: string | null;
  result: {
    messageEn: string | null;
    messageAr: string | null;
    status: string;
    accessToken: string;
    tokenType: string;
    expiresIn: number;
    question?: {
      text: string,
      step: number,
      totalRequired: number,
    }
  }
}
interface GenerateLoginOTPResponse {
  succeeded: boolean;
  messageEn: string | null;
  messageAr: string | null;
  errors?: string[];
  result: {
    status?: string;
    messageEn?: string | null;
    messageAr?: string | null;
    transactionId?: string;
    expires_In?: string;
    reference_Id?: string;
    question?: {
      text?: string,
      step?: number,
      totalRequired?: number
    }
  } | null;
}
interface ValidateOTPResponse {
  succeeded: boolean;
  messageEn?: string | null;
  messageAr?: string | null;
  result?: {
    status: string;
    messageEn?: string | null;
    messageAr?: string | null;
    question?: {
      text?: string,
      step?: number,
      totalRequired?: number
    },
    accessToken: string | null,
  };
}
export interface RecoveryQuestion {
  questionSetId: string;
  text: string;
}
export interface RecoveryQuestionsResponse {
  succeeded: boolean;
  messageEn: string | null;
  messageAr: string | null;
  errors: string[];
  result: {
    status: string;
    messageEn: string | null;
    messageAr: string | null;
    questions: RecoveryQuestion[] | null;
  };
}
export interface CaptchaResponse {
  succeeded: boolean;
  messageEn: string | null;
  messageAr: string | null;
  errors: string[];
  result: {
    image: string;
    expiresInSeconds: number;
  };
}

export interface RecoveryAnswer {
  questionSetId: string;
  answer: string;
}
export interface RecoveryAnswersRequest {
  answers: RecoveryAnswer[];
  captchaAnswer: string;
}
export interface RecoveryAnswersResponse {
  succeeded: boolean;
  messageEn: string | null;
  messageAr: string | null;
  errors: string[];
  result: {
    status: string;
    messageEn: string | null;
    messageAr: string | null;
    questions: RecoveryQuestion[] | null;
  };
}
export interface RecoveryPasswordResponse {
  succeeded: boolean;
  messageEn: string | null;
  messageAr: string | null;
  errors: string[];
  result: {
    status: string;
    messageEn: string | null;
    messageAr: string | null;
    questions: RecoveryQuestion[] | null;
  };
}
interface CheckSecuirtyQuestionAnswerResponse {
  succeeded: boolean;
  messageEn: string | null;
  messageAr: string | null;
  result: {
    messageEn: string | null;
    messageAr: string | null;
    status: string;
    accessToken: string;
    tokenType: string;
    expiresIn: number;
    question?: {
      text: string,
      step: number,
      totalRequired: number,
    }
  }
}
export const LoginApi = createApi({
  reducerPath: "LoginApi",
  baseQuery: fetchBaseQuery({ baseUrl: env.baseUrl }),
  tagTypes: ["Login"] as string[],
  endpoints: (builder) => ({
    loginWithPassword: builder.mutation<LoginWithPasswordResponse, { userName: string; password: string, rememberMe: boolean }>({
      query: (body) => {
        return {
          url: `/auth/login/password`,
          method: "POST",
          body,
          credentials: "include",
        };
      },
    }),
    generateLoginOTP: builder.mutation<
      GenerateLoginOTPResponse,
      { userName: string; rememberMe: boolean }
    >({
      query: (body) => ({
        url: `/auth/login/otp/request`,
        method: "POST",
        body,
        credentials: "include",
      }),
    }),
    validateLoginOTP: builder.mutation<ValidateOTPResponse, { code: string; }>({
      query: (body) => {
        return {
          url: `/auth/login/otp/verify`,
          method: "POST",
          body,
          credentials: "include",
        };
      },
    }),
    recoveryQuestions: builder.mutation<
      RecoveryQuestionsResponse,
      { userName: string }
    >({
      query: (body) => ({
        url: "/auth/recovery/questions",
        method: "POST",
        body,
        credentials: "include",
      }),
    }),

    getCaptcha: builder.query<CaptchaResponse, void>({
      query: () => ({
        url: "/captcha",
        method: "GET",
        credentials: "include",
      }),
    }),

    recoveryAnswers: builder.mutation<
      RecoveryAnswersResponse,
      RecoveryAnswersRequest
    >({
      query: ({ answers, captchaAnswer }) => ({
        url: "/auth/recovery/answers",
        method: "POST",
        body: { answers },
        credentials: "include",
        headers: {
          "X-Captcha-Answer": captchaAnswer,
        },
      }),
    }),

    recoveryPassword: builder.mutation<
      RecoveryPasswordResponse,
      { newPassword: string }
    >({
      query: (body) => ({
        url: "/auth/recovery/password",
        method: "POST",
        body,
        credentials: "include",
      }),
    }),
    checkSecuirtyQuestionAnswer: builder.mutation<
      CheckSecuirtyQuestionAnswerResponse,
      { answer: string }
    >({
      query: (body) => ({
        url: "/auth/login/security-question",
        method: "POST",
        body,
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useLoginWithPasswordMutation,
  useGenerateLoginOTPMutation,
  useValidateLoginOTPMutation,
  useRecoveryQuestionsMutation,
  useLazyGetCaptchaQuery,
  useRecoveryAnswersMutation,
  useRecoveryPasswordMutation,
  useCheckSecuirtyQuestionAnswerMutation,
} = LoginApi;



