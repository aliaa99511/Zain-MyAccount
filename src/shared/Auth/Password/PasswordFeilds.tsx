
import { useContext } from "react";
import {
    Box,
    Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import {
    useWatch,
    type Control,
    type FieldErrors,
    type FieldValues,
    type UseFormRegister,
} from "react-hook-form";

import { LanguageContext } from "../../../App";
import { password_sentences as sentences } from "../../../configurations/language";
import { passwordStyles as styles } from "./passwordStyles";
import PasswordInput from "../../PasswordInput/PasswordInput";


export type PasswordFieldsFormValues = FieldValues & {
    currentPassword?: string;
    password: string;
    confirmPassword: string;
};

export type PasswordFormValues = {
    currentPassword: string;
    password: string;
    confirmPassword: string;
};

export type PasswordFieldsProps = {
    control: Control<PasswordFormValues>;
    register: UseFormRegister<PasswordFormValues>;
    errors: FieldErrors<PasswordFormValues>;
    phoneNumber: string;
    showCurrentPassword?: boolean;
};

type PasswordRule = {
    key: string;
    label: string;
    valid: boolean;
};

const PasswordFields = ({
    control,
    register,
    errors,
    phoneNumber,
    showCurrentPassword = false,
}: PasswordFieldsProps) => {
    const theme = useTheme();
    const languageContext = useContext(LanguageContext);
    const language = languageContext?.language ?? "En";

    const password = useWatch({ control, name: "password", defaultValue: "" });
    const confirmPassword = useWatch({
        control,
        name: "confirmPassword",
        defaultValue: "",
    });

    const normalizedPhone = phoneNumber.replace(/\D/g, "");
    const normalizedPasswordDigits = password.replace(/\D/g, "");

    const rules: PasswordRule[] = [
        {
            key: "minLength",
            label: sentences.PasswordMinLength[language],
            valid: password.length >= 8,
        },
        {
            key: "lowercase",
            label: sentences.PasswordLowercase[language],
            valid: /[a-z]/.test(password),
        },
        {
            key: "notPhone",
            label: sentences.PasswordNotPhone[language],
            valid:
                !phoneNumber ||
                (password !== phoneNumber &&
                    normalizedPasswordDigits !== normalizedPhone),
        },
        {
            key: "noRepeatedChars",
            label: sentences.PasswordNoRepeatedChars[language],
            valid: password.length > 0 && !/(.)\1/u.test(password),
        },
        {
            key: "uppercase",
            label: sentences.PasswordUppercase[language],
            valid: /[A-Z]/.test(password),
        },
        {
            key: "number",
            label: sentences.PasswordNumber[language],
            valid: /\d/.test(password),
        },
        {
            key: "specialChar",
            label: sentences.PasswordSpecialChar[language],
            valid: /[^A-Za-z0-9]/.test(password),
        },
    ];

    const passwordsMatch =
        password.length > 0 &&
        confirmPassword.length > 0 &&
        password === confirmPassword;

    return (
        <Box sx={styles.fields}>
            {showCurrentPassword && (
                <Box sx={styles.field}>
                    <PasswordInput
                        id="currentPassword"
                        registerProps={register("currentPassword")}
                        error={errors.currentPassword}
                        autoComplete="current-password"
                    />
                </Box>
            )}
            {/* PASSWORD */}
            <Box sx={styles.field}>
                <PasswordInput
                    id="password"
                    registerProps={register("password")}
                    error={errors.password}
                    autoComplete="new-password"
                />

                <Box sx={styles.rules}>
                    {rules.map((rule) => (
                        <Box
                            key={rule.key}
                            sx={styles.rule(rule.valid, theme, language)}
                        >
                            {rule.valid ? (
                                <CheckCircleOutlineOutlinedIcon />
                            ) : (
                                <HighlightOffOutlinedIcon />
                            )}

                            <Typography sx={styles.ruleLabel}>
                                {rule.label}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </Box>

            {/* CONFIRM PASSWORD */}
            <Box sx={styles.field}>
                <PasswordInput
                    id="confirmPassword"
                    registerProps={register("confirmPassword")}
                    error={errors.confirmPassword}
                    autoComplete="new-password"
                />

                {passwordsMatch && (
                    <Box sx={styles.matchMessage(theme, language)}>
                        <CheckCircleOutlineOutlinedIcon fontSize="small" />

                        <Box component="span">
                            {sentences.PasswordsMatch[language]}
                        </Box>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default PasswordFields;