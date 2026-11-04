import type { Components, Theme } from "@mui/material/styles";

export const MuiChip: Components<Theme>["MuiChip"] = {
    variants: [
        {
            props: {
                color: "success",
                variant: "filled",
            },
            style: {
                backgroundColor: "#CAE8CB",
                color: "#1B5E20",
                "&:hover": {
                    backgroundColor: "#CAE8CB",
                },
            },
        },
        {
            props: {
                color: "warning",
                variant: "filled",
            },
            style: {
                backgroundColor: "#FFDA94",
                color: "#BF7C00",
            },
        },
    ],
    styleOverrides: {
        root: {
            fontWeight: 500,
            borderRadius: 12,
        },
    },
};