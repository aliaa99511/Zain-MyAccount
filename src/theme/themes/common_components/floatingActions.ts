import { alpha, type Theme } from "@mui/material/styles";

export const floatingActionsTokens = {
    position: {
        right: "2.375rem",  // 38px
        bottom: "3.375rem", // 54px
        zIndex: 1000,
    },

    actionSize: "3.3125rem", // 53px
    gap: "0.625rem",         // 10px

    responsive: {
        mobileRight: "0.9375rem", // 15px
        breakpoint: "43.75rem",   // 700px
    },
};

const liveChatGradient = (theme: Theme) =>
    `linear-gradient(180deg, ${theme.palette.primary.light ?? theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`;

const chatbotGradient = (theme: Theme) =>
    `linear-gradient(180deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`;

export const floatingActionsStyles = {
    tokens: floatingActionsTokens,

    container: {
        position: "fixed",
        right: floatingActionsTokens.position.right,
        bottom: floatingActionsTokens.position.bottom,
        zIndex: floatingActionsTokens.position.zIndex,

        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: floatingActionsTokens.gap,

        [`@media (max-width: ${floatingActionsTokens.responsive.breakpoint})`]: {
            right: floatingActionsTokens.responsive.mobileRight,
        },
    },

    actionButton: (theme: Theme) => ({
        width: floatingActionsTokens.actionSize,
        height: floatingActionsTokens.actionSize,
        borderRadius: "50%",
        boxShadow: `0 0.1875rem 0.625rem ${alpha(theme.palette.common.black, 0.12)}`,
    }),

    liveChatButton: (theme: Theme) => ({
        background: liveChatGradient(theme),
        color: theme.palette.primary.contrastText,

        "&:hover": {
            background: liveChatGradient(theme),
        },
    }),

    chatbotButton: (theme: Theme) => ({
        background: chatbotGradient(theme),
        border: `1px solid ${theme.palette.divider}`,

        "&:hover": {
            background: theme.palette.background.paper,
        },
    }),

    chatbotImage: {
        width: "3.75rem", // 60px
        height: "2.5rem", // 40px
        objectFit: "contain",
    },
};