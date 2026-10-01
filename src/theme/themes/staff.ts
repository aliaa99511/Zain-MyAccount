import { createTheme } from "@mui/material/styles";
import { commonComponents, commonTheme } from "./commonTheme";

export const staffLightTheme = createTheme({
  ...commonTheme,
  palette: {
    mode: "light",
    primary: {
      main: "#00897b",
    },
  },
  components: {
    ...commonComponents,
  }
});

export const staffDarkTheme = createTheme({
  ...commonTheme,
  palette: {
    mode: "dark",
    primary: {
      main: "#80cbc4",
    },
  },
  components: {
    ...commonComponents,
  }
});
