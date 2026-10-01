import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { ContactUsApi } from "./apis/contact_us_api";

export const store = configureStore({
  reducer: {
    [ContactUsApi.reducerPath]: ContactUsApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(
    ContactUsApi.middleware,
  ),
  devTools: import.meta.env.MODE !== "production",
})
setupListeners(store.dispatch);

export {
  useGetContactUsInforamtionQuery,
  useGetShopsQuery
} from "./apis/contact_us_api";