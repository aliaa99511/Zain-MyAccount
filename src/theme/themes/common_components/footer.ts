import type { Theme } from "@mui/material/styles";

export const footerTokens = {
    height: "2.75rem", // 44px
    horizontalPadding: {
        xs: "0.75rem",          // 12px
        sm: "1.5625rem",        // 25px
        md: "1.5625rem 2.5rem", // 25px 40px
    },
    linkGap: {
        xs: "0.625rem", // 10px
        sm: "1.375rem", // 22px
    },
};

export const footerStyles = {
    tokens: footerTokens,

    container: (theme: Theme) => ({
        height: footerTokens.height,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: footerTokens.horizontalPadding,
        borderTop: `1px solid ${theme.palette.divider}`,
    }),

    linksContainer: {
        display: "flex",
        alignItems: "center",
        gap: footerTokens.linkGap,
    },

    link: (theme: Theme) => ({
        color: theme.palette.text.primary,
        textDecoration: "none",
        "&:hover": {
            textDecoration: "underline",
        },
    }),

    separator: (theme: Theme) => ({
        color: theme.palette.text.primary,
    }),

    version: {
        marginInlineStart: {
            xs: "auto",
            sm: 0,
        },
    },
};