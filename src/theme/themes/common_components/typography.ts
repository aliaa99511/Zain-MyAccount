import type { TypographyProps } from "@mui/material";

export const MuiTypography = {
  variants: [
    {
      props: { variant: "h1" } as Partial<TypographyProps>,
      style: {
        fontWeight: 700,
        fontSize: "2.125rem",
        lineHeight: "100%",
      },
    },
    {
      props: { variant: "h2" } as Partial<TypographyProps>,
      style: {
        fontWeight: 700,
        fontSize: "1.875rem",
        marginBottom: "8px",
        lineHeight: "100%",
      },
    },
    {
      props: { variant: "h3" } as Partial<TypographyProps>,
      style: {
        fontWeight: 700,
        fontSize: "1.375rem",
        marginBottom: "8px",
        lineHeight: "100%",
      },
    },
    {
      props: { variant: "h6" } as Partial<TypographyProps>,
      style: {
        fontWeight: 700,
        fontSize: "1.125rem",
        marginBottom: "8px",
        lineHeight: "100%",
      },
    },
    {
      props: { variant: "body1" } as Partial<TypographyProps>,
      style: {
        fontWeight: 400,
        fontSize: "1.125rem",
        display: "flex",
        alignItems: "center",
      },
    },
    {
      props: { variant: "body2" } as Partial<TypographyProps>,
      style: {
        fontWeight: 400,
        fontSize: "1rem",
        display: "flex",
        alignItems: "center",
      },
    },
    {
      props: { variant: "subtitle1" } as Partial<TypographyProps>,
      style: {
        fontWeight: 400,
        fontSize: "1rem",
        display: "flex",
        alignItems: "center",
      },
    },
    {
      props: { variant: "subtitle2" } as Partial<TypographyProps>,
      style: {
        fontWeight: 400,
        fontSize: "0.875rem",
        display: "flex",
        alignItems: "center",
      },
    },
  ]
}