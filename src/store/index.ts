import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import sessionReducer from "./slices/sessionSlice";
import { ContactUsApi } from "./apis/contact_us_api";
import { FAQsApi } from "./apis/faqs_api";
import { CreateAccountApi } from "./apis/create_account_api";
import { OTPApi } from "./apis/otp_api";
import { GeneralApi } from "./apis/general_api";
import { LoginApi } from "./apis/login_api";
import { UserApi } from "./apis/user_api";
import { AuthApi } from "./apis/auth_api";
import { ComplaintApi } from "./apis/ComplaintApi";
import { NumbersApi } from "./apis/numbers_api";

export const store = configureStore({
  reducer: {
    session: sessionReducer,
    [ContactUsApi.reducerPath]: ContactUsApi.reducer,
    [FAQsApi.reducerPath]: FAQsApi.reducer,
    [CreateAccountApi.reducerPath]: CreateAccountApi.reducer,
    [OTPApi.reducerPath]: OTPApi.reducer,
    [GeneralApi.reducerPath]: GeneralApi.reducer,
    [LoginApi.reducerPath]: LoginApi.reducer,
    [UserApi.reducerPath]: UserApi.reducer,
    [AuthApi.reducerPath]: AuthApi.reducer,
    [ComplaintApi.reducerPath]: ComplaintApi.reducer,
    [NumbersApi.reducerPath]: NumbersApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(ContactUsApi.middleware, CreateAccountApi.middleware, OTPApi.middleware, GeneralApi.middleware, LoginApi.middleware, AuthApi.middleware, NumbersApi.middleware)
      .concat(FAQsApi.middleware)
      .concat(UserApi.middleware)
      .concat(ComplaintApi.middleware),

  devTools: import.meta.env.MODE !== "production",
});

setupListeners(store.dispatch);

export {
  useGetContactUsInforamtionQuery,
  useGetShopsQuery,
  useLazySendMessageQuery,
} from "./apis/contact_us_api";

export {
  useGetGroupsInfoQuery,
  useGetFAQsBySegmentQuery,
  useGetGroupedQuery,
} from "./apis/faqs_api";

export {
  useLazyCheckNumberInCRMQuery,
  useGetChallengeQuestionsQuery,
  useCreateIsUserMutation,
  useLazyCheckNumberHasAccountQuery,
} from "./apis/create_account_api";

export {
  useGenerateOTPMutation,
  useValidateOTPMutation
} from "./apis/otp_api";

export {
  useLazyGetAppLegalPagesQuery
} from "./apis/general_api";

export {
  useLoginWithPasswordMutation,
  useGenerateLoginOTPMutation,
  useValidateLoginOTPMutation,
  useRecoveryQuestionsMutation,
  useLazyGetCaptchaQuery,
  useRecoveryAnswersMutation,
  useRecoveryPasswordMutation,
  useCheckSecuirtyQuestionAnswerMutation,
} from "./apis/login_api";

export const {
  useGetChangeQuestionsMutation,
  useSubmitChangeAnswersMutation,
  useChangePasswordMutation,
  useGenerateUserOTPMutation,
  useValidateUserOTPMutation,
  useDeletePrimaryAccountMutation,
  useChangeSecurityAnswersMutation,
} = UserApi;

export const {
  useLogoutMutation,
} = AuthApi;

export const {
  useLazyCheckComplaintEligibilityQuery,
  useCreateComplaintMutation,
  useGetComplaintsQuery,
  useGetComplaintByIdQuery,
} = ComplaintApi;

export const {
  useGetNumbersQuery,
  useAddNumberMutation,
} = NumbersApi;