import { createTheme } from "@mui/material/styles";
import { commonTheme } from "./commonTheme";

export const b2cLightTheme = createTheme({
  ...commonTheme,
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
    },
    background: {
      default: "#f5f7fa",
      paper: "#ffffff",
    },
  },
});

export const b2cDarkTheme = createTheme({
  ...commonTheme,
  palette: {
    mode: "dark",
    primary: {
      main: "#90caf9",
    },
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
  },
});
