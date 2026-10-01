import { headerDropdownStyles } from "./common_components/header_dropdown";
import { MuiButton } from "./common_components/button";
import { MuiIconButton } from "./common_components/icon_button";
import { MuiInputLabel } from "./common_components/input_label";
import { MuiPaper } from "./common_components/paper";
import { MuiSvgIcon } from "./common_components/svg_icon";
import { MuiTypography } from "./common_components/typography";
import { zainFontFaces } from "./fonts";

export const commonTheme = {
  typography: {
    fontFamily: '"Zain", Arial, sans-serif',
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 700,
    fontWeightBold: 800,
  },
};
export const commonComponents = {
  MuiCssBaseline: {
    styleOverrides: zainFontFaces,
  },
  MuiPaper,
  MuiTypography,
  MuiSvgIcon,
  headerDropdownStyles,
  MuiIconButton,
  MuiInputLabel,
  MuiButton
}