import React, { useContext, useState } from "react";
import {
    Alert,
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
import type { PasswordStepProps } from "./types";

function PasswordStep({
    password,
    setPassword,
    passwordError,
    onSubmit,
    onResetPassword,
}: PasswordStepProps): React.ReactElement {
    const [showPassword, setShowPassword] = useState(false);
    const [hasValidationError, setHasValidationError] = useState(false);
    const languageContext = useContext(LanguageContext);
    const language = languageContext?.language ?? "En";
    const theme = useTheme();

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!password.trim()) {
            setHasValidationError(true);
            return;
        }

        setHasValidationError(false);
        onSubmit(event);
    };

    return (
        <>
            <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
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
                            error={hasValidationError || !!passwordError}
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

                        {hasValidationError && (
                            <Box role="alert" sx={{ color: "error.main", mb: 2 }}>
                                {password_sentences.PasswordRequired[language]}
                            </Box>
                        )}

                        {passwordError && (
                            <Alert
                                severity="error"
                                variant="outlined"
                                sx={{
                                    color: "error.main",
                                    mt: 2,
                                    alignItems: "flex-start",
                                    "& .MuiAlert-message": { width: "100%" },
                                }}
                            >
                                {passwordError}
                            </Alert>
                        )}

                        <Typography variant="body2" sx={{ mt: 2 }}>
                            {login_sentences.ForgotPassword[language]}{" "}
                            <Button
                                type="button"
                                variant="text"
                                onClick={onResetPassword}
                                sx={{
                                    p: 0,
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
                        }}
                    >
                        {login_sentences.LoginToAccount[language]}
                    </Button>
                </Box>
            </Box>
        </>
    );
}

export default PasswordStep;