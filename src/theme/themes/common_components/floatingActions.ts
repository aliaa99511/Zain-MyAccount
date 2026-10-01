export const floatingActionsTokens = {
    position: {
        right: "38px",
        bottom: "54px",
        zIndex: 1000,
    },

    actionSize: 53,
    gap: "10px",

    colors: {
        liveChatGradient:
            "linear-gradient(180deg, #00B3C7 0%, #953193 100%)",
        chatbotGradient:
            "linear-gradient(180deg, #FAFAFA 0%, #F5F5F5 100%)",
        chatbotHover: "#ffffff",
        border: "#dedede",
        shadow: "0 3px 10px rgba(0, 0, 0, 0.12)",
    },

    responsive: {
        mobileRight: "15px",
        breakpoint: 700,
    },
};

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

        [`@media (max-width: ${floatingActionsTokens.responsive.breakpoint}px)`]: {
            right: floatingActionsTokens.responsive.mobileRight,
        },
    },

    actionButton: {
        width: `${floatingActionsTokens.actionSize}px`,
        height: `${floatingActionsTokens.actionSize}px`,
        borderRadius: "50%",
        boxShadow: floatingActionsTokens.colors.shadow,
    },

    liveChatButton: {
        background: floatingActionsTokens.colors.liveChatGradient,

        "&:hover": {
            background: floatingActionsTokens.colors.liveChatGradient,
        },
    },

    chatbotButton: {
        background: floatingActionsTokens.colors.chatbotGradient,
        border: `1px solid ${floatingActionsTokens.colors.border}`,

        "&:hover": {
            background: floatingActionsTokens.colors.chatbotHover,
        },
    },

    chatbotImage: {
        width: "60px",
        height: "40px",
        objectFit: "contain",
    },
};