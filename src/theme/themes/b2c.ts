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
    background: {
      default: "#f5f7fa",
      paper: "#ffffff",
    },
  },
  components: {
    ...commonComponents,
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({theme}) => ({
          borderRadius: '8px',
          fontSize: "1.125rem",
          "& .MuiInputBase-input": {
            paddingTop: theme.spacing(1.2),
            paddingBottom: theme.spacing(1.2),
          },
          "& .MuiOutlinedInput-notchedOutline": {
            border: "1px solid #A3A3A3",
          },
          "&.important .MuiOutlinedInput-notchedOutline": {
            border: "1px solid #525252",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            border: `1.8px solid ${theme.palette.primary.light}`,
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            border: `1.8px solid ${theme.palette.primary.light}`,
          },
          "& .MuiInputAdornment-root": {
            fontSize: "1rem",
            display: "flex",
            alginItems: "center"
          }
        })
      }
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          color: "#d32f2f",
        }
      }
    },
  }
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
