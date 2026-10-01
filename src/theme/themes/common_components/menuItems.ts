import { LayoutIconsStyles } from "./LayoutIcons";

const menuTokens = {
    width: 212,
    itemHeight: 44,
    subItemHeight: 36,
    horizontalPadding: "17px",
    nestedIndent: "41px",
    iconLabelGap: "10px",

    colors: {
        background: "#fff",
        border: "#dedede",
        text: "#8a8a8a",
        hoverText: "#555",
        hoverBackground: "#fafafa",
        active: "#008fa3",
        activeText: "#fff",
        logout: "#BF0071",
        logoutHover: "#fff5fa",
        scrollbar: "#d0d0d0",
    },
};

/* ================= CONTAINER ================= */

const menuContainer = {
    width: menuTokens.width,
    minWidth: menuTokens.width,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    backgroundColor: menuTokens.colors.background,
    borderRight: `1px solid ${menuTokens.colors.border}`,
};

/* ================= SHARED ITEM ================= */

const menuItemBase = {
    display: "flex",
    alignItems: "center",
    gap: menuTokens.iconLabelGap,
    minHeight: menuTokens.itemHeight,
    px: menuTokens.horizontalPadding,
    color: menuTokens.colors.text,
    cursor: "pointer",
    textDecoration: "none",
    userSelect: "none",
    transition: "background-color 0.2s ease, color 0.2s ease",

    "&:hover": {
        color: menuTokens.colors.hoverText,
        backgroundColor: menuTokens.colors.hoverBackground,
    },
};

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

    container: menuContainer,

    // Keep the rest of your existing styles here.
    scrollArea: {
        flex: 1,
        minHeight: 0,
        overflowY: "auto",
        overflowX: "hidden",
        pt: "5px",
        "&::-webkit-scrollbar": {
            width: "5px",
        },
        "&::-webkit-scrollbar-thumb": {
            backgroundColor: menuTokens.colors.scrollbar,
            borderRadius: "10px",
        },
        "&::-webkit-scrollbar-track": {
            backgroundColor: "transparent",
        },
    },

    item: {
        ...menuItemBase,
        justifyContent: "space-between",
    },

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
        fontSize: 17,
        flexShrink: 0,
        transition: "transform 0.2s ease",
    },

    subMenuContainer: {
        py: "2px",
        pl: menuTokens.nestedIndent,
    },

    subItem: {
        ...menuItemBase,
        minHeight: menuTokens.subItemHeight,
        marginRight: "10px",
        px: "10px",
        borderRadius: "10px",
        "&:hover": {
            color: menuTokens.colors.active,
            backgroundColor: "transparent",
        },
        "&.active": {
            backgroundColor: menuTokens.colors.active,
            color: menuTokens.colors.activeText,
        },
    },

    bottomSection: {
        borderTop: `1px solid ${menuTokens.colors.border}`,
        flexShrink: 0,
    },

    preferences: {
        ...menuItemBase,
    },

    logout: {
        ...menuItemBase,
        color: menuTokens.colors.logout,
        "&:hover": {
            color: menuTokens.colors.logout,
            backgroundColor: menuTokens.colors.logoutHover,
        },
    },
};


