import { createTheme } from "@mui/material/styles";
import { commonComponents, commonTheme } from "./commonTheme";

export const b2cLightTheme = createTheme({
  ...commonTheme,

  palette: {
    mode: "light",

    primary: {
      main: "#008A99",
      light: "#00B3C7",
    },
    error: {
      main: "#BF0071",
      light: "#BF00710A",
    },
    success: {
      main: "#119443",
      light: "#1194430A",
    },
    warning: {
      main: "#BF7C00",
      light: "#FFDA94",
    },
    background: {
      default: "#f5f7fa",
      paper: "#ffffff",
    },
    text: {
      primary: "#181818",
      secondary: "#525252",
    }
  },

  components: {
    ...commonComponents,
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
  components: {
    ...commonComponents,
  }
});
