
import React, { useState } from "react";
import {
    Box,
    Button,
    Checkbox,
    Divider,
    FormControlLabel,
    FormHelperText,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    Typography,
} from "@mui/material";
import SmartphoneOutlinedIcon from "@mui/icons-material/SmartphoneOutlined";

import { checkIsValidPhoneNumber } from "../../../helpers/validations";
import type { PhoneLoginStepProps } from "../types";

function PhoneLoginStep({
    phoneNumber,
    setPhoneNumber,
    rememberMe,
    setRememberMe,
    onContinue,
    onCreateAccount,
}: PhoneLoginStepProps): React.ReactElement {
    const [phoneError, setPhoneError] = useState("");

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const number = phoneNumber.trim();

        if (!number) {
            setPhoneError("Phone number is required");
            return;
        }

        try {
            if (!checkIsValidPhoneNumber("+249" + number)) {
                setPhoneError("Please enter a valid Sudan phone number");
                return;
            }
        } catch {
            setPhoneError("Please enter a valid Sudan phone number");
            return;
        }

        setPhoneError("");
        onContinue();
    };

    return (
        <>
            <Typography variant="h1">Welcome Back!</Typography>

            <Typography variant="body1">
                Login to your account using your registered phone number and password.
            </Typography>

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
                    <InputLabel htmlFor="login-phone">
                        Phone Number<span>*</span>
                    </InputLabel>

                    <OutlinedInput
                        id="login-phone"
                        value={phoneNumber}
                        onChange={(event) => {
                            setPhoneNumber(event.target.value.replace(/\D/g, ""));
                            setPhoneError("");
                        }}
                        placeholder="9xxxxxxxxx"
                        error={!!phoneError}
                        fullWidth
                        inputProps={{
                            inputMode: "numeric",
                            "aria-label": "Phone number",
                        }}
                        startAdornment={
                            <InputAdornment position="start">
                                <SmartphoneOutlinedIcon
                                    fontSize="small"
                                    sx={{ color: "#5C1E5B" }}
                                />
                                <Box component="span" sx={{ ml: 1 }}>
                                    +249
                                </Box>
                            </InputAdornment>
                        }
                    />

                    {phoneError && (
                        <FormHelperText error>{phoneError}</FormHelperText>
                    )}
                </Box>

                <Box>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={rememberMe}
                                onChange={(event) =>
                                    setRememberMe(event.target.checked)
                                }
                                sx={{ p: 0, mr: 1, ml: 1 }}
                            />
                        }
                        label="Remember me"
                        sx={{ mb: 2 }}
                    />

                    <Box sx={{ display: "flex", gap: 1 }}>
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
                            Login using Password
                        </Button>
                        <Button variant='contained' color="info" fullWidth>Login using OTP</Button>
                    </Box>

                    <Divider sx={{ my: 2 }}>or</Divider>

                    <Typography variant="body2" sx={{ textAlign: "center" }} >
                        First time using the portal?{" "}
                        <Button
                            type="button"
                            variant="text"
                            onClick={onCreateAccount}
                            sx={{
                                p: 0,
                                minWidth: "auto",
                                textTransform: "none",
                                color: "#0153A5",
                                textDecoration: "underline",
                                verticalAlign: "baseline",
                            }}
                        >
                            Create an Account
                        </Button>
                    </Typography>
                </Box>
            </Box>
        </>
    );
}

export default PhoneLoginStep;
