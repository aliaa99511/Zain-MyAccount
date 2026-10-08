import { alpha, type Theme } from "@mui/material/styles";

// Sizes only – colors come from the theme
const faqTokens = {
    categoryMinHeight: "1rem",
    categoryIconSize: "2.4rem",
    categoryBorderRadius: "0.75rem",

    accordionRadius: "0.5rem",
    accordionSpacing: "0.75rem",
    accordionMinHeight: "1rem",
    horizontalPadding: "0.5rem",
};

export const faqStyles = {
    tokens: faqTokens,

    /* ================= CATEGORY ================= */

    categoriesContainer: {
        display: "grid",
        gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
        },
        gap: 2,
    },

    categoryCard: (theme: Theme, isSelected: boolean) => ({
        borderRadius: faqTokens.categoryBorderRadius,
        border: "1px solid",
        borderColor: isSelected
            ? theme.palette.primary.main
            : theme.palette.divider,
        backgroundColor: isSelected
            ? theme.palette.action.selected
            : theme.palette.background.paper,
        transition: "all 0.2s ease",
        padding: 0,
    }),

    categoryAction: {
        minHeight: faqTokens.categoryMinHeight,
        px: 2,
        py: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: 2,
    },

    categoryIcon: (theme: Theme) => ({
        width: faqTokens.categoryIconSize,
        height: faqTokens.categoryIconSize,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: alpha(theme.palette.primary.main, 0.3),
        color: theme.palette.primary.main,
        flexShrink: 0,
    }),

    categoryText: (theme: Theme, isSelected: boolean) => ({
        fontSize: "1rem",
        fontWeight: 500,
        color: isSelected
            ? theme.palette.primary.main
            : theme.palette.text.primary,
    }),

    /* ================= ACCORDION ================= */

    accordionContainer: {
        mt: 3,
    },

    accordion: (theme: Theme) => ({
        // backgroundColor: "green",
        padding: "0.3rem .5rem",
        mb: faqTokens.accordionSpacing,
        borderRadius: `${faqTokens.accordionRadius} !important`,
        // backgroundColor: theme.palette.background.paper,
        "&:before": {
            display: "none",
        },
    }),

    accordionSummary: (theme: Theme) => ({
        "& .MuiAccordionSummary-content": {
            // margin: "1rem 0",
        },

        "& .MuiAccordionSummary-expandIconWrapper": {
            width: "1.5rem",
            height: "1.5rem",
            borderRadius: "7px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: theme.palette.primary.main,
            color: "#FFFFFF",
            flexShrink: 0,
            transition: "transform 0.2s ease",

            "& svg": {
                color: "#FFFFFF",
            },
        },
    }),
    question: (theme: Theme, language: "En" | "Ar") => ({
        color: theme.palette.primary.main,
        fontWeight: 500,
        textAlign:
            language === "Ar"
                ? "right"
                : "left",
        width: "100%",
    }),

    accordionDetails: {
        px: faqTokens.horizontalPadding,
        pb: 2.5,
    },

    answer: (theme: Theme, language: "En" | "Ar") => ({
        color: theme.palette.text.secondary,
        lineHeight: 1.8,
        whiteSpace: "pre-line",
        textAlign:
            language === "Ar"
                ? "right"
                : "left",
        direction:
            language === "Ar"
                ? "rtl"
                : "ltr",
    }),
};