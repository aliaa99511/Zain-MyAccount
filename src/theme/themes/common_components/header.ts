import { alpha, type Theme } from "@mui/material/styles";

const headerTokens = {
    height: "4.375rem", // 70px
    horizontalPadding: "1rem", // 16px
    logoWidth: "5.625rem", // 90px
    logoHeight: "1.5rem", // 24px
    itemHeight: "2.875rem", // 46px
    languageHeight: "2.375rem", // 38px
    iconSize: "2.375rem", // 38px
    inviteIconSize: "1.375rem", // 22px
    iconLabelGap: 1,
};

export const headerStyles = {
    tokens: headerTokens,

    container: (theme: Theme) => ({
        width: "100%",
        height: headerTokens.height,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: headerTokens.horizontalPadding,
        color: theme.palette.primary.contrastText,
        background: `linear-gradient(
            90deg,
            ${theme.palette.primary.light ?? theme.palette.primary.main} 0%,
            ${theme.palette.secondary.main} 100%
        )`,
    }),

    logo: {
        width: headerTokens.logoWidth,
        height: headerTokens.logoHeight,
        objectFit: "contain",
        flexShrink: 0,
    },

    leftSection: {
        height: "100%",
        display: "flex",
        alignItems: "center",
        gap: {
            xs: 1,
            sm: 3,
            md: 6,
            lg: 13.75,
        },
        minWidth: 0,
    },

    rightSection: {
        display: "flex",
        alignItems: "center",
        gap: {
            xs: 0.5,
            sm: 1,
            md: 2,
        },
    },

    common: {
        content: {
            display: "flex",
            alignItems: "center",
            gap: headerTokens.iconLabelGap,
            minWidth: 0,
        },

        label: {
            whiteSpace: "nowrap",
        },

        icon: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
        },
    },

    dropdown: (theme: Theme) => ({
        height: headerTokens.itemHeight,
        display: "flex",
        alignItems: "center",
        gap: headerTokens.iconLabelGap,
        cursor: "pointer",
        color: theme.palette.primary.contrastText,
        whiteSpace: "nowrap",
    }),

    languageDropdown: (theme: Theme) => ({
        ...headerStyles.dropdown(theme),
        height: headerTokens.languageHeight,
    }),

    iconButton: (theme: Theme) => ({
        width: headerTokens.iconSize,
        height: headerTokens.iconSize,
        color: theme.palette.primary.contrastText,
        backgroundColor: alpha(theme.palette.primary.contrastText, 0.1),
        flexShrink: 0,
        "&:hover": {
            backgroundColor: alpha(
                theme.palette.primary.contrastText,
                0.18
            ),
        },
    }),

    inviteIcon: {
        width: headerTokens.inviteIconSize,
        height: headerTokens.inviteIconSize,
    },

    menu: {
        paper: (theme: Theme) => ({
            mt: 1,
            borderRadius: 2,
            boxShadow: `0 0.25rem 1rem ${alpha(
                theme.palette.common.black,
                0.15
            )}`,
        }),

        phone: {
            minWidth: "12.5rem",
        },

        language: {
            minWidth: "5.9375rem",
        },
    },
};

