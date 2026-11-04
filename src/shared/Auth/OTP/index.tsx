/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import OtpInput from './OTPInput';
import { Box, Button, FormHelperText, Link, Stack, Typography } from '@mui/material';
import { otp_sentences } from '../../../configurations/language';
import { LanguageContext } from '../../../App';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import useCountdown from './useCountdown';
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 120;


const formatTime = (s: number) =>
  `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

interface OTPProps {
  phoneNumber?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  showCancelButton?: boolean;
  generateOTP?: any;
  validateOTP?: any;
  SectionTitle: React.ReactNode;
  SectionDescription: React.ReactNode;
  SubmitBtnText: string;
  firstResult?: {
    transactionId?: string | null;
    expires_In?: string | number | null;
    status?: string | null;
    message?: string | null;
  } | null;
  onGenerateOTP?: () => Promise<unknown>;
  onValidateOTP?: (code: string) => Promise<{
    succeeded: boolean;
    messageEn?: string | null;
    messageAr?: string | null;
    result?: {
      status: string;
      messageEn?: string | null;
      messageAr?: string | null;
      question?: {
        text?: string;
        step?: number;
        totalRequired?: number;
      };
    };
  }>;
  isDeleteAction?: boolean;
}

function OTP({
  phoneNumber,
  onSuccess,
  onCancel,
  showCancelButton = false,
  generateOTP,
  validateOTP,
  SectionTitle,
  SectionDescription,
  SubmitBtnText,
  firstResult,
  onGenerateOTP,
  onValidateOTP,
  isDeleteAction = false,
}: OTPProps) {
  const languageContext = useContext(LanguageContext);
  const language = languageContext?.language ?? 'En';
  const otpSchema = z.object({
    otp: z
      .string()
      .regex(/^\d*$/, "The code can only contain digits")
      .length(OTP_LENGTH, otp_sentences.OTPNotComplete[language].replace("$$", String(OTP_LENGTH))),
  });

  type OtpFormValues = z.infer<typeof otpSchema>;
  const { control, handleSubmit, reset, setError, setFocus, formState: { errors, isSubmitting } } = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  const { left, restart } = useCountdown(RESEND_SECONDS);
  const [resending, setResending] = useState(false);
  const [transactionId, setTransactionId] = useState(firstResult?.transactionId);
  const [expireIn, setExpireIn] = useState(firstResult?.expires_In);
  const { left: expiredOtp } = useCountdown(Number(expireIn));

  const onSubmit = async ({ otp }: OtpFormValues) => {
    if (expiredOtp === 0) {
      setError("otp", {
        message: otp_sentences.OTPExpired[language],
      });
      return;
    }

    try {
      if (onValidateOTP) {
        const result = await onValidateOTP(otp);

        if (!result.succeeded) {
          throw new Error(
            result.result?.[`message${language}`] ??
            otp_sentences.OtpVerifyError[language]
          );
        }

        onSuccess?.();
        return;
      }

      // Legacy flow: Login / Forgot Password / Create Account
      if (!validateOTP) {
        throw new Error("OTP verification is not configured.");
      }

      if (!phoneNumber) {
        throw new Error("Phone number is missing.");
      }

      const result = await validateOTP({
        number: phoneNumber.replace("+", ""),
        otp,
        transaction_id: transactionId ?? "",
      }).unwrap();

      if (result.succeeded) {
        onSuccess?.();
      } else {
        throw new Error(
          result.result?.message ??
          result.message ??
          otp_sentences.OtpVerifyError[language]
        );
      }
    } catch (err) {
      setError("otp", {
        message:
          err instanceof Error
            ? err.message
            : otp_sentences.OtpVerifyError[language],
      });
    }
  };

  const onResend = async () => {
    setResending(true);

    try {
      if (onGenerateOTP) {
        // Change Password / Modify Security Questions
        // The parent handler manages the authenticated API request.
        const response = await onGenerateOTP();

        // The parent can return the updated transaction data.
        if (
          response &&
          typeof response === "object" &&
          "transactionId" in response
        ) {
          const result = response as {
            transactionId?: string;
            expires_In?: string | number;
          };

          setTransactionId(result.transactionId);
          setExpireIn(result.expires_In);
        }
      } else {
        // Legacy flow: Login / Forgot Password / Create Account
        if (!generateOTP) {
          throw new Error("OTP generation is not configured.");
        }

        if (!phoneNumber) {
          throw new Error("Phone number is missing.");
        }

        const response = await generateOTP({
          number: phoneNumber.replace("+", ""),
          language: language.toLowerCase(),
        }).unwrap();

        setTransactionId(response?.result?.transactionId);
        setExpireIn(response?.result?.expires_In);
      }

      reset({ otp: "" });
      restart();
      setFocus("otp");
    } catch (err) {
      setError("otp", {
        message:
          err instanceof Error
            ? err.message
            : otp_sentences.OtpSendError[language],
      });
    } finally {
      setResending(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <>{SectionTitle}</>
        <>{SectionDescription}</>
        <Typography variant="caption" color="text.secondary" component="p" sx={{ mb: 0, mt: 3 }}>
          {otp_sentences.OTP[language]}
        </Typography>

        <Controller
          name="otp"
          control={control}
          render={({ field }) => (
            <OtpInput
              OTP_LENGTH={OTP_LENGTH}
              value={field.value}
              onBlur={field.onBlur}
              firstInputRef={field.ref}
              hasError={!!errors.otp}
              onChange={(v) => {
                field.onChange(v);
              }}
            />
          )}
        />

        {errors.otp && <FormHelperText error role="alert">{errors.otp.message}</FormHelperText>}

        <Stack direction="row" sx={{ mt: 1.75, justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="body2">
            {otp_sentences.DontReceiveSMS[language]}
            <Link
              component="button"
              type="button"
              variant="body2"
              onClick={onResend}
              disabled={left > 0 || resending}
              sx={{ verticalAlign: "baseline", ml: 0.5, "&:disabled": { opacity: 0.45, cursor: "not-allowed" } }}
            >
              {otp_sentences.ResendOTP[language]}
            </Link>
          </Typography>

          {left > 0 && (
            <Stack direction="row" sx={{ alignItems: "center" }} spacing={0.5} color="primary.main">
              <AccessTimeIcon fontSize="small" />
              <Typography variant="body2" sx={{ fontVariantNumeric: "tabular-nums" }}>
                {formatTime(left)}
              </Typography>
            </Stack>
          )}
        </Stack>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 1,
          mt: 1.5,
          width: "100%",
        }}
      >

        <Button
          type="submit"
          variant={isDeleteAction ? "outlined" : "contained"}
          color={isDeleteAction ? "error" : "primary"}
          fullWidth
          loading={isSubmitting}
          sx={(theme) => ({
            flex: 1,
            minWidth: 0,
            py: 1,

            ...(isDeleteAction
              ? {
                borderColor: theme.palette.error.main,
                color: theme.palette.error.main,
                background: "transparent",
                "&:hover": {
                  borderColor: theme.palette.error.dark,
                  color: theme.palette.error.dark,
                  background: "transparent",
                },
              }
              : {
                background: `linear-gradient(90deg, #953193 0%, ${theme.palette.primary.light} 100%)`,
                "&:hover": {
                  background: `linear-gradient(90deg, #7d287b 0%, ${theme.palette.primary.main} 100%)`,
                },
              }),

            "&:disabled, &.Mui-disabled": {
              borderColor: isDeleteAction ? "#A3A3A3" : undefined,
              background: isDeleteAction ? "transparent" : "#A3A3A3",
              color: "#A3A3A3",
            },
          })}
        >
          {SubmitBtnText}
        </Button>

        {showCancelButton && (
          <Button
            type="button"
            variant="outlined"
            fullWidth
            disabled={isSubmitting || resending}
            onClick={onCancel}
            sx={(theme) => ({
              flex: 1,
              minWidth: 0,
              py: 1,
              color: theme.palette.text.primary,
              borderColor: "#E0E0E0",
              "&:hover": {
                borderColor: "#BDBDBD",
                backgroundColor: "transparent",
              },
              "&.Mui-disabled": {
                borderColor: "#E0E0E0",
                color: theme.palette.text.disabled,
              },
            })}
          >
            {otp_sentences.Cancel?.[language] ?? "Cancel"}
          </Button>
        )}
      </Box>
    </Box>
  )
}

export default OTP