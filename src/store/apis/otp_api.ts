import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { env } from "../../configurations/env";

interface OTPResponse {
  succeeded: boolean;
  messageEn: string | null;
  messageAr: string | null;
}

interface GenerateOTPResponse {
  succeeded: boolean;
  messageEn: string | null;
  messageAr: string | null;
  result: {
    transactionId: string;
    expires_In: string;
    reference_Id: string;
  }
}

export const OTPApi = createApi({
  reducerPath: "OTPApi",
  baseQuery: fetchBaseQuery({ baseUrl: env.baseUrl }),
  tagTypes: ["OTP"] as string[],
  endpoints: (builder) => ({
    generateOTP: builder.mutation<GenerateOTPResponse, { number: string, language: string }>({
      query: ({ number, language }) => {
        const body = {
          "service_id": "2",
          "msisdn": number,
          "reference_id": "TRx44455",
          "language": language
        }
        return {
          url: `/Crm/generate-otp`,
          method: "POST",
          body
        };
      },
      transformResponse: (response: Promise<GenerateOTPResponse>) => response ?? [],
    }),
    validateOTP: builder.mutation<OTPResponse, { number: string; otp: string; transaction_id: string }>({
      query: ({ number, otp, transaction_id }) => {
        const body = {
          "otp": otp,
          "msisdn": number,
          "transaction_id": transaction_id,
          "service_id": "2"
        }
        return {
          url: `/Crm/validate-otp`,
          method: "POST",
          body,
        };
      },
      transformResponse: (response: Promise<OTPResponse>) => response ?? [],
    }),
  }),
});

export const {
  useGenerateOTPMutation,
  useValidateOTPMutation,
} = OTPApi;