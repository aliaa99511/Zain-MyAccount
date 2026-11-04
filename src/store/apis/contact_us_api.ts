/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { env } from "../../configurations/env";

interface ContactItems {
  id: number;
  segmentId: number;
  headerEn: string;
  headerAr: string;
  valueEn: string;
  valueAr: string;
  order: number;
  iconDataUri: string;
  segment: any;
}
interface SocialLinks {
  id: number;
  platform: string;
  link: string;
  sortOrder: number;
  iconDataUri: string;
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
    socialMediaItems: SocialLinks[];
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
interface ShopsResponse {
  result: {
    message: string;
    shops: Shop[];
  }
}
interface SendMessageBodyProps {
  "fullName": string,
  "email": string,
  "phoneNumber": string,
  "additionalPhoneNumber"?: string,
  "subject": string,
  "body": string
}
interface SendMessageResponse {
  "message": string,
}

const isValidLatLng = (lat: unknown, lng: unknown): boolean => {
  if(!lat || !lng) return false;
  const latitude = Number(lat);
  const longitude = Number(lng);

  return (
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180
  );
};
export const ContactUsApi = createApi({
  reducerPath: "ContactUsApi",
  baseQuery: fetchBaseQuery({ baseUrl: env.baseUrl}),
  tagTypes: ["ContactUs"] as string[],
  endpoints: (builder) => ({
    getContactUsInforamtion: builder.query<ContactUsInfo, void>({
      query: () => {
        return {
          url: `/ContactUsInformation/ContactUsInformation`,
          method: "GET",
        };
      },
      transformResponse: (response: ContactUsInfo) => response ?? [],
    }),
    getShops: builder.query<Shops, void>({
      query: () => {
        return {
          url: '/Crm/GetShops',
          method: "GET",
        };
      },
      transformResponse: (response: ShopsResponse) => {
        const validShops = response.result.shops?.filter((shop) => isValidLatLng(shop.latitude, shop.longitude)) ?? [];
        return {
          message: response.result.message,
          shops: validShops,
        };
      },
    }),
    sendMessage: builder.query<SendMessageResponse, SendMessageBodyProps>({
      query: (body) => {
        return {
          url: `/ContactUs`,
          method: "POST",
          body: body,
        };
      },
      transformResponse: (response: SendMessageResponse) => response ?? [],
    }),
  }),
});

export const { useGetContactUsInforamtionQuery, useGetShopsQuery, useLazySendMessageQuery } = ContactUsApi;