import { createTheme } from "@mui/material/styles";
import { commonComponents, commonTheme } from "./commonTheme";

export const b2bLightTheme = createTheme({
  ...commonTheme,

  palette: {
    mode: "light",

    primary: {
      main: "#5C1E5B",
      light: "#3F123D",
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
    text: {
      primary: "#181818",
      secondary: "#525252",
    }
  },

  components: {
    ...commonComponents,
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
  components: {
    ...commonComponents,
  }
});
