
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { env } from "../../configurations/env";

interface CRMResponse {
  succeeded: boolean;
  messageEn: string | null;
  messageAr: string | null;
  result: {
    responseCode: string | null;
    customerStatus: string | null;
  };
}
interface ISResponse {
  succeeded: boolean;
  messageEn: string | null;
  messageAr: string | null;
  result: boolean;
}

export interface ChallengeQuestion {
  locale: "en_US" | "ar";
  question: string;
  questionId: string;
}

export interface ChallengeQuestionSet {
  questionSetId: string;
  questions: ChallengeQuestion[];
}

interface ChallengeQuestionsResponse {
  succeeded: boolean;
  message: string | null;
  errors: string[];
  result: ChallengeQuestionSet[];
}

// Security question answers sent to the create account endpoint
export interface SecurityAnswer {
  questionSetId: string;
  questionId: string;
  question: string;
  answer: string;
}

// Request body for POST /api/User/create-is-user
export interface CreateIsUserRequest {
  userName: string;
  password: string;
  answers: SecurityAnswer[];
}

// Adjust this interface if the backend returns a different response shape.
export interface CreateIsUserResponse {
  succeeded: boolean;
  messageEn: string | null;
  messageAr: string | null;
  errors?: string[];
  result?: unknown;
}
export const CreateAccountApi = createApi({
  reducerPath: "CreateAccountApi",
  baseQuery: fetchBaseQuery({
    baseUrl: env.baseUrl,
  }),
  tagTypes: ["CreateAccount"],
  endpoints: (builder) => ({
    checkNumberInCRM: builder.query<CRMResponse, string>({
      query: (number) => ({
        url: `Crm/${number}`,
        method: "GET",
        credentials: "include",
      }),
    }),

    getChallengeQuestions: builder.query<ChallengeQuestionsResponse, void>({
      query: () => ({
        url: "User/challenge-questions",
        method: "GET",
        credentials: "include",
      }),
    }),

    createIsUser: builder.mutation<CreateIsUserResponse, CreateIsUserRequest>({
      query: (body) => ({
        url: "User/create-is-user",
        method: "POST",
        body,
        credentials: "include",
      }),
    }),
    checkNumberHasAccount: builder.query<ISResponse, string>({
      query: (number) => ({
        url: `/User/${number}`,
        method: "GET",
        credentials: "include",
      }),
    }),

  }),
});

export const {
  useLazyCheckNumberInCRMQuery,
  useGetChallengeQuestionsQuery,
  useCreateIsUserMutation,
  useLazyCheckNumberHasAccountQuery,
} = CreateAccountApi;
