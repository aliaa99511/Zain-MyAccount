import { PhoneNumberUtil } from 'google-libphonenumber';

const phoneUtil = PhoneNumberUtil.getInstance();

export const checkIsValidPhoneNumber = (phoneNumber: string): boolean => {
  if(!phoneNumber || phoneNumber.length < 6)return false;
  const isValid = phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phoneNumber));
  return isValid;
}