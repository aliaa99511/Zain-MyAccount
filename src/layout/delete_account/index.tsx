
import { useContext, useState } from "react";
import {
    Alert,
    Box,
    Button,
    Typography,
} from "@mui/material";

import { LanguageContext } from "../../App";
import { layout_sentences } from "../../configurations/language";
import OTP from "../../shared/Auth/OTP";

import {
    useGenerateUserOTPMutation,
    useValidateUserOTPMutation,
    useDeletePrimaryAccountMutation,
} from "../../store";

type OTPResult = {
    transactionId?: string | null;
    expires_In?: string | number | null;
    status?: string | null;
    message?: string | null;
};

function DeleteAccount({ onClose }: { onClose: () => void }) {
    const languageContext = useContext(LanguageContext);
    const language = languageContext?.language ?? "En";

    const [generateUserOTP] = useGenerateUserOTPMutation();
    const [validateUserOTP] = useValidateUserOTPMutation();
    const [deletePrimaryAccount] = useDeletePrimaryAccountMutation();

    // Step 0: confirmation
    // Step 1: OTP
    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [otpResult, setOtpResult] = useState<OTPResult | null>(null);

    const isArabic = language === "Ar";

    const t = (key: string): string =>
        (
            layout_sentences as Record<
                string,
                Record<string, string>
            >
        )[key]?.[language] ?? key;

    const getErrorMessage = (error: unknown): string => {
        if (typeof error === "object" && error !== null) {
            const apiError = error as {
                data?: {
                    messageEn?: string | null;
                    messageAr?: string | null;
                };
                message?: string;
            };

            const message =
                language === "Ar"
                    ? apiError.data?.messageAr
                    : apiError.data?.messageEn;

            if (message) return message;
            if (apiError.message) return apiError.message;
        }

        return t("DeleteAccountFailed");
    };

    // Generate OTP and move to the OTP step in the SAME dialog.
    const handleContinueToOTP = async () => {
        setLoading(true);
        setErrorMessage(null);

        try {
            const response = await generateUserOTP({
                service_id: "2",
                reference_id: "TRx44455",
                language: language.toLowerCase(),
            }).unwrap();

            const transactionId = response.result?.transaction_Id;

            if (!response.succeeded || !transactionId) {
                throw new Error(
                    (language === "Ar"
                        ? response.messageAr
                        : response.messageEn) ||
                    t("DeleteAccountFailed")
                );
            }

            setOtpResult({
                transactionId,
                expires_In: response.result?.expires_In,
            });

            setStep(1);
        } catch (error) {
            setErrorMessage(getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    // Called by the shared OTP component when the user requests a resend.
    const handleGenerateOTP = async (): Promise<OTPResult> => {
        const response = await generateUserOTP({
            service_id: "2",
            reference_id: "TRx44455",
            language: language.toLowerCase(),
        }).unwrap();

        const transactionId = response.result?.transaction_Id;

        if (!response.succeeded || !transactionId) {
            throw new Error(
                (language === "Ar"
                    ? response.messageAr
                    : response.messageEn) ||
                t("DeleteAccountFailed")
            );
        }

        const result: OTPResult = {
            transactionId,
            expires_In: response.result?.expires_In,
        };

        setOtpResult(result);

        return result;
    };

    // Verify OTP, then delete the primary account.
    const handleValidateOTP = async (otp: string) => {
        if (!otpResult?.transactionId) {
            throw new Error(t("DeleteAccountFailed"));
        }

        const validation = await validateUserOTP({
            otp,
            transaction_id: otpResult.transactionId,
            service_id: "2",
        }).unwrap();

        if (!validation.succeeded) {
            throw new Error(
                (language === "Ar"
                    ? validation.messageAr
                    : validation.messageEn) ||
                t("DeleteAccountOtpInvalid")
            );
        }

        const deletion = await deletePrimaryAccount().unwrap();

        if (
            deletion &&
            typeof deletion === "object" &&
            "succeeded" in deletion &&
            deletion.succeeded === false
        ) {
            throw new Error(getErrorMessage({ data: deletion }));
        }

        // OTP calls onSuccess after this function resolves successfully.
        return { succeeded: true };
    };

    const handleClose = () => {
        onClose();
    };

    return (
        <Box
            dir={isArabic ? "rtl" : "ltr"}
            sx={{
                p: 1,
                width: "100%",
                // maxWidth: 440,
                boxSizing: "border-box",
            }}
        >
            {step === 0 && (
                <>
                    <Typography
                        variant="h4"
                        sx={{
                            fontSize: "1.5rem",
                            fontWeight: 600,
                            mb: 1.5,
                        }}
                    >
                        {t("DeleteAccountConfirmation")}
                    </Typography>

                    <Typography
                        variant="body2"
                        sx={{
                            fontSize: "1.1rem",
                            color: "text.secondary",
                            lineHeight: 1.2,
                            mb: 3,
                        }}
                    >
                        {t("DeleteAccountWarning")}
                    </Typography>

                    {errorMessage && (
                        <Alert severity="error" sx={{ mb: 2, color: "error.main" }}>
                            {errorMessage}
                        </Alert>
                    )}

                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: { xs: "column", sm: "row" },
                            gap: 1,
                            width: "100%",
                        }}
                    >
                        <Button
                            fullWidth
                            variant="outlined"
                            onClick={handleContinueToOTP}
                            disabled={loading}
                            sx={{
                                flex: 1,
                                minWidth: 0,
                                borderColor: "error.main",
                                color: "error.main",
                            }}
                        >
                            {loading ? t("Loading") : t("DeleteAccount")}
                        </Button>

                        <Button
                            fullWidth
                            variant="outlined"
                            onClick={handleClose}
                            disabled={loading}
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
                            {t("Cancel")}
                        </Button>
                    </Box>

                </>
            )}

            {step === 1 && otpResult && (
                <OTP
                    SectionTitle={
                        <Typography variant="h3">
                            {t("DeleteAccountOtpTitle")}
                        </Typography>
                    }
                    SectionDescription={
                        <Typography
                            variant="body1"
                            sx={{ color: "text.secondary", mb: 1 }}
                        >
                            {t("DeleteAccountOtpDescription")}
                        </Typography>
                    }
                    SubmitBtnText={t("DeleteAccount")}
                    firstResult={otpResult}
                    onGenerateOTP={handleGenerateOTP}
                    onValidateOTP={handleValidateOTP}
                    onSuccess={handleClose}
                    showCancelButton
                    onCancel={handleClose}
                    isDeleteAction
                />
            )}
        </Box>
    );
}

export default DeleteAccount;