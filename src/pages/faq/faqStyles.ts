
import { alpha, type Theme } from "@mui/material/styles";

const faqTokens = {
    categoryMinHeight: "1rem",
    categoryIconSize: "2.4rem",
    categoryBorderRadius: "0.75rem",

    accordionRadius: "0.5rem",
    accordionSpacing: "0.5rem",
    horizontalPadding: "0.75rem",

    arrowSize: "1.3rem",
    // arrowBackground: "#0153A5",
};

export const faqStyles = {
    tokens: faqTokens,

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
            ? theme.palette.primary.main
            : theme.palette.background.paper,
        transition: "all 0.2s ease",
        overflow: "hidden",
        padding: 0,
    }),

    categoryAction: {
        minHeight: faqTokens.categoryMinHeight,
        px: 2,
        py: 1.5,
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: 2,
    },

    categoryIcon: (theme: Theme, isSelected: boolean) => ({
        width: faqTokens.categoryIconSize,
        height: faqTokens.categoryIconSize,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: isSelected
            ? alpha("#FFFFFF", 0.2)
            : alpha(theme.palette.primary.main, 0.18),
        color: isSelected
            ? "#FFFFFF"
            : theme.palette.primary.main,
        // backgroundColor: alpha(theme.palette.primary.main, 0.3),
        // color: theme.palette.primary.main,
        flexShrink: 0,
        overflow: "hidden",
    }),

    categoryText: (theme: Theme, isSelected: boolean) => ({
        fontSize: "1rem",
        fontWeight: 500,
        // color: isSelected
        //     ? theme.palette.primary.main
        //     : theme.palette.text.primary,
        color: isSelected
            ? "#FFFFFF"
            : theme.palette.primary.main,
        textAlign: "start",
    }),

    /* SUBCATEGORY FILTERS */

    subcategoryFilters: {
        display: "flex",
        width: "100%",
        gap: 1,
        p: ".5rem",
        mt: 2,
        mb: 2,
        border: "1px solid",
        borderColor: "primary.main",
        borderRadius: "2rem",
        overflowX: "auto",
    },

    subcategoryButton: (theme: Theme, isSelected: boolean) => ({
        flex: "1 0 0",
        minWidth: "5rem",
        borderRadius: "1.2rem",
        px: 2,
        py: 1,
        textTransform: "none",
        whiteSpace: "nowrap",
        fontWeight: 500,
        color: isSelected
            ? "#FFFFFF"
            : theme.palette.text.secondary,
        backgroundColor: isSelected
            ? theme.palette.primary.main
            : "transparent",
        "&:hover": {
            backgroundColor: isSelected
                ? theme.palette.primary.dark
                : alpha(theme.palette.primary.main, 0.08),
        },
    }),

    /* ACCORDION */

    accordionContainer: {
        mt: 2,
    },

    accordion: (theme: Theme) => ({
        mb: faqTokens.accordionSpacing,
        px: 1,
        borderRadius: `${faqTokens.accordionRadius} !important`,
        backgroundColor: theme.palette.action.hover,
        p: .7,
        boxShadow: "none",
        "&:before": {
            display: "none",
        },
    }),

    accordionSummary: (theme: Theme, language: "En" | "Ar") => ({
        minHeight: "3rem",
        px: 1,

        direction: language === "Ar" ? "rtl" : "ltr",

        "& .MuiAccordionSummary-content": {
            my: 1,
            minWidth: 0,
            textAlign: language === "Ar" ? "right" : "left",
        },

        "& .MuiAccordionSummary-expandIconWrapper": {
            width: faqTokens.arrowSize,
            height: faqTokens.arrowSize,
            borderRadius: "5px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: theme.palette.primary.main,
            color: "#FFFFFF",
            flexShrink: 0,
            "& svg": {
                color: "#FFFFFF",
            },
        },
    }),

    question: (theme: Theme, language: "En" | "Ar") => ({
        color: theme.palette.primary.main,
        fontWeight: 500,
        textAlign: language === "Ar" ? "right" : "left",
        direction: language === "Ar" ? "rtl" : "ltr",
        width: "100%",
        lineHeight: 1.6,
    }),

    accordionDetails: {
        px: faqTokens.horizontalPadding,
        pt: 1, // Space above the answer
        pb: 2,
    },
    answer: (theme: Theme, language: "En" | "Ar") => ({
        color: theme.palette.text.secondary,
        lineHeight: 1.8,
        whiteSpace: "pre-line",
        textAlign: language === "Ar" ? "right" : "left",
        direction: language === "Ar" ? "rtl" : "ltr",
    }),
};





