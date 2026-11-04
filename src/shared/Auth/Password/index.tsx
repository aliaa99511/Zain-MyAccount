import React, { useContext } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { passwordStyles as styles } from "./passwordStyles";
import { LanguageContext } from "../../../App";
import PasswordFields, { type PasswordFieldsProps } from "./PasswordFeilds";

export type PasswordFormSectionProps = {
    title: string;
    description: string;
    buttonText: string;
    onSubmit?: React.FormEventHandler<HTMLFormElement>;
    onButtonClick?: () => void;
    buttonType?: "button" | "submit";
    disabled?: boolean;
    showCurrentPassword?: boolean;
    fieldsProps: PasswordFieldsProps;
};

const PasswordFormSection = ({
    title,
    description,
    buttonText,
    onSubmit,
    onButtonClick,
    buttonType = "submit",
    disabled = false,
    showCurrentPassword = false,
    fieldsProps,
}: PasswordFormSectionProps) => {
    const theme = useTheme();
    const context = useContext(LanguageContext);
    const language = context?.language ?? "En";

    return (
        <Box component="form" onSubmit={onSubmit} noValidate sx={styles.container}>
            <Box sx={styles.header}>
                <Typography variant="subtitle1" sx={styles.title}>{title}</Typography>
                <Typography variant="body1" sx={styles.description(theme, language)}>{description}</Typography>
            </Box>

            <PasswordFields
                {...fieldsProps}
                showCurrentPassword={showCurrentPassword}
            />

            <Box sx={styles.submitContainer}>
                <Button
                    type={buttonType}
                    variant="contained"
                    onClick={onButtonClick}
                    disabled={disabled}
                    sx={styles.submitButton(theme)}
                >
                    {buttonText}
                </Button>
            </Box>
        </Box>
    );
};

export default PasswordFormSection;

