
import React, { useContext, useEffect, useMemo, useState } from "react";
import {
    Alert,
    Box,
    CircularProgress,
    Step,
    StepLabel,
    Stepper,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { LanguageContext } from "../../App";
import { change_password_sentences as sentences } from "../../configurations/language";
import { otp_sentences } from "../../configurations/language";
import SecurityQuestions from "../../shared/Auth/SecurityQuestions";
import OTP from "../../shared/Auth/OTP";
import PasswordFormSection from "../../shared/Auth/Password";
import {
    useLazyGetCaptchaQuery,
    useGetChangeQuestionsMutation,
    useSubmitChangeAnswersMutation,
    useChangePasswordMutation,
    useGenerateUserOTPMutation,
    useValidateUserOTPMutation,
} from "../../store";
import type { RecoveryAnswer } from "../../shared/Auth/SecurityQuestions/securityQuestions.types";
import { passwordStyles as styles } from "../../shared/Auth/Password/passwordStyles";
import type { PasswordFormValues } from "../../shared/Auth/Password/PasswordFeilds";

type ChangePasswordStep = 0 | 1 | 2;

const ChangePassword: React.FC = () => {
    const context = useContext(LanguageContext);
    const language = context?.language ?? "En";

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

    const [activeStep, setActiveStep] = useState<ChangePasswordStep>(0);
    const [questions, setQuestions] = useState<{ questionSetId: string; text: string }[]>([]);
    const [captchaImage, setCaptchaImage] = useState("");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [infoMessage, setInfoMessage] = useState<string | null>(null);
    const [transactionId, setTransactionId] = useState<string | null>(null);
    const [expireIn, setExpireIn] = useState<string | null>(null);

    const [getCaptcha, { isFetching: isLoadingCaptcha }] = useLazyGetCaptchaQuery();
    const [getChangeQuestions, { isLoading: isLoadingQuestions }] = useGetChangeQuestionsMutation();
    const [submitChangeAnswers, { isLoading: isCheckingAnswers }] = useSubmitChangeAnswersMutation();
    const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();
    //data: generatedData
    const [generateUserOTP, { isLoading: isGeneratingOTP }] = useGenerateUserOTPMutation();
    const [validateUserOTP, { isLoading: isVerifyingOTP }] = useValidateUserOTPMutation();

    const steps = sentences.stepLabels[language];

    const passwordSchema = useMemo(() => z
        .object({
            currentPassword: z
                .string()
                .min(1, sentences.CurrentPasswordRequired[language]),

            password: z
                .string()
                .min(1, sentences.PasswordRequired[language]),

            confirmPassword: z
                .string()
                .min(1, sentences.ConfirmPasswordRequired[language]),
        })
        .refine(
            (data) => data.password === data.confirmPassword,
            {
                path: ["confirmPassword"],
                message: sentences.PasswordsDoNotMatch[language],
            }
        )
        .refine(
            (data) => data.currentPassword !== data.password,
            {
                path: ["password"],
                message:
                    language === "Ar"
                        ? "يجب أن تختلف كلمة المرور الجديدة عن الحالية."
                        : "The new password must differ from the current password.",
            }
        ),
        [language]
    );

    const {
        control,
        register,
        handleSubmit,
        formState: { errors: passwordErrors },
    } = useForm<PasswordFormValues>({
        resolver: zodResolver(passwordSchema),
        mode: "onChange",
        defaultValues: {
            currentPassword: "",
            password: "",
            confirmPassword: "",
        },
    });

    const getErrorMessage = (error: unknown, fallback: string): string => {
        if (error instanceof Error) return error.message;

        if (typeof error === "object" && error !== null && "data" in error) {
            const data = error.data as Record<string, unknown> | null;
            const message = data?.[`message${language}`];

            if (typeof message === "string" && message) return message;
        }

        return fallback;
    };

    const goToStep = (step: ChangePasswordStep) => {
        setActiveStep(step);
        setErrorMessage(null);
        setInfoMessage(null);
    };

    // Step 1: Load the same security questions and CAPTCHA as Forgot Password.
    useEffect(() => {
        let cancelled = false;

        const initialize = async () => {
            try {
                const response = await getChangeQuestions().unwrap();

                if (
                    !response.succeeded ||
                    !response.result?.questions?.length
                ) {
                    throw new Error(
                        response.result?.[`message${language}`] ??
                        response[`message${language}`] ??
                        "Could not load security questions."
                    );
                }

                if (!cancelled) {
                    setQuestions(response.result.questions);
                    setErrorMessage(null);
                }

                const captchaResponse = await getCaptcha().unwrap();

                if (!captchaResponse.succeeded || !captchaResponse.result?.image) {
                    throw new Error("Could not load CAPTCHA.");
                }

                if (!cancelled) {
                    setQuestions(response.result.questions);
                    setCaptchaImage(captchaResponse.result.image);
                    setErrorMessage(null);
                }
            } catch (error) {
                if (!cancelled) {
                    setErrorMessage(
                        getErrorMessage(error, "Could not initialize security questions."),
                    );
                }
            }
        };

        void initialize();

        return () => {
            cancelled = true;
        };
    }, [getChangeQuestions, getCaptcha]);


    const refreshCaptcha = async (clearError = true) => {
        try {
            const response = await getCaptcha().unwrap();

            if (!response.succeeded || !response.result?.image) {
                throw new Error("Could not refresh CAPTCHA.");
            }

            setCaptchaImage(response.result.image);

            if (clearError) {
                setErrorMessage(null);
            }
        } catch (error) {
            setErrorMessage(
                getErrorMessage(error, "Could not refresh CAPTCHA."),
            );
        }
    };

    const onGenerateOTP = async () => {
        const response = await generateUserOTP({
            service_id: "2",
            reference_id: "TRx44455",
            language: language.toLowerCase(),
        }).unwrap();

        const newTransactionId = response.result?.transaction_Id;

        if (!response.succeeded || !newTransactionId) {
            throw new Error(
                response[`message${language}`] ??
                (language === "Ar"
                    ? "تعذر إرسال رمز التحقق."
                    : "Could not send OTP.")
            );
        }

        setTransactionId(newTransactionId);
        setExpireIn(response.result?.expires_In ?? null);

        return {
            transactionId: newTransactionId,
            expires_In: response.result?.expires_In,
        };
    };

    // Step 0: Verify security answers and CAPTCHA.
    const handleSubmitAnswers = async (
        answers: RecoveryAnswer[],
        captchaAnswer?: string,
    ) => {
        if (!captchaAnswer?.trim()) {
            setErrorMessage(
                language === "Ar"
                    ? "من فضلك أدخلي رمز التحقق."
                    : "Please enter the CAPTCHA code.",
            );
            return;
        }

        setErrorMessage(null);
        setInfoMessage(null);

        try {
            const response = await submitChangeAnswers({
                answers: answers.map(({ questionSetId, answer }) => ({
                    questionSetId,
                    answer: answer.trim(),
                })),
                captchaAnswer: captchaAnswer.trim(),
            }).unwrap();

            if (
                !response.succeeded ||
                !response.result?.status
            ) {
                throw new Error(
                    response.result?.[`message${language}`] ??
                    response[`message${language}`] ??
                    (language === "Ar"
                        ? "تعذر التحقق من الإجابات ورمز التحقق."
                        : "Could not verify your answers and CAPTCHA."),
                );
            }

            goToStep(1);
        } catch (error) {
            setErrorMessage(
                getErrorMessage(
                    error,
                    language === "Ar"
                        ? "الإجابات أو رمز التحقق غير صحيح."
                        : "The answers or CAPTCHA are incorrect.",
                ),
            );

            await refreshCaptcha(false);
        }
    };
    const onValidateOTP = async (code: string) => {
        if (!transactionId) {
            throw new Error(
                language === "Ar"
                    ? "معرّف المعاملة غير متوفر."
                    : "The OTP transaction is missing."
            );
        }

        const response = await validateUserOTP({
            otp: code,
            transaction_id: transactionId,
            service_id: "2",
        }).unwrap();

        return {
            succeeded: response.succeeded,
            messageEn: response.messageEn,
            messageAr: response.messageAr,
        };
    };
    // Step 2: Reuse the existing OTP APIs.
    useEffect(() => {
        if (activeStep !== 1) return;

        let cancelled = false;

        const sendOTP = async () => {
            setErrorMessage(null);

            try {
                await onGenerateOTP();
            } catch (error) {
                if (!cancelled) {
                    setErrorMessage(
                        getErrorMessage(error, "Could not send OTP.")
                    );
                }
            }
        };

        void sendOTP();

        return () => {
            cancelled = true;
        };
    }, [activeStep, language, generateUserOTP]);

    // Step 2: UI only until the Change Password API is available.
    const handleChangePassword = async (data: PasswordFormValues) => {
        setErrorMessage(null);
        setInfoMessage(null);

        try {
            const response = await changePassword({
                oldPassword: data.currentPassword,
                newPassword: data.password,
            }).unwrap();

            if (!response.succeeded) {
                throw new Error(
                    response.result?.[`message${language}`] ??
                    response.result?.[`message${language}`] ??
                    "Could not change password."
                );
            }

            setInfoMessage(sentences.ChangePasswordSuccess[language]);
        } catch (error) {
            setErrorMessage(
                getErrorMessage(error, "Could not change password.")
            );
        }
    };

    const isBusy =
        isLoadingQuestions ||
        isLoadingCaptcha ||
        isCheckingAnswers ||
        isGeneratingOTP ||
        isVerifyingOTP ||
        isChangingPassword;

    return (
        <Box sx={styles.container}>
            {/* <Box sx={styles.header}>
                <Typography variant="h1" sx={styles.title(theme)}>
                    {sentences.Title[language]}
                </Typography>

                <Typography
                    variant="body1"
                    sx={styles.description(theme, language)}
                >
                    {sentences.Description[language]}
                </Typography>
            </Box> */}

            <Stepper
                activeStep={activeStep}
                alternativeLabel={isSmallScreen}
                sx={{
                    mb: 3,
                    "& .Mui-completed .MuiSvgIcon-root": {
                        color: "success.main",
                    },
                }}
            >
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>

            {errorMessage && (
                <Alert severity="error"
                    sx={{
                        mb: 2,
                        color: "error.main",
                    }}>
                    {errorMessage}
                </Alert>
            )}

            {infoMessage && (
                <Alert severity="info" sx={{ mb: 2 }}>
                    {infoMessage}
                </Alert>
            )}

            {/* Step 1: Security Questions + CAPTCHA */}
            {activeStep === 0 && (
                <SecurityQuestions
                    // title={sentences.ChangePasswordPageTitle[language]}
                    // description={sentences.ChangePasswordDescription[language]}
                    // buttonText={sentences.ChangingPassword[language]}
                    isContainedCaptha
                    recoveryQuestions={questions}
                    captchaImage={captchaImage}
                    isLoading={isBusy}
                    isError={false}
                    onRetry={refreshCaptcha}
                    onRefreshCaptcha={refreshCaptcha}
                    onSubmit={(answers, captchaAnswer) =>
                        handleSubmitAnswers(
                            answers as RecoveryAnswer[],
                            captchaAnswer,
                        )
                    }
                />
            )}

            {/* Step 3: OTP */}
            {activeStep === 1 && (
                <>
                    {transactionId && !isGeneratingOTP && (
                        <OTP
                            onSuccess={() => goToStep(2)}
                            onGenerateOTP={onGenerateOTP}
                            onValidateOTP={onValidateOTP}
                            SectionTitle={
                                otp_sentences.OTPVerificationTitle[language]
                            }
                            SectionDescription={
                                otp_sentences.OTPVerificationDescription[language]
                            }
                            SubmitBtnText={sentences.Next[language]}
                            firstResult={{
                                transactionId,
                                expires_In: expireIn,
                            }}
                        />
                    )}

                    {isGeneratingOTP && (
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                py: 4,
                            }}
                        >
                            <CircularProgress />
                        </Box>
                    )}
                </>
            )}

            {/* Step 4: Create New Password */}
            {activeStep === 2 && (
                <PasswordFormSection
                    title={sentences.Title[language]}
                    description={sentences.Description[language]}
                    buttonText={sentences.ChangePasswordButton[language]}
                    onSubmit={handleSubmit(handleChangePassword)}
                    disabled={isBusy}
                    showCurrentPassword
                    fieldsProps={{
                        control,
                        register,
                        errors: passwordErrors,
                        phoneNumber: "",
                    }}
                />
            )}
        </Box>
    );
};

export default ChangePassword;
