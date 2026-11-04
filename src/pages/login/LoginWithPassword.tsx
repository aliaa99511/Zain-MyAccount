import React, { useContext, useState } from "react";
import {
    Box,
    Button,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    Typography,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { useTheme } from "@mui/material/styles";
import { login_sentences, password_sentences } from "../../configurations/language";
import { LanguageContext } from "../../App";
import { useLogin } from "../../shared/Auth/login/useLogin";
import { useGenerateLoginOTPMutation, useLoginWithPasswordMutation, useValidateLoginOTPMutation } from "../../store";
import { useNavigate } from "react-router";
import CustomAlert from "../../shared/CustomAlert";
import { useAuth } from "../../auth/useAuth";
import SecurityQuestion from "./SecurityQuestion";
import OTP from "../../shared/Auth/OTP";


type StepsTypes = "Password" | "SecuirtyQuestion" | "OTP";
function LoginWithPassword(): React.ReactElement {
    const { identifier, rememberMe } = useLogin();
    const {login} = useAuth();
    const [step, setStep] = useState<StepsTypes>("Password");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [hasValidationError, setHasValidationError] = useState(false);
    const languageContext = useContext(LanguageContext);
    const language = languageContext?.language ?? "En";
    const theme = useTheme();
    const navigate = useNavigate();
    const [alert, setAlert] = useState({
        message: "",
        type: "",
    });

    const [loginWithPassword, {data: loginResponse, isLoading: isLoggingIn}] = useLoginWithPasswordMutation();
    const [generateLoginOTP] = useGenerateLoginOTPMutation();
    const [validateLoginOTP] = useValidateLoginOTPMutation();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setAlert({ message: "", type: "" });
        if (!password.trim()) {
            setHasValidationError(true);
            return;
        }
        setHasValidationError(false);
        try {
            const loginWithPasswordResult = await loginWithPassword({ userName: identifier.replace("+249", ""), password, rememberMe }).unwrap();
            if (loginWithPasswordResult.succeeded) {
                if (loginWithPasswordResult.result.status == "Completed") {
                    login(loginWithPasswordResult.result.accessToken);
                    navigate("/dashboard");
                }
                else if(loginWithPasswordResult.result.status == "SecurityQuestion") {
                    setStep("SecuirtyQuestion");
                }
                else {
                    setAlert({message: loginWithPasswordResult.result[`message${language}`] ?? login_sentences.LoginFailedErrorOccurred[language], type: "error"});
                }
            }
            else {
                setAlert({message: loginWithPasswordResult.result[`message${language}`] ?? login_sentences.LoginFailedErrorOccurred[language], type: "error"});
            }
        }
        catch {
            setAlert({ message: login_sentences.LoginFailedErrorOccurred[language], type: "error" });
        }
    };
    const handleResetPassword = () => {
        navigate("/forget_password", {
            state: {
                phoneNumber: identifier
            }
        })
    }
    // Step 2: Request login OTP.
    const handleGenerateOtp = async () => {
        if (!identifier) {
            throw new Error("Phone number is missing.");
        }

        const response = await generateLoginOTP({
            userName: identifier.replace("+249", ""),
            rememberMe,
        }).unwrap();

        if (
            !response.succeeded ||
            (response.result?.status &&
                response.result.status !== "OtpRequired")
        ) {
            throw new Error(
                response[`message${language}`] ??
                login_sentences.OtpSendError[language]
            );
        }

        return response;
        };
    // Step 2: Verify login OTP.
    const handleValidateOtp = async (code: string) => {
        const response = await validateLoginOTP({ code }).unwrap();
        if (!response.succeeded) {
            throw new Error(
                response[`message${language}`] ??
                login_sentences.OtpVerifyError[language]
            );
        }
        login(response?.result?.accessToken ?? "");
        navigate("/dashboard");
        return response;
    };

    return (
        <>
            {step === "Password"?<Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                <>
                    <Typography variant='h1'>{login_sentences.LoginTitle[language]}</Typography>
                    <Typography variant='body1'>{login_sentences.LoginDescription[language]}</Typography>
                </>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    noValidate
                    sx={{
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        gap: 3,
                        mt: 3,
                    }}
                >
                    <Box>
                        <InputLabel htmlFor="login-password">
                            {password_sentences.Password[language]}<span>*</span>
                        </InputLabel>

                        <OutlinedInput
                            id="login-password"
                            fullWidth
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(event) => {
                                setPassword(event.target.value);
                                setHasValidationError(false);
                            }}
                            error={hasValidationError}
                            placeholder={password_sentences.EnterYourPassword[language]}
                            startAdornment={
                                <InputAdornment position="start">
                                    <LockOutlinedIcon
                                        fontSize="small"
                                        sx={{ color: "#5C1E5B" }}
                                    />
                                </InputAdornment>
                            }
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        type="button"
                                        aria-label={
                                            showPassword
                                                ? password_sentences.HidePassword[language]
                                                : password_sentences.ShowPassword[language]
                                        }
                                        onClick={() => setShowPassword((previous) => !previous)}
                                        edge="end"
                                    >
                                        {showPassword ? (
                                            <VisibilityOffOutlinedIcon sx={{ color: theme.palette.primary.main, mr: 1 }} fontSize="small" />
                                        ) : (
                                            <VisibilityOutlinedIcon sx={{ color: theme.palette.primary.main, mr: 1 }} fontSize="small" />
                                        )}
                                    </IconButton>
                                </InputAdornment>
                            }
                        />

                        {alert.message && (
                            <CustomAlert alert={alert} />
                        )}

                        {hasValidationError && (
                            <Box role="alert" sx={{ color: "error.main", mb: 2 }}>
                                {password_sentences.PasswordRequired[language]}
                            </Box>
                        )}

                        <Typography variant="body2" sx={{ mt: 2 }}>
                            {login_sentences.ForgotPassword[language]}{" "}
                            <Button
                                type="button"
                                variant="text"
                                onClick={handleResetPassword}
                                sx={{
                                    py: 0,
                                    minWidth: "auto",
                                    textTransform: "none",
                                    color: "#0153A5",
                                    textDecoration: "underline",
                                    verticalAlign: "baseline",
                                }}
                            >
                                {login_sentences.ResetPassword[language]}
                            </Button>
                        </Typography>
                    </Box>

                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        sx={{
                            py: 1.2,
                            background: (theme) =>
                                `linear-gradient(90deg, #953193 0%, ${theme.palette.primary.light} 100%)`,
                            "&:disabled, &.disabled": {
                                background: "#A3A3A3",
                                color: "#FAFAFA",
                                "&.MuiButton-loading": {
                                    color: "transparent",
                                }
                            }
                        }}
                        loading={isLoggingIn}
                    >
                        {login_sentences.LoginToAccount[language]}
                    </Button>
                </Box>
            </Box> : ""}
            {step === "SecuirtyQuestion"? <SecurityQuestion question={loginResponse?.result.question} onSuccess={setStep} /> : ""}
            {step === "OTP"? 
            <OTP
                phoneNumber={identifier}
                onSuccess={()=>{}}
                SectionTitle={<Typography variant='h1'>{login_sentences.EnterReceivedOTP[language]}</Typography>}
                SectionDescription={<Typography variant='body1'>{login_sentences.EnterReceivedOTPDescription[language]}</Typography>}
                SubmitBtnText={login_sentences.LoginToAccount[language]}
                firstResult={null}
                onGenerateOTP={handleGenerateOtp}
                onValidateOTP={handleValidateOtp}
            /> : ""}
        </>
    );
}

export default LoginWithPassword;