import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { env } from "../../configurations/env";

interface AppLegalItems {
  id: number;
  titleEn: string;
  titleAr: string;
  contentEn: string;
  contentAr: string;
  sortOrder: number;
}
interface AppLegalResponse {
  succeeded: boolean;
  message: string;
  result:  AppLegalItems[];
}

export const GeneralApi = createApi({
  reducerPath: "GeneralApi",
  baseQuery: fetchBaseQuery({ baseUrl: env.baseUrl }),
  tagTypes: ["General"] as string[],
  endpoints: (builder) => ({
    // get Terms & Conditions and Privacy Policy
    getAppLegalPages: builder.query<AppLegalResponse, {type: number}>({
      query: ({type}) => {
        return {
          url: `/AppLegalPages?type=${type}`,
          method: "GET",
        };
      },
    }),
  }),
});

export const { useLazyGetAppLegalPagesQuery } = GeneralApi;