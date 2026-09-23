import { createTheme } from "@mui/material/styles";
import { commonTheme } from "./commonTheme";

export const b2bLightTheme = createTheme({
  ...commonTheme,
  palette: {
    mode: "light",
    primary: {
      main: "#7b1fa2",
    },
  },
});

export const b2bDarkTheme = createTheme({
  ...commonTheme,
  palette: {
    mode: "dark",
    primary: {
      main: "#ce93d8",
    },
  },
});
