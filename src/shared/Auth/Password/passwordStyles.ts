import type { Theme } from "@mui/material/styles";

const tokens = {
    spacing: 2,
    labelFontSize: "0.875rem",
    inputMinHeight: "3rem",
    inputBorderRadius: "0.5rem",
    helperFontSize: "0.6875rem",
    ruleSpacing: 0.5,
    buttonMinHeight: "3rem",
    buttonBorderRadius: "0.5rem",
};

export const passwordStyles = {
    tokens,

    container: {
        flexGrow: 1,
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        overflowY: 'scroll',
        paddingInlineEnd: '12px',
    },

    header: {
        mb: 2,
    },

    title: (theme: Theme) => ({
        color: theme.palette.text.primary,
        fontWeight: 600,
        fontSize: "2rem"
    }),

    description: (theme: Theme, language: "En" | "Ar") => ({
        color: theme.palette.text.secondary,
        lineHeight: 1.6,
        textAlign: language === "Ar" ? "right" : "left",
        direction: language === "Ar" ? "rtl" : "ltr",
    }),

    form: {
        flexGrow: 1,
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        gap: tokens.spacing,
    },

    fields: {
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
    },

    field: {
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
    },
    label: (theme: Theme, language: "En" | "Ar") => ({
        display: "block",
        position: "static",
        transform: "none",
        color: theme.palette.text.primary,
        fontSize: tokens.labelFontSize,
        fontWeight: 500,
        marginBottom: "12px",
        textAlign: language === "Ar" ? "right" : "left",
        direction: language === "Ar" ? "rtl" : "ltr",
    }),

    input: {
        width: "100%",

        "& .MuiOutlinedInput-root": {
            minHeight: tokens.inputMinHeight,
            borderRadius: tokens.inputBorderRadius,
            backgroundColor: "transparent",

            "& fieldset": {
                borderWidth: "1px",
            },

            "&.Mui-focused fieldset": {
                borderWidth: "1.5px",
            },
        },

        "& .MuiOutlinedInput-input": {
            minWidth: 0,
            py: 1.25,
        },
    },

    rules: {
        display: "flex",
        flexDirection: "column",
        gap: tokens.ruleSpacing,
        mt: 1.5,
    },

    rule: (valid: boolean, theme: Theme, language: "En" | "Ar") => ({
        display: "flex",
        alignItems: "flex-start",
        gap: 1,
        color: valid ? theme.palette.success.main : theme.palette.error.main,
        fontSize: tokens.helperFontSize,
        lineHeight: 1.5,
        direction: language === "Ar" ? "rtl" : "ltr",
        textAlign: language === "Ar" ? "right" : "left",

        "& .MuiSvgIcon-root": {
            fontSize: "0.875rem",
            flexShrink: 0,
            mt: "1px",
        },
    }),
    ruleLabel: {
        fontSize: "1rem"
    },
    matchMessage: (theme: Theme, language: "En" | "Ar") => ({
        display: "flex",
        alignItems: "center",
        gap: 1,
        mt: 1,
        color: theme.palette.success.main,
        fontSize: tokens.helperFontSize,
        direction: language === "Ar" ? "rtl" : "ltr",
    }),
    passwordIcon: (theme: Theme) => ({
        color: theme.palette.primary.main,
    }),
    submitContainer: {
        mt: "auto",
        pt: 1,
    },

    submitButton: (theme: Theme) => ({
        width: "100%",
        minHeight: tokens.buttonMinHeight,
        borderRadius: tokens.buttonBorderRadius,
        py: 1,
        textTransform: "none",
        fontWeight: 600,
        color: "#FFFFFF",
        background: `linear-gradient(90deg, #953193 0%, ${theme.palette.primary.light} 100%)`,
        boxShadow: "none",

        "&:hover": {
            background: `linear-gradient(90deg, #953193 0%, ${theme.palette.primary.light} 100%)`,
            filter: "brightness(0.95)",
            boxShadow: "none",
        },

        "&.Mui-disabled": {
            background: "#A3A3A3",
            color: "#FAFAFA",
        },
    }),
};