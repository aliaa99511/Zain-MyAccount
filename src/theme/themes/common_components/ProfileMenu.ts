import { sideMenuStyles } from "./menuItems";

export const profileMenuStyles = {
    tokens: {
        width: 304,
        borderRadius: "14px",
        padding: "10px",
        sectionPadding: "12px 16px",
        colors: {
            border: "#dedede",
            text: "#666",
            active: "#008A99",
            inactive: "#999",
            logout: "#BF0071",
            logoutHover: "#fff5fa",
        },
    },

    menu: {
        width: 304,
        mt: 1.25,
        p: "10px",
        border: "1px solid #dedede",
        borderRadius: "14px",
        boxShadow: "0 8px 30px rgba(0, 0, 0, 0.08)",
    },

    avatar: {
        bgcolor: "#008A99",
        flexShrink: 0,
    },

    trigger: {
        ...sideMenuStyles.icon,
        width: 40,
        height: 40,
        cursor: "pointer",
    },

    header: {
        display: "flex",
        alignItems: "center",
        gap: 1,
        px: 2,
        py: 1.5,
        color: "#666",
    },

    section: {
        px: 2,
        py: 1.5,
    },

    sectionTitle: {
        mb: 0.5,
        color: "#666",
    },

    item: {
        ...sideMenuStyles.item,
        minHeight: 44,
        justifyContent: "flex-start",
        px: 2,
    },

    bottomSection: {
        borderTop: `1px solid #dedede`,
        pt: 0.5,
    },

    logout: {
        ...sideMenuStyles.logout,
        minHeight: 44,
        px: 2,
    },

    modeContainer: {
        width: "100%",
        height: 42,
        display: "flex",
        alignItems: "center",
        p: 0.5,
        border: "1px solid #008A99",
        borderRadius: "24px",
    },

    modeItem: {
        flex: 1,
        height: 34,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "18px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        whiteSpace: "nowrap",
        minWidth: 0,
    },

    modeItemContent: {
        ...sideMenuStyles.common.itemContent,
        gap: 0.5,
    },

    modeIcon: {
        fontSize: 17,
    },
};