
import { useContext, useState } from "react";
import {
    FormControl,
    FormHelperText,
    FormLabel,
    IconButton,
    InputAdornment,
    OutlinedInput,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { useTheme } from "@mui/material/styles";
import {
    type FieldError,
    type UseFormRegisterReturn,
} from "react-hook-form";
import { password_sentences } from "../../configurations/language";
import { LanguageContext } from "../../App";
import { passwordStyles } from "../Auth/Password/passwordStyles";

export type PasswordInputProps = {
    id: string;
    label?: string;
    placeholder?: string;
    name?: string;
    value?: string;
    onChange?: (value: string) => void;
    onBlur?: () => void;
    registerProps?: UseFormRegisterReturn;
    error?: FieldError | { message?: string } | string;
    disabled?: boolean;
    required?: boolean;
    autoComplete?: string;
};

const PasswordInput = ({
    id,
    label,
    placeholder = "••••••••",
    value,
    onChange,
    onBlur,
    registerProps,
    error,
    disabled = false,
    required = false,
    autoComplete = "current-password",
}: PasswordInputProps) => {
    const theme = useTheme();
    const languageContext = useContext(LanguageContext);
    const language = languageContext?.language ?? "En";

    const [showPassword, setShowPassword] = useState(false);

    const errorMessage =
        typeof error === "string" ? error : error?.message;

    const isError = Boolean(errorMessage);

    const fieldLabel =
        label ??
        (id === "password"
            ? password_sentences.Password[language]
            : id === "confirmPassword"
                ? password_sentences.ConfirmPassword[language]
                : password_sentences.CurrentPassword[language]);

    const toggleLabel = showPassword
        ? password_sentences.HidePassword[language]
        : password_sentences.ShowPassword[language];

    return (
        <FormControl
            fullWidth
            required={required}
            error={isError}
            disabled={disabled}
            sx={passwordStyles.input}
        >
            <FormLabel
                htmlFor={id}
                sx={{
                    ...passwordStyles.label(theme, language),
                    position: "static",
                    transform: "none",
                    mb: .5,
                    fontWeight: 500,
                }}
            >
                {fieldLabel}
            </FormLabel>

            <OutlinedInput
                id={id}
                name={registerProps?.name ?? id}
                type={showPassword ? "text" : "password"}
                value={value}
                onChange={
                    onChange
                        ? (event) => onChange(event.target.value)
                        : undefined
                }
                onBlur={(event) => {
                    registerProps?.onBlur(event);
                    onBlur?.();
                }}
                inputRef={registerProps?.ref}
                placeholder={placeholder}
                autoComplete={autoComplete}
                disabled={disabled}
                required={required}
                startAdornment={
                    <InputAdornment position="start">
                        <LockOutlinedIcon fontSize="small" />
                    </InputAdornment>
                }
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                            aria-label={toggleLabel}
                            onClick={() =>
                                setShowPassword((previous) => !previous)
                            }
                            edge="end"
                            size="small"
                            disabled={disabled}
                        >
                            {showPassword ? (
                                <VisibilityOffOutlinedIcon
                                    sx={passwordStyles.passwordIcon(theme)}
                                    fontSize="small"
                                />
                            ) : (
                                <VisibilityOutlinedIcon
                                    sx={passwordStyles.passwordIcon(theme)}
                                    fontSize="small"
                                />
                            )}
                        </IconButton>
                    </InputAdornment>
                }
                inputProps={{
                    ...(registerProps
                        ? {
                            onChange: registerProps.onChange,
                        }
                        : {}),
                }}
            />

            {isError && (
                <FormHelperText>{errorMessage}</FormHelperText>
            )}
        </FormControl>
    );
};

export default PasswordInput;
