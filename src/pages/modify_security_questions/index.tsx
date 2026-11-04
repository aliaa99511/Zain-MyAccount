import React, {
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";

import {
    Alert,
    Box,
    CircularProgress,
    Stack,
} from "@mui/material";

import { LanguageContext } from "../../App";
import OTP from "../../shared/Auth/OTP";
import {
    useGetChallengeQuestionsQuery,
    useGenerateUserOTPMutation,
    useValidateUserOTPMutation,
    useChangeSecurityAnswersMutation,
} from "../../store";
import SecurityQuestions from "../../shared/Auth/SecurityQuestions";
import type { SecurityAnswer } from "../../shared/Auth/SecurityQuestions/securityQuestions.types";
import { passwordStyles as styles } from "../../shared/Auth/Password/passwordStyles";
import PasswordInput from "../../shared/PasswordInput/PasswordInput";

const OTP_SERVICE_ID = "2";
const OTP_REFERENCE_ID = "TRx44455";

type ChangeSecurityAnswer = {
    questionSetId: string;
    questionId: string;
    question: string;
    answer: string;
};
const ModifySecurityQuestions: React.FC = () => {
    const context = useContext(LanguageContext);
    const language = context?.language ?? "En";
    const isArabic = language === "Ar";

    const [activeStep, setActiveStep] = useState<0 | 1>(0);
    const [transactionId, setTransactionId] = useState("");
    const [expiresIn, setExpiresIn] = useState<string | number>("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Load the questions from CreateAccountApi.
    const {
        data: questionsResponse,
        isLoading: isLoadingQuestions,
        isError: isQuestionsError,
        refetch: refetchQuestions,
    } = useGetChallengeQuestionsQuery();

    // Reuse the OTP mutations from UserApi.
    const [generateUserOTP, { isLoading: isGeneratingOTP }] = useGenerateUserOTPMutation();
    const [validateUserOTP] = useValidateUserOTPMutation();
    const [changeSecurityAnswers, { isLoading: isSavingAnswers },] = useChangeSecurityAnswersMutation();

    const getMessage = useCallback(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (response: any, fallback: string): string => {
            return (
                response?.data?.[`message${language}`] ??
                response?.data?.result?.[`message${language}`] ??
                response?.result?.[`message${language}`] ??
                response?.[`message${language}`] ??
                fallback
            );
        },
        [language]
    );

    // Generate the initial OTP when the page opens.
    useEffect(() => {
        let cancelled = false;

        const sendInitialOTP = async () => {
            setErrorMessage(null);

            try {
                const response = await generateUserOTP({
                    service_id: OTP_SERVICE_ID,
                    reference_id: OTP_REFERENCE_ID,
                    language: language.toLowerCase(),
                }).unwrap();

                if (
                    !response.succeeded ||
                    !response.result?.transaction_Id
                ) {
                    throw new Error(
                        getMessage(
                            response,
                            isArabic
                                ? "تعذر إرسال رمز التحقق."
                                : "Could not send OTP."
                        )
                    );
                }

                if (!cancelled) {
                    setTransactionId(
                        response.result.transaction_Id
                    );

                    setExpiresIn(
                        response.result.expires_In
                    );
                }
            } catch (error) {
                if (!cancelled) {
                    setErrorMessage(
                        getMessage(
                            error,
                            isArabic
                                ? "تعذر إرسال رمز التحقق."
                                : "Could not send OTP."
                        )
                    );
                }
            }
        };

        void sendInitialOTP();

        return () => {
            cancelled = true;
        };
    }, [
        generateUserOTP,
        language,
        isArabic,
        getMessage,
    ]);

    // Generate a new OTP when the user clicks Resend OTP.
    const handleGenerateOTP = useCallback(async () => {
        const response = await generateUserOTP({
            service_id: OTP_SERVICE_ID,
            reference_id: OTP_REFERENCE_ID,
            language: language.toLowerCase(),
        }).unwrap();

        if (
            !response.succeeded ||
            !response.result?.transaction_Id
        ) {
            throw new Error(
                getMessage(
                    response,
                    isArabic
                        ? "تعذر إعادة إرسال رمز التحقق."
                        : "Could not resend OTP."
                )
            );
        }

        const newTransactionId =
            response.result.transaction_Id;

        const newExpiresIn =
            response.result.expires_In;

        setTransactionId(newTransactionId);
        setExpiresIn(newExpiresIn);
        setErrorMessage(null);

        return {
            transactionId: newTransactionId,
            expires_In: newExpiresIn,
        };
    }, [
        generateUserOTP,
        language,
        isArabic,
        getMessage,
    ]);

    // Validate OTP before allowing access to the questions form.
    const handleValidateOTP = useCallback(
        async (code: string) => {
            if (!transactionId) {
                throw new Error(
                    isArabic
                        ? "معرّف المعاملة غير متوفر. أرسلي رمزًا جديدًا."
                        : "The OTP transaction is missing. Please resend the code."
                );
            }

            const response = await validateUserOTP({
                otp: code,
                transaction_id: transactionId,
                service_id: OTP_SERVICE_ID,
            }).unwrap();

            return {
                succeeded: response.succeeded,
                messageEn: response.messageEn,
                messageAr: response.messageAr,
                result: {
                    status: response.succeeded
                        ? "success"
                        : "failed",
                    messageEn: response.messageEn,
                    messageAr: response.messageAr,
                },
            };
        },
        [
            transactionId,
            validateUserOTP,
            isArabic,
        ]
    );

    // Submit current password and the selected security answers.
    const handleSubmitAnswers = async (
        answers: SecurityAnswer[]
    ) => {
        setErrorMessage(null);
        setSuccessMessage(null);

        if (!currentPassword.trim()) {
            setErrorMessage(
                isArabic
                    ? "من فضلك أدخلي كلمة المرور الحالية."
                    : "Please enter your current password."
            );
            return;
        }

        const payloadAnswers: ChangeSecurityAnswer[] = answers.map(
            (item) => ({
                questionSetId: item.questionSetId,
                questionId: item.questionId,
                question: item.question,
                answer: item.answer.trim(),
            })
        );

        try {
            const response = await changeSecurityAnswers({
                currentPassword,
                answers: payloadAnswers,
            }).unwrap();

            if (!response.succeeded) {
                throw new Error(
                    getMessage(
                        response,
                        isArabic
                            ? "تعذر تعديل أسئلة الأمان."
                            : "Could not modify security questions."
                    )
                );
            }

            setSuccessMessage(
                isArabic
                    ? "تم تعديل أسئلة الأمان بنجاح."
                    : "Security questions updated successfully."
            );

            setCurrentPassword("");
        } catch (error) {
            setErrorMessage(
                getMessage(
                    error,
                    isArabic
                        ? "حدث خطأ أثناء تعديل أسئلة الأمان."
                        : "An error occurred while modifying security questions."
                )
            );
        }
    };

    return (
        <Box sx={styles.container}>
            {errorMessage && (
                <Alert
                    severity="error"
                    sx={{ mb: 2, color: "error.main" }}
                >
                    {errorMessage}
                </Alert>
            )}

            {successMessage && (
                <Alert
                    severity="success"
                    sx={{ mb: 2, color: "success.main" }}
                >
                    {successMessage}
                </Alert>
            )}

            {/* STEP 1: OTP */}
            {activeStep === 0 && (
                <Box>
                    {!transactionId && isGeneratingOTP ? (
                        <Stack
                            spacing={2}
                            sx={{ py: 5, alignItems: "center" }}
                        >
                            <CircularProgress sx={{}} />
                        </Stack>
                    ) : (
                        <OTP
                            onSuccess={() => {
                                setErrorMessage(null);
                                setSuccessMessage(null);
                                setActiveStep(1);
                            }}
                            onGenerateOTP={handleGenerateOTP}
                            onValidateOTP={handleValidateOTP}
                            SectionTitle={
                                isArabic
                                    ? "أدخلي رمز التحقق المستلم"
                                    : "Enter the received OTP"
                            }
                            SectionDescription={
                                isArabic
                                    ? "أدخلي الرمز المرسل إليك عبر رسالة نصية."
                                    : "Enter the code sent to you by SMS."
                            }
                            SubmitBtnText={
                                isArabic
                                    ? "المتابعة إلى أسئلة الأمان"
                                    : "Proceed to Security Questions"
                            }
                            firstResult={{
                                transactionId,
                                expires_In: expiresIn,
                            }}
                        />
                    )}
                </Box>
            )}

            {/* STEP 2: CURRENT PASSWORD + SECURITY QUESTIONS */}
            {activeStep === 1 && (
                <Stack spacing={3}>
                    {/* Current Password */}
                    <Box sx={styles.field}>
                        <PasswordInput
                            id="currentPassword"
                            label={
                                isArabic
                                    ? "كلمة المرور الحالية"
                                    : "Current Password"
                            }
                            value={currentPassword}
                            onChange={(value) => {
                                setCurrentPassword(value);
                                setErrorMessage(null);
                                setSuccessMessage(null);
                            }}
                            disabled={isSavingAnswers}
                            required
                            autoComplete="current-password"
                            placeholder={
                                isArabic
                                    ? "أدخلي كلمة المرور الحالية"
                                    : "Enter your current password"
                            }
                        />
                    </Box>

                    {/* Shared Security Questions Module */}
                    <SecurityQuestions
                        questionsResponse={questionsResponse}
                        isLoading={isLoadingQuestions}
                        isError={isQuestionsError}
                        onRetry={() => {
                            void refetchQuestions();
                        }}
                        showHeader={false}
                        onSubmit={handleSubmitAnswers}
                        onError={(errors) => {
                            console.error("Security questions validation:", errors);
                        }}
                    />
                </Stack>
            )}

        </Box>
    );
};

export default ModifySecurityQuestions;