import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import { ContactUsApi } from "./apis/contact_us_api";
import { FAQsApi } from "./apis/faqs_api";

export const store = configureStore({
  reducer: {
    [ContactUsApi.reducerPath]: ContactUsApi.reducer,
    [FAQsApi.reducerPath]: FAQsApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(ContactUsApi.middleware)
      .concat(FAQsApi.middleware),

  devTools: import.meta.env.MODE !== "production",
});

setupListeners(store.dispatch);

export {
  useGetContactUsInforamtionQuery,
  useGetShopsQuery,
} from "./apis/contact_us_api";

export {
  useGetGroupInfoQuery,
  useGetFAQsBySegmentQuery,
  useGetGroupedQuery,
} from "./apis/faqs_api";