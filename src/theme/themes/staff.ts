import { createTheme } from "@mui/material/styles";
import { commonTheme } from "./commonTheme";

export const staffLightTheme = createTheme({
  ...commonTheme,
  palette: {
    mode: "light",
    primary: {
      main: "#00897b",
    },
  },
});

export const staffDarkTheme = createTheme({
  ...commonTheme,
  palette: {
    mode: "dark",
    primary: {
      main: "#80cbc4",
    },
  },
});
