import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ThemeProvider } from 'styled-components';
import defaultTheme from '../theme/defaultTheme';
import darkTheme    from '../theme/darkTheme';
import warmTheme    from '../theme/warmTheme';
import { idbGet, idbSet, IDB_KEYS } from '../utils/indexedDB';

const THEMES = { default: defaultTheme, dark: darkTheme, warm: warmTheme };

const ThemeContext = createContext({
  themeName:  'default',
  setTheme:   () => {},
  toggleDark: () => {},
  isDark:     false,
});

export const useTheme = () => useContext(ThemeContext);

export const AppThemeProvider = ({ children, tenantConfig }) => {
  const [themeName, setThemeNameState] = useState('default');

  // Load saved theme from IndexedDB on mount
  useEffect(() => {
    idbGet(IDB_KEYS.THEME).then((saved) => {
      if (saved?.themeName && THEMES[saved.themeName]) {
        setThemeNameState(saved.themeName);
      }
    });
  }, []);

  const setTheme = useCallback(async (name) => {
    if (!THEMES[name]) return;
    setThemeNameState(name);
    await idbSet(IDB_KEYS.THEME, { themeName: name });
  }, []);

  const toggleDark = useCallback(() => {
    setTheme(themeName === 'dark' ? 'default' : 'dark');
  }, [themeName, setTheme]);

  // Build final theme — merge tenant color overrides on top
  const baseTheme  = THEMES[themeName] || defaultTheme;
  const finalTheme = tenantConfig?.primary_color
    ? {
        ...baseTheme,
        colors: {
          ...baseTheme.colors,
          primary:      tenantConfig.primary_color,
          primaryDark:  tenantConfig.primary_color_dark  || baseTheme.colors.primaryDark,
          primaryLight: tenantConfig.primary_color_light || baseTheme.colors.primaryLight,
        },
        branding: {
          name:    tenantConfig.name    || 'HealthCare',
          logo:    tenantConfig.logo    || null,
          tagline: tenantConfig.tagline || 'Empowering Healthcare',
        },
      }
    : {
        ...baseTheme,
        branding: {
          name:    tenantConfig?.name    || 'HealthCare',
          logo:    null,
          tagline: 'Empowering Healthcare',
        },
      };

  return (
    <ThemeContext.Provider value={{
      themeName,
      setTheme,
      toggleDark,
      isDark: themeName === 'dark',
    }}>
      <ThemeProvider theme={finalTheme}>
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
