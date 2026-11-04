import { z } from "zod";
import { PhoneNumberUtil } from 'google-libphonenumber';

const phoneUtil = PhoneNumberUtil.getInstance();

export  const phoneNumberSchema = z.object({
  phoneNumber: z
    .string()
    .trim()
    .min(1, "Phone number is required"),
}).superRefine(({phoneNumber}, ctx) => {
  if (!phoneNumber) return;
  try {
    const isValid = phoneUtil.isValidNumber(
      phoneUtil.parseAndKeepRawInput(phoneNumber)
    );

    if (!isValid) {
      ctx.addIssue({
        code: "custom",
        path: ["phoneNumber"],
        message: "Please enter a valid Sudan phone number",
      });
    }
  } catch {
    ctx.addIssue({
      code: "custom",
      path: ["phoneNumber"],
      message: "Please enter a valid Sudan phone number",
    });
  }
});