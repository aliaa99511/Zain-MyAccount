
import { type Theme } from "@mui/material/styles";

export const complaintsStyles = {
    header: {
        display: "flex",
        alignItems: { xs: "stretch", sm: "center" },
        justifyContent: "space-between",
        flexDirection: { xs: "column", sm: "row" },
        gap: 2,
    },
    submitButton: (theme: Theme) => ({
        width: "100%",
        py: 1,
        background: `linear-gradient(90deg, #953193 0%, ${theme.palette.primary.light} 100%)`,
        "&:disabled, &.disabled": {
            background: "#A3A3A3",
            color: "#FAFAFA",
            "&.MuiButton-loading": {
                color: "transparent",
            },
        },
    }),

    ButtonBase: {
        borderColor: "#E0E0E0",
        borderRadius: "8px",
        whiteSpace: "nowrap",
        color: "black",
    },

    filterButton: {
        minWidth: 110,
        height: 42,
        padding: "0 12px",
        fontSize: "1rem",
        fontWeight: 500,
    },

    navigateButton: {
        minWidth: { xs: "100%", sm: 190 },
        height: 42,
        padding: "0 12px",
        fontSize: "18px",
    },

    inputSearch: {
        "& .MuiOutlinedInput-root": {
            height: 42,
            borderRadius: "8px",

            "& fieldset": {
                borderColor: "#E0E0E0",
            },

            "&:hover fieldset": {
                borderColor: "#E0E0E0",
            },

            "&.Mui-focused fieldset": {
                borderColor: "#E0E0E0",
            },

            "&.Mui-active fieldset": {
                borderColor: "#E0E0E0",
            },
        },

        "& input::placeholder": {
            color: "#B8B8B8",
            opacity: 1,
            fontSize: "14px",
        },

        "& .MuiInputAdornment-root .MuiSvgIcon-root": {
            color: "#B8B8B8",
        },
    },
    filters: {
        display: "grid",
        gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(4, 1fr)",
        },
        gap: 2,
        alignItems: "center",
    },

    tableContainer: {
        width: "100%",
        overflowX: "auto",
    },

    table: {
        minWidth: 1000,

        "& .MuiTableHead-root": {
            backgroundColor: "#EBEBEB",
        },

        "& .MuiTableCell-head": {
            fontWeight: 700,
            fontSize: "15px",
            color: "#333333",
            whiteSpace: "nowrap",
            padding: "16px",
        },

        "& .MuiTableCell-body": {
            color: "text.secondary",
            fontSize: "15px",
            padding: "16px",
        },

        "& .MuiTableRow-root": {
            height: 64,
        },
    },
    pagination: {
        "& .MuiPaginationItem-root": {
            borderRadius: "8px",
            minWidth: 36,
            height: 36,
            fontWeight: 500,
            color: "text.primary",
        },

        // Current page
        "& .MuiPaginationItem-root.Mui-selected": {
            backgroundColor: "primary.main",
            color: "#fff",
            fontWeight: 700,

            "&:hover": {
                backgroundColor: "primary.dark",
            },
        },

        // Previous and next buttons
        "& .MuiPaginationItem-previousNext": {
            border: "1px solid",
            borderColor: "primary.main",
            backgroundColor: "primary.main",
            color: "#fff",

            "&:hover": {
                backgroundColor: "primary.dark",
                borderColor: "primary.dark",
            },

            // Disabled when already on the first or last page
            "&.Mui-disabled": {
                backgroundColor: "action.disabledBackground",
                borderColor: "divider",
                color: "action.disabled",
            },
        },
    },
    complaintLink: () => ({
        color: "#0288D1",
        fontWeight: 600,
        textDecoration: "underline",

        "&:hover": {
            color: "#0277BD",
            textDecoration: "underline",
        },
    }),

    detailsPaper: {
        width: "100%",
        maxWidth: 850,
        mx: "auto",
        p: { xs: 2, sm: 3, md: 4 },
        borderRadius: 2,
    },

    detailsDescription: () => ({
        lineHeight: 1.8,
        whiteSpace: "pre-wrap",
        overflowWrap: "anywhere",
    }),

    detailsGrid: {
        display: "grid",
        gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
        },
        gap: 3,
    },

    detailLabel: {
        color: "text.secondary",
        mb: 0.5,
    },

    detailValue: {
        color: "text.primary",
        fontWeight: 600,
        overflowWrap: "anywhere",
    },
};
