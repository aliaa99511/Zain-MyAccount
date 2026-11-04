
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./base_api";

interface PhoneNumber {
  msisdn: string;
  isMain: boolean;
  isPrimary: boolean;
  canRemove: boolean;
  canSwitch: boolean;
}

interface PhoneNumbersResult {
  numbers: PhoneNumber[];
  maxCount: number;
  canAdd: boolean;
}

interface PhoneNumbersResponse {
  succeeded: boolean;
  messageEn: string | null;
  messageAr: string | null;
  errors: string[];
  result: PhoneNumbersResult;
}

interface AddPhoneNumberResponse {
  succeeded: boolean;
  messageEn: string | null;
  messageAr: string | null;
}

export const NumbersApi = createApi({
    reducerPath: "NumbersApi",
    baseQuery: baseQueryWithAuth,
    tagTypes: ["Numbers"],
    endpoints: (builder) => ({
        getNumbers: builder.query<
            PhoneNumbersResponse,
            void
        >({
            query: () => ({
                url: "/User/numbers",
                method: "GET",
                credentials: "include",
            }),
        }),
        addNumber: builder.mutation<AddPhoneNumberResponse, string>({
          query: (number) => ({
            url: '/api/User/numbers/add',
            method: "POST",
            body: { msisdn: number },
            credentials: "include",
          })
        }),

        // submitChangeAnswers: builder.mutation<
        //     ChangeAnswersResponse,
        //     ChangeAnswersRequest
        // >({
        //     query: ({ answers, captchaAnswer }) => ({
        //         url: "/User/change-password/answers",
        //         method: "POST",
        //         body: { answers },
        //         credentials: "include",
        //         headers: {
        //             "X-Captcha-Answer": captchaAnswer,
        //         },
        //     }),
        // }),
    }),
});