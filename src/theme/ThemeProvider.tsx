import { ThemeProvider as MuiThemeProvider, CssBaseline } from "@mui/material";

import { useEffect, useMemo, useState } from "react";

// import { useAuth } from "../auth/useAuth";
import { getTheme } from "./theme.config";
import { USER_ROLES } from "../helpers/constants";
import { CacheProvider } from "@emotion/react";
import createCache from '@emotion/cache';
import { rtlCache } from "./rtlCache";

export function ThemeProvider({ direction, children }: { direction: 'ltr' | 'rtl', children: React.ReactNode }) {
  // const { user } = useAuth();

  const user = { role: USER_ROLES.B2C };


  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [appearance, setAppearance] = useState<"light" | "dark">("light");

  const theme = useMemo(() => {
    if (!user) {
      return getTheme(
        USER_ROLES.STAFF,
        appearance,
        direction
      );
    }

    return getTheme(
      user.role,
      appearance,
      direction
    );
  }, [user, appearance, direction]);

  const ltrCache = useMemo(
    () =>
      createCache({
        key: 'muiltr',
      }),
    [],
  );

  useEffect(() => {
    document.documentElement.dir =
      direction;

    document.documentElement.lang =
      direction === 'rtl'
        ? 'ar'
        : 'en';
  }, [direction]);

  const cache =
    direction === 'rtl'
      ? rtlCache
      : ltrCache;

  return (
    <CacheProvider value={cache}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </CacheProvider>
  );
}
