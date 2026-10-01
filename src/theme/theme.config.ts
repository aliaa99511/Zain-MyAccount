import { USER_ROLES } from "../helpers/constants";
import { b2bLightTheme, b2bDarkTheme } from "./themes/b2b";
import { b2cLightTheme, b2cDarkTheme } from "./themes/b2c";
import { staffLightTheme, staffDarkTheme } from "./themes/staff";

export type Appearance = "light" | "dark";
export type Direction = 'ltr' | 'rtl';

export function getTheme(role: string, appearance: Appearance, direction: Direction) {
  b2bDarkTheme.direction = direction;
  b2bLightTheme.direction = direction;
  b2cDarkTheme.direction = direction;
  b2cLightTheme.direction = direction;
  staffDarkTheme.direction = direction;
  staffLightTheme.direction = direction;

  if (role === USER_ROLES.B2B) {
    return appearance === "dark" ? b2bDarkTheme : b2bLightTheme;
  }
  if (role === USER_ROLES.B2C) {
    return appearance === "dark" ? b2cDarkTheme : b2cLightTheme;
  }
  return appearance === "dark" ? staffDarkTheme : staffLightTheme;
}
