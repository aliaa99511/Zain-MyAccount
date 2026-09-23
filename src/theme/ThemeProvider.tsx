import { ThemeProvider as MuiThemeProvider, CssBaseline } from "@mui/material";

import { useMemo, useState } from "react";

// import { useAuth } from "../auth/useAuth";
import { getTheme } from "./theme.config";
import { USER_ROLES } from "../helpers/constants";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // const { user } = useAuth();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const user = { role: USER_ROLES.B2B };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [appearance, setAppearance] = useState<"light" | "dark">("light");

  const theme = useMemo(() => {
    if (!user) {
      return getTheme(USER_ROLES.STAFF, appearance);
    }
    return getTheme(user.role, appearance);
  }, [user, appearance]);

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}
