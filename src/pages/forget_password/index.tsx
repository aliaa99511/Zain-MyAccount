import React, { useContext, useEffect, useMemo, useState } from "react";
import {
    Alert,
    Box,
} from "@mui/material";
import { useLocation } from "react-router";
import { LanguageContext } from "../../App";
import { login_sentences } from "../../configurations/language";
import { password_sentences } from "../../configurations/language";

import type {
    RecoveryQuestion,
    RecoveryAnswer
} from "../../shared/Auth/SecurityQuestions/securityQuestions.types";
import {
    useRecoveryQuestionsMutation,
    useLazyGetCaptchaQuery,
    useRecoveryAnswersMutation,
    useGenerateOTPMutation,
    useValidateOTPMutation,
    useRecoveryPasswordMutation,
} from "../../store";

import SecurityQuestions from "../../shared/Auth/SecurityQuestions";
import OTP from "../../shared/Auth/OTP";
import PasswordFormSection from "../../shared/Auth/Password";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { PasswordFormValues } from "../../shared/Auth/Password/PasswordFeilds";

type RecoveryStep = 0 | 1 | 2;

const ForgotPassword: React.FC = () => {
    const context = useContext(LanguageContext);
    const language = context?.language ?? "En";
    // const theme = useTheme();

    const location = useLocation();
    const phoneNumber = location.state?.phoneNumber as string | undefined;
    // const phoneNumber = "965672476"
    // console.log('phoneNumber', phoneNumber)

    // const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

    const [activeStep, setActiveStep] = useState<RecoveryStep>(0);
    const [questions, setQuestions] = useState<RecoveryQuestion[]>([]);
    const [captchaImage, setCaptchaImage] = useState("");
    // const [verifiedAnswers, setVerifiedAnswers] = useState<RecoveryAnswer[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [getRecoveryQuestions, { isLoading: isLoadingQuestions }] = useRecoveryQuestionsMutation();
    const [getCaptcha, { isFetching: isLoadingCaptcha },] = useLazyGetCaptchaQuery();
    const [submitRecoveryAnswers, { isLoading: isCheckingAnswers }] = useRecoveryAnswersMutation();
    const [generateOTP, { data: generatedData, isLoading: isGeneratingOTP }] = useGenerateOTPMutation();
    const [validateOTP] = useValidateOTPMutation();
    const [recoverPassword, { isLoading: isChangingPassword }] = useRecoveryPasswordMutation();

    // Add currentPassword to the schema.
    const passwordSchema = useMemo(
        () =>
            z
                .object({
                    currentPassword: z.string(),
                    password: z.string().min(
                        1,
                        password_sentences.PasswordRequired[language],
                    ),
                    confirmPassword: z.string().min(
                        1,
                        password_sentences.ConfirmPasswordRequired[language],
                    ),
                })
                .refine((data) => data.password === data.confirmPassword, {
                    path: ["confirmPassword"],
                    message: password_sentences.PasswordsDoNotMatch[language],
                }),
        [language],
    );

    const {
        control,
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<PasswordFormValues>({
        resolver: zodResolver(passwordSchema),
        mode: "onChange",
        defaultValues: {
            currentPassword: "",
            password: "",
            confirmPassword: "",
        },
    });

    const nextStep = () => {
        setActiveStep((previous) => Math.min(previous + 1, 2) as RecoveryStep);
        setErrorMessage(null);
    };

    const getErrorMessage = (
        error: unknown,
        fallback: string,
    ): string => {
        if (error instanceof Error) {
            return error.message;
        }

        return fallback;
    };

    // Step 1: Load recovery questions and CAPTCHA.
    useEffect(() => {
        if (!phoneNumber) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setErrorMessage(login_sentences.PhoneNumberMissing[language]);
            return;
        }

        let cancelled = false;

        const initializeRecovery = async () => {
            try {
                const response = await getRecoveryQuestions({
                    userName: phoneNumber.replace("+249", ""),
                }).unwrap();

                if (
                    !response.succeeded ||
                    response.result?.status !== "QuestionsReady" ||
                    !response.result.questions?.length
                ) {
                    throw new Error(
                        response.result?.[`message${language}`] ??
                        response[`message${language}`] ??
                        login_sentences.RecoveryQuestionsError[language],
                    );
                }

                const captchaResponse = await getCaptcha().unwrap();

                if (
                    !captchaResponse.succeeded ||
                    !captchaResponse.result?.image
                ) {
                    throw new Error(
                        login_sentences.CaptchaLoadError[language],
                    );
                }

                if (!cancelled) {
                    setQuestions(response.result.questions);
                    setCaptchaImage(captchaResponse.result.image);
                    setErrorMessage(null);
                }
            } catch (error) {
                if (!cancelled) {
                    setErrorMessage(
                        getErrorMessage(error, login_sentences.PhoneNumberMissing[language]),
                    );
                }
            }
        };

        void initializeRecovery();

        return () => {
            cancelled = true;
        };
    }, [phoneNumber, getRecoveryQuestions, getCaptcha, language]);

    useEffect(() => {
        if (activeStep === 1 && phoneNumber && language) {
            void generateOTP({
                number: phoneNumber.replace("+", ""),
                language: language.toLowerCase(),
            });
        }
    }, [activeStep, phoneNumber, language, generateOTP]);

    const handleRefreshCaptcha = async () => {
        try {
            const response = await getCaptcha().unwrap();

            if (!response.succeeded || !response.result?.image) {
                throw new Error(login_sentences.CaptchaRefreshError[language]);
            }

            setCaptchaImage(response.result.image);
            setErrorMessage(null);
        } catch (error) {
            setErrorMessage(
                getErrorMessage(error, login_sentences.CaptchaRefreshError[language]),
            );
        }
    };

    // Step 1: Verify answers and CAPTCHA.
    const handleSubmitAnswers = async (
        answers: RecoveryAnswer[],
        captchaAnswer?: string,
    ) => {
        if (!captchaAnswer?.trim()) {
            setErrorMessage(login_sentences.CaptchaInvalid[language]);
            return;
        }

        setErrorMessage(null);

        try {
            const response = await submitRecoveryAnswers({
                answers: answers.map(({ questionSetId, answer }) => ({
                    questionSetId,
                    answer: answer.trim(),
                })),
                captchaAnswer: captchaAnswer.trim(),
            }).unwrap();

            if (
                !response.succeeded ||
                response.result?.status !== "ReadyToSetPassword"
            ) {
                throw new Error(
                    response.result?.[`message${language}`] ??
                    response[`message${language}`] ??
                    "The answers or CAPTCHA are incorrect.",
                );
            }

            nextStep();
        } catch (error) {
            setErrorMessage(
                getErrorMessage(
                    error,
                    login_sentences.VerifyRecoveryError[language],
                ),
            );
        }
    };


    // Step 3: Set the new password.
    const handleChangePassword = async (data: PasswordFormValues) => {
        setErrorMessage(null);
        setSuccessMessage(null);

        try {
            const response = await recoverPassword({
                newPassword: data.password,
            }).unwrap();

            if (!response.succeeded) {
                throw new Error(
                    response.result?.[`message${language}`] ??
                    response[`message${language}`] ??
                    password_sentences.ChangePasswordError[language]
                );
            }

            setSuccessMessage(
                response.result?.[`message${language}`] ??
                response[`message${language}`] ??
                password_sentences.PasswordChangedSuccessfully[language],
            );
        } catch (error) {
            setErrorMessage(
                getErrorMessage(error,
                    password_sentences.ChangePasswordError[language]
                ),
            );
        }
    };

    return (
        <Box sx={{ width: "100%" }}>

            {errorMessage && (
                <Alert severity="error"
                    sx={{
                        mb: 2,
                        color: "error.main",
                    }}>
                    {errorMessage}
                </Alert>
            )}

            {successMessage && (
                <Alert severity="success" sx={{
                    mb: 2,
                    color: "success.main",
                }}>
                    {successMessage}
                </Alert>
            )}

            {activeStep === 0 && phoneNumber && (
                <SecurityQuestions
                    isContainedCaptha
                    recoveryQuestions={questions}
                    captchaImage={captchaImage}
                    isLoading={
                        isLoadingQuestions ||
                        isLoadingCaptcha ||
                        isCheckingAnswers
                    }
                    isError={false}
                    onRetry={handleRefreshCaptcha}
                    onRefreshCaptcha={handleRefreshCaptcha}
                    onSubmit={(answers, captchaAnswer) =>
                        handleSubmitAnswers(
                            answers as RecoveryAnswer[],
                            captchaAnswer,
                        )
                    }
                />
            )}

            {activeStep === 1 && phoneNumber && !successMessage && (
                <>
                    {!isGeneratingOTP && generatedData && (
                        <OTP
                            phoneNumber={phoneNumber}
                            onSuccess={nextStep}
                            generateOTP={generateOTP}
                            validateOTP={validateOTP}
                            SectionTitle={login_sentences.EnterReceivedOTP[language]}
                            SectionDescription={
                                login_sentences.EnterReceivedOTPDescription[language]
                            }
                            SubmitBtnText={login_sentences.Continue[language]}
                            firstResult={generatedData.result}
                        />
                    )}
                </>
            )}
            {activeStep === 2 && phoneNumber && !successMessage && (
                <PasswordFormSection
                    title={password_sentences.ResetPasswordPageTitle[language]}
                    description={password_sentences.ResetPasswordDescription[language]}
                    buttonText={password_sentences.ChangePasswordButton[language]}
                    onSubmit={handleSubmit(handleChangePassword)}
                    disabled={isChangingPassword}
                    showCurrentPassword={false}
                    fieldsProps={{
                        control,
                        register,
                        errors,
                        phoneNumber: "",
                    }}
                />
            )}
        </Box>
    );
};

export default ForgotPassword;



















// import React, { useContext, useEffect, useMemo, useState } from "react";
// import {
//     Alert,
//     Box,
// } from "@mui/material";
// import { useLocation } from "react-router";
// import { LanguageContext } from "../../App";
// import { login_sentences } from "../../configurations/language";
// import { password_sentences } from "../../configurations/language";

// import type {
//     RecoveryQuestion,
//     RecoveryAnswer
// } from "../../shared/Auth/SecurityQuestions/securityQuestions.types";
// import {
//     useRecoveryQuestionsMutation,
//     useLazyGetCaptchaQuery,
//     useRecoveryAnswersMutation,
//     useGenerateOTPMutation,
//     useValidateOTPMutation,
//     useRecoveryPasswordMutation,
// } from "../../store";

// import SecurityQuestions from "../../shared/Auth/SecurityQuestions";
// import OTP from "../../shared/Auth/OTP";
// import PasswordFormSection from "../../shared/Auth/Password";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import type { PasswordFormValues } from "../../shared/Auth/Password/PasswordFeilds";

// type RecoveryStep = 0 | 1 | 2;

// const ForgotPassword: React.FC = () => {
//     const context = useContext(LanguageContext);
//     const language = context?.language ?? "En";
//     // const theme = useTheme();

//     const location = useLocation();
//     const phoneNumber = location.state?.phoneNumber as string | undefined;
//     // const phoneNumber = "965672476"
//     // console.log('phoneNumber', phoneNumber)

//     // const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

//     const [activeStep, setActiveStep] = useState<RecoveryStep>(0);
//     const [questions, setQuestions] = useState<RecoveryQuestion[]>([]);
//     const [captchaImage, setCaptchaImage] = useState("");
//     // const [verifiedAnswers, setVerifiedAnswers] = useState<RecoveryAnswer[]>([]);
//     const [errorMessage, setErrorMessage] = useState<string | null>(null);
//     const [successMessage, setSuccessMessage] = useState<string | null>(null);
//     const [otpTransactionId, setOtpTransactionId] = useState("");

//     const [getRecoveryQuestions, { isLoading: isLoadingQuestions }] = useRecoveryQuestionsMutation();
//     const [getCaptcha, { isFetching: isLoadingCaptcha },] = useLazyGetCaptchaQuery();
//     const [submitRecoveryAnswers, { isLoading: isCheckingAnswers }] = useRecoveryAnswersMutation();
//     const [generateOtp] = useGenerateOTPMutation();
//     const [validateOtp] = useValidateOTPMutation();
//     const [recoverPassword, { isLoading: isChangingPassword }] = useRecoveryPasswordMutation();

//     // Add currentPassword to the schema.
//     const passwordSchema = useMemo(
//         () =>
//             z
//                 .object({
//                     currentPassword: z.string(),
//                     password: z.string().min(
//                         1,
//                         password_sentences.PasswordRequired[language],
//                     ),
//                     confirmPassword: z.string().min(
//                         1,
//                         password_sentences.ConfirmPasswordRequired[language],
//                     ),
//                 })
//                 .refine((data) => data.password === data.confirmPassword, {
//                     path: ["confirmPassword"],
//                     message: password_sentences.PasswordsDoNotMatch[language],
//                 }),
//         [language],
//     );

//     const {
//         control,
//         register,
//         handleSubmit,
//         formState: { errors }
//     } = useForm<PasswordFormValues>({
//         resolver: zodResolver(passwordSchema),
//         mode: "onChange",
//         defaultValues: {
//             currentPassword: "",
//             password: "",
//             confirmPassword: "",
//         },
//     });

//     const nextStep = () => {
//         setActiveStep((previous) => Math.min(previous + 1, 2) as RecoveryStep);
//         setErrorMessage(null);
//     };

//     const getErrorMessage = (
//         error: unknown,
//         fallback: string,
//     ): string => {
//         if (error instanceof Error) {
//             return error.message;
//         }

//         return fallback;
//     };

//     // Step 1: Load recovery questions and CAPTCHA.
//     useEffect(() => {
//         if (!phoneNumber) {
//             // eslint-disable-next-line react-hooks/set-state-in-effect
//             setErrorMessage(login_sentences.PhoneNumberMissing[language]);
//             return;
//         }

//         let cancelled = false;

//         const initializeRecovery = async () => {
//             try {
//                 const response = await getRecoveryQuestions({
//                     userName: phoneNumber.replace("+249", ""),
//                 }).unwrap();

//                 if (
//                     !response.succeeded ||
//                     response.result?.status !== "QuestionsReady" ||
//                     !response.result.questions?.length
//                 ) {
//                     throw new Error(
//                         response.result?.[`message${language}`] ??
//                         response[`message${language}`] ??
//                         login_sentences.RecoveryQuestionsError[language],
//                     );
//                 }

//                 const captchaResponse = await getCaptcha().unwrap();

//                 if (
//                     !captchaResponse.succeeded ||
//                     !captchaResponse.result?.image
//                 ) {
//                     throw new Error(
//                         login_sentences.CaptchaLoadError[language],
//                     );
//                 }

//                 if (!cancelled) {
//                     setQuestions(response.result.questions);
//                     setCaptchaImage(captchaResponse.result.image);
//                     setErrorMessage(null);
//                 }
//             } catch (error) {
//                 if (!cancelled) {
//                     setErrorMessage(
//                         getErrorMessage(error, login_sentences.PhoneNumberMissing[language]),
//                     );
//                 }
//             }
//         };

//         void initializeRecovery();

//         return () => {
//             cancelled = true;
//         };
//     }, [phoneNumber, getRecoveryQuestions, getCaptcha, language]);

//     const handleRefreshCaptcha = async () => {
//         try {
//             const response = await getCaptcha().unwrap();

//             if (!response.succeeded || !response.result?.image) {
//                 throw new Error(login_sentences.CaptchaRefreshError[language]);
//             }

//             setCaptchaImage(response.result.image);
//             setErrorMessage(null);
//         } catch (error) {
//             setErrorMessage(
//                 getErrorMessage(error, login_sentences.CaptchaRefreshError[language]),
//             );
//         }
//     };

//     // Step 1: Verify answers and CAPTCHA.
//     const handleSubmitAnswers = async (
//         answers: RecoveryAnswer[],
//         captchaAnswer?: string,
//     ) => {
//         if (!captchaAnswer?.trim()) {
//             setErrorMessage(login_sentences.CaptchaInvalid[language]);
//             return;
//         }

//         setErrorMessage(null);

//         try {
//             const response = await submitRecoveryAnswers({
//                 answers: answers.map(({ questionSetId, answer }) => ({
//                     questionSetId,
//                     answer: answer.trim(),
//                 })),
//                 captchaAnswer: captchaAnswer.trim(),
//             }).unwrap();

//             if (
//                 !response.succeeded ||
//                 response.result?.status !== "ReadyToSetPassword"
//             ) {
//                 throw new Error(
//                     response.result?.[`message${language}`] ??
//                     response[`message${language}`] ??
//                     "The answers or CAPTCHA are incorrect.",
//                 );
//             }

//             nextStep();
//         } catch (error) {
//             setErrorMessage(
//                 getErrorMessage(
//                     error,
//                     login_sentences.VerifyRecoveryError[language],
//                 ),
//             );
//         }
//     };

//     // Step 2: Request login OTP.
//     const handleGenerateOtp = async () => {
//         if (!phoneNumber) {
//             throw new Error("Phone number is missing.");
//         }

//         const response = await generateOtp({
//             number: phoneNumber.replace("+249", ""),
//             language,
//         }).unwrap();

//         const transactionId = response.result?.transactionId;

//         if (!response.succeeded || !transactionId) {
//             throw new Error(
//                 response.messageEn ?? login_sentences.OtpSendError[language],
//             );
//         }

//         setOtpTransactionId(transactionId);
//         return response;
//     };

//     // Step 2: Verify login OTP.
//     const handleValidateOtp = async (code: string) => {
//         if (!phoneNumber || !otpTransactionId) {
//             throw new Error("OTP transaction is missing. Please request a new OTP.");
//         }

//         const response = await validateOtp({
//             number: phoneNumber.replace("+249", ""),
//             otp: code,
//             transaction_id: otpTransactionId,
//         }).unwrap();

//         if (!response.succeeded) {
//             throw new Error(
//                 response.messageEn ?? login_sentences.OtpVerifyError[language],
//             );
//         }

//         nextStep();
//         return response;
//     };

//     // Step 3: Set the new password.
//     const handleChangePassword = async (data: PasswordFormValues) => {
//         setErrorMessage(null);
//         setSuccessMessage(null);

//         try {
//             const response = await recoverPassword({
//                 newPassword: data.password,
//             }).unwrap();

//             if (!response.succeeded) {
//                 throw new Error(
//                     response.result?.[`message${language}`] ??
//                     response[`message${language}`] ??
//                     password_sentences.ChangePasswordError[language]
//                 );
//             }

//             setSuccessMessage(
//                 response.result?.[`message${language}`] ??
//                 response[`message${language}`] ??
//                 password_sentences.PasswordChangedSuccessfully[language],
//             );
//         } catch (error) {
//             setErrorMessage(
//                 getErrorMessage(error,
//                     password_sentences.ChangePasswordError[language]
//                 ),
//             );
//         }
//     };

//     return (
//         <Box sx={{ width: "100%" }}>
//             {/* <Stepper
//                 activeStep={activeStep}
//                 alternativeLabel={isSmallScreen}
//                 sx={{
//                     mb: 3,
//                     "& .Mui-completed .MuiSvgIcon-root": {
//                         color: "success.main",
//                     },
//                 }}
//             >
//                 {steps.map((label) => (
//                     <Step key={label}>
//                         <StepLabel>{label}</StepLabel>
//                     </Step>
//                 ))}
//             </Stepper> */}

//             {errorMessage && (
//                 <Alert severity="error"
//                     sx={{
//                         mb: 2,
//                         color: "error.main",
//                     }}>
//                     {errorMessage}
//                 </Alert>
//             )}

//             {successMessage && (
//                 <Alert severity="success" sx={{
//                     mb: 2,
//                     color: "success.main",
//                 }}>
//                     {successMessage}
//                 </Alert>
//             )}

//             {activeStep === 0 && phoneNumber && (
//                 <SecurityQuestions
//                     isContainedCaptha
//                     recoveryQuestions={questions}
//                     captchaImage={captchaImage}
//                     isLoading={
//                         isLoadingQuestions ||
//                         isLoadingCaptcha ||
//                         isCheckingAnswers
//                     }
//                     isError={false}
//                     onRetry={handleRefreshCaptcha}
//                     onRefreshCaptcha={handleRefreshCaptcha}
//                     onSubmit={(answers, captchaAnswer) =>
//                         handleSubmitAnswers(
//                             answers as RecoveryAnswer[],
//                             captchaAnswer,
//                         )
//                     }
//                 />
//             )}

//             {activeStep === 1 && phoneNumber && !successMessage && (
//                 <OTP
//                     phoneNumber={phoneNumber}
//                     onGenerateOTP={handleGenerateOtp}
//                     onValidateOTP={handleValidateOtp}
//                     onSuccess={() => {
//                         // handleValidateOtp already advances to the password step.
//                     }}
//                     SectionTitle={login_sentences.EnterReceivedOTP[language]}
//                     SectionDescription={
//                         login_sentences.EnterReceivedOTPDescription[language]
//                     }
//                     SubmitBtnText={login_sentences.Continue[language]}
//                 />
//             )}
//             {activeStep === 2 && phoneNumber && !successMessage && (
//                 <PasswordFormSection
//                     title={password_sentences.ResetPasswordPageTitle[language]}
//                     description={password_sentences.ResetPasswordDescription[language]}
//                     buttonText={password_sentences.ChangePasswordButton[language]}
//                     onSubmit={handleSubmit(handleChangePassword)}
//                     disabled={isChangingPassword}
//                     showCurrentPassword={false}
//                     fieldsProps={{
//                         control,
//                         register,
//                         errors,
//                         phoneNumber: "",
//                     }}
//                 />
//             )}
//         </Box>
//     );
// };

// export default ForgotPassword;
