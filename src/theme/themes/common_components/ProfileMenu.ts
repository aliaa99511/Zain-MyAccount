import { alpha, type Theme } from "@mui/material/styles";
import { sideMenuStyles } from "./menuItems";

const profileTokens = {
    width: "19rem",            // 304px
    borderRadius: "0.875rem",  // 14px
    padding: "0.625rem",       // 10px
    sectionPadding: "0.75rem 1rem", // 12px 16px
};

export const profileMenuStyles = {
    tokens: profileTokens,

    menu: (theme: Theme) => ({
        width: profileTokens.width,
        mt: 1.25,
        p: profileTokens.padding,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: profileTokens.borderRadius,
        boxShadow: `0 0.5rem 1.875rem ${alpha(theme.palette.common.black, 0.08)}`,
    }),

    avatar: (theme: Theme) => ({
        bgcolor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        flexShrink: 0,
        cursor: "pointer",
    }),

    trigger: {
        width: "2.5rem",
        height: "2.5rem",
        cursor: "pointer",
        flexShrink: 0,
    },

    header: (theme: Theme) => ({
        display: "flex",
        alignItems: "center",
        gap: 1,
        px: 2,
        py: 1.5,
        color: theme.palette.text.secondary,
    }),

    section: {
        px: 2,
        py: 1.5,
    },

    sectionTitle: (theme: Theme) => ({
        mb: 0.5,
        color: theme.palette.text.secondary,
    }),

    item: (theme: Theme) => ({
        ...sideMenuStyles.item(theme),
        minHeight: "2.75rem", // 44px
        justifyContent: "flex-start",
        px: 2,
    }),

    bottomSection: (theme: Theme) => ({
        borderTop: `1px solid ${theme.palette.divider}`,
        pt: 0.5,
    }),

    logout: (theme: Theme) => ({
        ...sideMenuStyles.logout(theme),
        minHeight: "2.75rem", // 44px
        px: 2,
    }),

    modeContainer: (theme: Theme) => ({
        width: "100%",
        height: "2.625rem", // 42px
        display: "flex",
        alignItems: "center",
        p: 0.5,
        border: `1px solid ${theme.palette.primary.main}`,
        borderRadius: "1.5rem", // 24px
    }),

    // Active/inactive colors depend on the selected state, so pass it in
    modeItem: (theme: Theme, active = false) => ({
        flex: 1,
        height: "2.125rem", // 34px
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "1.125rem", // 18px
        cursor: "pointer",
        transition: "all 0.2s ease",
        whiteSpace: "nowrap",
        minWidth: 0,
        color: active
            ? theme.palette.primary.contrastText
            : theme.palette.text.disabled,
        backgroundColor: active ? theme.palette.primary.main : "transparent",
    }),

    modeItemContent: {
        ...sideMenuStyles.common.itemContent,
        gap: 0.5,
    },

    modeIcon: {
        fontSize: "1.0625rem", // 17px
    },
};