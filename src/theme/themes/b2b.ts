import { createTheme } from "@mui/material/styles";
import { commonComponents, commonTheme } from "./commonTheme";

export const b2bLightTheme = createTheme({
  // ...commonTheme,
  palette: {
    mode: "light",
    primary: {
      main: "#5C1E5B",
      light: "#3F123D",
    },
  },
  components: {
    ...commonComponents,
  }
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
