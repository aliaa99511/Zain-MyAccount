import { alpha, type Theme } from "@mui/material/styles";
import { LayoutIconsStyles } from "./LayoutIcons";

// Sizes only – colors come from the theme
const menuTokens = {
    width: "13.25rem",            // 212px
    itemHeight: "2.75rem",        // 44px
    subItemHeight: "2.25rem",     // 36px
    horizontalPadding: "1.0625rem", // 17px
    nestedIndent: "2.5625rem",    // 41px
    iconLabelGap: "0.625rem",     // 10px
};

/* ================= SHARED ITEM ================= */

const menuItemBase = (theme: Theme) => ({
    display: "flex",
    alignItems: "center",
    gap: menuTokens.iconLabelGap,
    minHeight: menuTokens.itemHeight,
    px: menuTokens.horizontalPadding,
    color: theme.palette.text.secondary,
    cursor: "pointer",
    textDecoration: "none",
    userSelect: "none",
    transition: "background-color 0.2s ease, color 0.2s ease",

    "&:hover": {
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.action.hover,
    },
});

/* ================= MAIN MENU ================= */
export const sideMenuStyles = {
    tokens: menuTokens,

    common: {
        itemContent: {
            display: "flex",
            alignItems: "center",
            gap: menuTokens.iconLabelGap,
            minWidth: 0,
        },

        icon: {
            ...LayoutIconsStyles,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
        },

        label: {
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
        },
    },

    container: (theme: Theme) => ({
        width: menuTokens.width,
        minWidth: menuTokens.width,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: theme.palette.background.paper,
        borderRight: `1px solid ${theme.palette.divider}`,
    }),

    scrollArea: (theme: Theme) => ({
        flex: 1,
        minHeight: 0,
        overflowY: "auto",
        overflowX: "hidden",
        pt: "0.3125rem", // 5px
        "&::-webkit-scrollbar": {
            width: "0.3125rem", // 5px
        },
        "&::-webkit-scrollbar-thumb": {
            backgroundColor: theme.palette.grey[400],
            borderRadius: "0.625rem", // 10px
        },
        "&::-webkit-scrollbar-track": {
            backgroundColor: "transparent",
        },
    }),

    item: (theme: Theme) => ({
        ...menuItemBase(theme),
        justifyContent: "space-between",

        "&.active": {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
        },
    }),

    activeItem: (theme: Theme) => ({
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
    }),

    itemContent: {
        display: "flex",
        alignItems: "center",
        gap: menuTokens.iconLabelGap,
        minWidth: 0,
    },

    icon: {
        ...LayoutIconsStyles,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
    },

    label: {
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
    },

    arrow: {
        fontSize: "1.0625rem", // 17px
        flexShrink: 0,
        transition: "transform 0.2s ease",
    },

    subMenuContainer: {
        py: "0.125rem", // 2px
        paddingInlineStart: menuTokens.nestedIndent,
    },

    subItem: (theme: Theme) => ({
        ...menuItemBase(theme),
        minHeight: menuTokens.subItemHeight,
        marginInlineEnd: "0.625rem", // 10px
        px: "0.625rem",              // 10px
        borderRadius: "0.625rem",    // 10px
        "&:hover": {
            color: theme.palette.primary.main,
            backgroundColor: "transparent",
        },
        "&.active": {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
        },
    }),

    bottomSection: (theme: Theme) => ({
        borderTop: `1px solid ${theme.palette.divider}`,
        flexShrink: 0,
    }),

    preferences: (theme: Theme) => ({
        ...menuItemBase(theme),
    }),

    logout: (theme: Theme) => ({
        ...menuItemBase(theme),
        color: theme.palette.error.main,
        "&:hover": {
            color: theme.palette.error.main,
            backgroundColor: alpha(theme.palette.error.main, 0.08),
        },
    }),
};