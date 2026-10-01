import createCache from '@emotion/cache';
import rtlPlugin from '@mui/stylis-plugin-rtl';

export const rtlCache = createCache({
  key: 'muirtl',
  stylisPlugins: [rtlPlugin],
});