
import { alpha, type Theme } from "@mui/material/styles";

export const phoneDropdownStyles = {
    trigger: (theme: Theme) => ({
        ...{
            height: "2.875rem",
            minWidth: "13.75rem",
            px: 1.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: 1,
            color: theme.palette.primary.contrastText,
            border: `1px solid ${alpha(
                theme.palette.primary.contrastText,
                0.85
            )}`,
            borderRadius: "0.625rem",
            textTransform: "none",
            whiteSpace: "nowrap",
            flexShrink: 0,
        },
        "&:hover": {
            backgroundColor: alpha(
                theme.palette.primary.contrastText,
                0.1
            ),
        },
    }),

    triggerIcon: (theme: Theme) => ({
        width: "2rem",
        height: "2rem",
        borderRadius: "50%",
        backgroundColor: alpha(
            theme.palette.primary.contrastText,
            0.18
        ),
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
    }),

    triggerLabel: {
        flex: 1,
        whiteSpace: "nowrap",
    },

    popoverPaper: (theme: Theme) => ({
        mt: 1,
        width: "33.5rem",
        maxWidth: "calc(100vw - 2rem)",
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        boxShadow: `0 0.25rem 1rem ${alpha(
            theme.palette.common.black,
            0.15
        )}`,
        overflow: "hidden",
    }),

    content: {
        p: 2.25,
    },

    title: (theme: Theme) => ({
        color: theme.palette.text.primary,
        mb: 1.2,
    }),

    accountsList: {
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
    },

    account: (theme: Theme, isPrimary: boolean) => ({
        minHeight: "4.125rem",
        display: "flex",
        alignItems: "center",
        gap: 2,
        px: 1.5,
        border: "1px solid",
        borderColor: isPrimary
            ? theme.palette.primary.main
            : "transparent",
        borderRadius: "0.8125rem",
        cursor: "pointer",
        color: isPrimary
            ? theme.palette.text.primary
            : theme.palette.text.disabled,
        transition: "border-color 0.2s ease",
        "&:hover": {
            backgroundColor: alpha(
                theme.palette.primary.main,
                0.04
            ),
        },
    }),

    accountIcon: (theme: Theme, isPrimary: boolean) => ({
        width: "2.5rem",
        height: "2.5rem",
        borderRadius: "50%",
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: isPrimary
            ? alpha(theme.palette.primary.main, 0.16)
            : theme.palette.action.disabledBackground,
        color: isPrimary
            ? theme.palette.primary.main
            : theme.palette.action.disabled,
    }),

    accountLabel: {
        flex: 1,
        minWidth: 0,
    },

    primaryChip: (theme: Theme) => ({
        height: "1.6875rem",
        px: 0.5,
        borderRadius: "1rem",
        color: theme.palette.primary.dark,
        backgroundColor: alpha(
            theme.palette.primary.main,
            0.16
        ),
    }),

    removeButton: (theme: Theme) => ({
        ml: 0.25,
        color: theme.palette.error.main,
        "&:hover": {
            backgroundColor: alpha(
                theme.palette.error.main,
                0.08
            ),
        },
    }),

    divider: {
        mt: 1.5,
        mb: 0.5,
    },

    addAccountButton: (theme: Theme) => ({
        justifyContent: "flex-start",
        py: 1,
        px: 0.25,
        color: theme.palette.primary.main,
        fontWeight: 600,
        textTransform: "none",
        "& .MuiButton-startIcon": {
            mr: 1.5,
        },
    }),
};
