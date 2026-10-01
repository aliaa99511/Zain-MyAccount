import type { ButtonProps } from "@mui/material";

export const MuiButton = {
  styleOverrides: {
    root:{
      textTransform: "capitalize",
      fontSize: "1.125rem",
      fontWeight: 700
    },
  },
  variants: [
    {
      props: { color: "info", variant: "contained" } as Partial<ButtonProps>,
      style: {
        background: "linear-gradient(90deg, #FAFAFA 0%, #F5F5F5 100%)",
        border: "1px solid #E3E3E3",
        boxShadow: "1px 1px 4px 0px #18181814",
        color: "#181818",
        borderRadius: "8px",
      },
    }
  ]
}