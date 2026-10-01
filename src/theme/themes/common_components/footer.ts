export const footerTokens = {
    height: 44,
    horizontalPadding: {
        xs: "12px",
        sm: "25px",
        md: "25px 40px",
    },
    linkGap: {
        xs: "10px",
        sm: "22px",
    },
    colors: {
        border: "#dedede",
        text: "#333",
    },
};

export const footerStyles = {
    tokens: footerTokens,

    container: {
        height: `${footerTokens.height}px`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: footerTokens.horizontalPadding,
        borderTop: `1px solid ${footerTokens.colors.border}`,
    },

    linksContainer: {
        display: "flex",
        alignItems: "center",
        gap: footerTokens.linkGap,
    },

    link: {
        color: footerTokens.colors.text,
        textDecoration: "none",
        "&:hover": {
            textDecoration: "underline",
        },
    },

    separator: {
        color: footerTokens.colors.text,
    },

    version: {
        marginLeft: {
            xs: "auto",
            sm: 0,
        },
    },
};