
import { type Theme } from "@mui/material/styles";

const securityQuestionsTokens = {
    // Layout
    sectionSpacing: 2,
    questionSpacing: 2.5,

    // Labels
    labelFontSize: "0.875rem",
    labelFontWeight: 400,
    labelSpacing: 0.75,

    // Select
    selectBorderRadius: "0.5rem",
    selectMinHeight: "3rem",
    selectHorizontalPadding: "0.875rem",
    selectBorderWidth: "1px",

    // Answer
    answerBorderRadius: "0.5rem",
    answerMinHeight: "3rem",
    answerHorizontalPadding: "0.875rem",
    answerMaxLength: 32,

    // Validation
    helperFontSize: "0.6875rem",
    helperSpacing: 0.5,
};

export const securityQuestionsStyles = {
    tokens: securityQuestionsTokens,

    /* SECTION */
    container: {
        flexGrow: 1,
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        paddingInlineEnd: "12px",
    },

    header: {
        mb: 2,
    },

    title: (theme: Theme) => ({
        color: theme.palette.text.primary,
        fontWeight: 600,
        mb: 0.5,
    }),

    description: (theme: Theme, language: "En" | "Ar") => ({
        color: theme.palette.text.secondary,
        textAlign: language === "Ar" ? "right" : "left",
        direction: language === "Ar" ? "rtl" : "ltr",
        lineHeight: 1.6,
    }),

    /* QUESTIONS */
    form: {
        flexGrow: 1,
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        gap: securityQuestionsTokens.questionSpacing,
    },

    questionsContainer: {
        display: "flex",
        flexDirection: "column",
        gap: securityQuestionsTokens.questionSpacing,
    },

    questionContainer: {
        display: "flex",
        flexDirection: "column",
        gap: 1,
        minWidth: 0,
    },

    questionLabel: (theme: Theme, language: "En" | "Ar") => ({
        display: "block",
        color: theme.palette.text.primary,
        fontSize: securityQuestionsTokens.labelFontSize,
        fontWeight: securityQuestionsTokens.labelFontWeight,
        textAlign: language === "Ar" ? "right" : "left",
        direction: language === "Ar" ? "rtl" : "ltr",
        mb: -.5
    }),

    CaptchaButton: {
        mb: 1,
        color: "#0288D1",
        textDecoration: "underline",
        textUnderlineOffset: "3px",
        textTransform: "none",
        minWidth: "auto",
        padding: 0,
        "&:hover": {
            backgroundColor: "transparent",
            textDecoration: "underline",
        },
    },
    /* QUESTION SELECT */
    selectControl: {
        width: "100%",
        minWidth: 0,

        "& .MuiOutlinedInput-root": {
            minHeight: securityQuestionsTokens.selectMinHeight,
            borderRadius: securityQuestionsTokens.selectBorderRadius,
            backgroundColor: "transparent",

            "& fieldset": {
                borderWidth: securityQuestionsTokens.selectBorderWidth,
            },

            "&:hover fieldset": {
                borderColor: "text.primary",
            },

            "&.Mui-focused fieldset": {
                borderWidth: "1.5px",
            },
        },

        "& .MuiSelect-select": {
            display: "flex",
            alignItems: "center",
            minHeight: "unset",
            py: 1.25,
            px: securityQuestionsTokens.selectHorizontalPadding,
            whiteSpace: "normal",
        },
    },

    selectMenuItem: {
        whiteSpace: "normal",
        py: 1.25,
    },

    /* ANSWER */
    answerControl: {
        width: "100%",

        "& .MuiOutlinedInput-root": {
            minHeight: securityQuestionsTokens.answerMinHeight,
            borderRadius: securityQuestionsTokens.answerBorderRadius,
            backgroundColor: "transparent",

            "& fieldset": {
                borderWidth: securityQuestionsTokens.selectBorderWidth,
            },

            "&:hover fieldset": {
                borderColor: "text.primary",
            },

            "&.Mui-focused fieldset": {
                borderWidth: "1.5px",
            },

            "&.Mui-error fieldset": {
                borderColor: "error.main",
            },
        },

        "& .MuiOutlinedInput-input": {
            px: securityQuestionsTokens.answerHorizontalPadding,
            py: 1.25,
            minWidth: 0,
        },
    },

    answerCounter: (theme: Theme) => ({
        display: "flex",
        alignItems: "center",
        whiteSpace: "nowrap",
        fontSize: "0.875rem",
        color: theme.palette.text.secondary,
        gap: 0.25,
    }),

    answerCounterValue: (theme: Theme) => ({
        color: theme.palette.primary.main,
        fontWeight: 500,
    }),

    /* VALIDATION & HELPER TEXT */
    helperText: {
        mx: 0,
        mt: securityQuestionsTokens.helperSpacing,
        fontSize: securityQuestionsTokens.helperFontSize,
        lineHeight: 1.5,
    },

    warningMessage: (theme: Theme, language: "En" | "Ar") => ({
        display: "flex",
        alignItems: "flex-start",
        gap: 0.5,
        color: theme.palette.warning.main,
        fontSize: securityQuestionsTokens.helperFontSize,
        lineHeight: 1.5,
        textAlign: language === "Ar" ? "right" : "left",
        direction: language === "Ar" ? "rtl" : "ltr",

        "& .MuiSvgIcon-root": {
            fontSize: "0.875rem",
            flexShrink: 0,
            mt: "1px",
        },
    }),

    /* SUBMIT BUTTON */
    submitContainer: {
        mt: "auto",
        pt: 1,
    },

    submitButton: (theme: Theme) => ({
        width: "100%",
        py: 1,
        mt: 1.5,
        backgroundColor: `linear-gradient(90deg, #953193 0%, ${theme.palette.primary.light} 100%)`,
        // background: securityQuestionsTokens.buttonGradient,
        "&:disabled, &.disabled": {
            background: "#A3A3A3",
            color: "#FAFAFA",
            "&.MuiButton-loading": {
                color: "transparent",
            }
        }
    }),
};
