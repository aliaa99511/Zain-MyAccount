/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface ContactItems {
  id: number;
  segmentId: number;
  headerEn: string;
  headerAr: string;
  valueEn: string;
  valueAr: string;
  order: number;
  icon: any;
  segment: any;
}
interface SocialLinks {
  id: number;
  platform: string;
  link: string;
  sortOrder: number;
  icon: any;
}
interface ContactUsInfo {
  succeeded: boolean;
  message: string;
  errors: any[];
  result: {
    titleEn: string;
    titleAr: string;
    subTitleEn: string;
    subTitleAr: string;
    showContactForm: boolean;
    contactItems: ContactItems[];
    socialLinks: SocialLinks[];
  };
}
interface Shop {
  shopId: number;
  shopNameEn: string;
  shopNameAr: string;
  regionNameEn: string;
  regionNameAr: string;
  stateNameEn: string;
  stateNameAr: string;
  cityNameEn: string;
  cityNameAr: string;
  addressEn: string;
  addressAr: string;
  nearbyLandmarksEn: string;
  nearbyLandmarksAr: string;
  latitude: number;
  longitude: number;
}
interface Shops {
  message: string;
  shops: Shop[];
}
export const ContactUsApi = createApi({
  reducerPath: "ContactUsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://172.191.7.149:7777/api/" }),
  tagTypes: ["ContactUs"] as string[],
  endpoints: (builder) => ({
    getContactUsInforamtion: builder.query<ContactUsInfo, string>({
      query: (segment) => {
        return {
          url: `/ContactUsInformation/ContactUsInformation/${segment}`,
          method: "GET",
        };
      },
      transformResponse: (response: Promise<ContactUsInfo>) => response ?? [],
    }),
    getShops: builder.query<Shops, void>({
      query: () => {
        return {
          url: '/Crm/GetShops',
          method: "GET",
        };
      },
      transformResponse: (response: Promise<Shops>) => response,
    }),
  }),
});

export const { useGetContactUsInforamtionQuery, useGetShopsQuery } = ContactUsApi;