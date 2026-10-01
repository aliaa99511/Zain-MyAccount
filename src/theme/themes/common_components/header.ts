
const headerTokens = {
    height: 70,
    horizontalPadding: 16,
    itemHeight: 46,
    iconSize: 38,
    iconLabelGap: 1,

    colors: {
        text: "#fff",
        background: "#fff",
        border: "#dedede",
        iconBackground: "rgba(255, 255, 255, 0.1)",
        shadow: "0 4px 16px rgba(0,0,0,0.15)",
    },

    gradient: "linear-gradient(90deg, #00B3C7 0%, #953193 100%)",
};

export const headerStyles = {
    tokens: headerTokens,

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

    container: {
        width: "100%",
        height: headerTokens.height,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: `${headerTokens.horizontalPadding}px`,
        color: headerTokens.colors.text,
        background: headerTokens.gradient,
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

    dropdown: {
        height: headerTokens.itemHeight,
        display: "flex",
        alignItems: "center",
        gap: headerTokens.iconLabelGap,
        cursor: "pointer",
        color: headerTokens.colors.text,
        whiteSpace: "nowrap",
    },

    iconButton: {
        width: headerTokens.iconSize,
        height: headerTokens.iconSize,
        color: headerTokens.colors.text,
        backgroundColor: headerTokens.colors.iconBackground,
        flexShrink: 0,
    },

    menu: {
        paper: {
            mt: 1,
            borderRadius: 2,
            boxShadow: headerTokens.colors.shadow,
        },

        phone: {
            minWidth: 200,
        },

        language: {
            minWidth: 95,
        },
    },
};
