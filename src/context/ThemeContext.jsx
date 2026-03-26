// // import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
// // import { ThemeProvider } from 'styled-components';
// // import defaultTheme from '../theme/defaultTheme';
// // import darkTheme    from '../theme/darkTheme';
// // import warmTheme    from '../theme/warmTheme';
// // import { idbGet, idbSet, IDB_KEYS } from '../utils/indexedDB';

// // const THEMES = { default: defaultTheme, dark: darkTheme, warm: warmTheme };

// // const ThemeContext = createContext({
// //   themeName:  'default',
// //   setTheme:   () => {},
// //   toggleDark: () => {},
// //   isDark:     false,
// // });

// // export const useTheme = () => useContext(ThemeContext);

// // export const AppThemeProvider = ({ children, tenantConfig }) => {
// //   const [themeName, setThemeNameState] = useState('default');

// //   // Load saved theme from IndexedDB on mount
// //   useEffect(() => {
// //     idbGet(IDB_KEYS.THEME).then((saved) => {
// //       if (saved?.themeName && THEMES[saved.themeName]) {
// //         setThemeNameState(saved.themeName);
// //       }
// //     });
// //   }, []);

// //   const setTheme = useCallback(async (name) => {
// //     if (!THEMES[name]) return;
// //     setThemeNameState(name);
// //     await idbSet(IDB_KEYS.THEME, { themeName: name });
// //   }, []);

// //   const toggleDark = useCallback(() => {
// //     setTheme(themeName === 'dark' ? 'default' : 'dark');
// //   }, [themeName, setTheme]);

// //   // Build final theme — merge tenant color overrides on top
// //   const baseTheme  = THEMES[themeName] || defaultTheme;
// //   const finalTheme = tenantConfig?.primary_color
// //     ? {
// //         ...baseTheme,
// //         colors: {
// //           ...baseTheme.colors,
// //           primary:      tenantConfig.primary_color,
// //           primaryDark:  tenantConfig.primary_color_dark  || baseTheme.colors.primaryDark,
// //           primaryLight: tenantConfig.primary_color_light || baseTheme.colors.primaryLight,
// //         },
// //         branding: {
// //           name:    tenantConfig.name    || 'HealthCare',
// //           logo:    tenantConfig.logo    || null,
// //           tagline: tenantConfig.tagline || 'Empowering Healthcare',
// //         },
// //       }
// //     : {
// //         ...baseTheme,
// //         branding: {
// //           name:    tenantConfig?.name    || 'HealthCare',
// //           logo:    null,
// //           tagline: 'Empowering Healthcare',
// //         },
// //       };

// //   return (
// //     <ThemeContext.Provider value={{
// //       themeName,
// //       setTheme,
// //       toggleDark,
// //       isDark: themeName === 'dark',
// //     }}>
// //       <ThemeProvider theme={finalTheme}>
// //         {children}
// //       </ThemeProvider>
// //     </ThemeContext.Provider>
// //   );
// // };

// // export default ThemeContext;

// import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
// import { ThemeProvider } from 'styled-components';
// import { ConfigProvider, theme as antTheme } from 'antd';
// import defaultTheme from '../theme/defaultTheme';
// import darkTheme    from '../theme/darkTheme';
// import warmTheme    from '../theme/warmTheme';
// import { idbGet, idbSet, IDB_KEYS } from '../utils/indexedDB';

// const THEMES = { default: defaultTheme, dark: darkTheme, warm: warmTheme };

// const ThemeContext = createContext({
//   themeName:  'default',
//   setTheme:   () => {},
//   toggleDark: () => {},
//   isDark:     false,
// });

// export const useTheme = () => useContext(ThemeContext);

// // ─── Build Ant Design ConfigProvider token from our theme ─────────────────────
// const buildAntToken = (appTheme) => {
//   const c = appTheme.colors;
//   const isDark = appTheme.name === 'dark';

//   return {
//     algorithm: isDark ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
//     token: {
//       // Brand colours
//       colorPrimary:        c.primary,
//       colorPrimaryHover:   c.primaryDark,
//       colorPrimaryActive:  c.primaryDark,

//       // Backgrounds
//       colorBgBase:         isDark ? '#0D1117' : '#FFFFFF',
//       colorBgContainer:    c.bgInput  || c.bgCard,   // input / card background
//       colorBgElevated:     c.bgCard,                 // modal, dropdown background
//       colorBgLayout:       c.bgBase,                 // page background

//       // Text
//       colorText:           c.textPrimary,
//       colorTextSecondary:  c.textSecondary,
//       colorTextTertiary:   c.textMuted,
//       colorTextPlaceholder:c.textMuted,
//       colorTextDisabled:   c.textMuted,

//       // Border
//       colorBorder:         c.border,
//       colorBorderSecondary:c.border,

//       // Fill (used for table header, input hover bg)
//       colorFill:           isDark ? '#21262D' : '#F1F5F9',
//       colorFillSecondary:  isDark ? '#161B22' : '#FFFFFF',
//       colorFillTertiary:   isDark ? '#0D1117' : '#F8FAFC',
//       colorFillQuaternary: isDark ? '#010409' : '#F1F5F9',

//       // Status
//       colorSuccess:        c.success,
//       colorWarning:        c.warning,
//       colorError:          c.danger,
//       colorInfo:           c.primary,

//       // Border radius
//       borderRadius:        6,
//       borderRadiusLG:      10,
//       borderRadiusSM:      4,

//       // Font
//       fontFamily:          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
//       fontSize:            14,
//       fontSizeSM:          12,

//       // Shadow
//       boxShadow:           isDark
//         ? '0 6px 16px rgba(0,0,0,0.48)'
//         : '0 6px 16px rgba(0,0,0,0.08)',
//       boxShadowSecondary:  isDark
//         ? '0 4px 12px rgba(0,0,0,0.36)'
//         : '0 4px 12px rgba(0,0,0,0.06)',

//       // Line height
//       lineHeight:          1.6,

//       // Motion
//       motionDurationFast:  '0.1s',
//       motionDurationMid:   '0.2s',
//       motionDurationSlow:  '0.3s',
//     },
//     components: {
//       // ── Modal ─────────────────────────────────────────────────────────────
//       Modal: {
//         contentBg:     c.bgCard,
//         headerBg:      c.bgCard,
//         footerBg:      c.bgCard,
//         titleColor:    c.textPrimary,
//         colorText:     c.textPrimary,
//         colorIcon:     c.textMuted,
//         borderRadiusLG: 10,
//       },

//       // ── Input ─────────────────────────────────────────────────────────────
//       Input: {
//         colorBgContainer:     c.bgInput || c.bgCard,
//         colorBorder:          c.border,
//         colorText:            c.textPrimary,
//         colorTextPlaceholder: c.textMuted,
//         activeBorderColor:    c.primary,
//         hoverBorderColor:     c.primary,
//         colorBgContainerDisabled: isDark ? '#0D1117' : '#F8FAFC',
//         colorTextDisabled:    c.textMuted,
//         borderRadius:         6,
//         paddingBlock:         8,
//         paddingInline:        12,
//       },

//       // ── Select ────────────────────────────────────────────────────────────
//       Select: {
//         colorBgContainer:       c.bgInput || c.bgCard,
//         colorBorder:            c.border,
//         colorText:              c.textPrimary,
//         colorTextPlaceholder:   c.textMuted,
//         colorBgElevated:        c.bgCard,
//         optionSelectedBg:       isDark ? 'rgba(59,130,246,0.15)' : '#DBEAFE',
//         optionSelectedColor:    c.primary,
//         optionActiveBg:         isDark ? '#21262D' : '#F1F5F9',
//         colorIcon:              c.textMuted,
//         activeBorderColor:      c.primary,
//         hoverBorderColor:       c.primary,
//         borderRadius:           6,
//       },

//       // ── DatePicker ────────────────────────────────────────────────────────
//       DatePicker: {
//         colorBgContainer:     c.bgInput || c.bgCard,
//         colorBorder:          c.border,
//         colorText:            c.textPrimary,
//         colorTextPlaceholder: c.textMuted,
//         colorBgElevated:      c.bgCard,
//         colorIcon:            c.textMuted,
//         activeBorderColor:    c.primary,
//         hoverBorderColor:     c.primary,
//         cellBgDisabled:       isDark ? '#0D1117' : '#F8FAFC',
//         colorTextDisabled:    c.textMuted,
//         borderRadius:         6,
//       },

//       // ── TimePicker ────────────────────────────────────────────────────────
//       TimePicker: {
//         colorBgContainer:     c.bgInput || c.bgCard,
//         colorBorder:          c.border,
//         colorText:            c.textPrimary,
//         colorTextPlaceholder: c.textMuted,
//         colorBgElevated:      c.bgCard,
//         colorIcon:            c.textMuted,
//         activeBorderColor:    c.primary,
//         hoverBorderColor:     c.primary,
//         borderRadius:         6,
//       },

//       // ── Table ─────────────────────────────────────────────────────────────
//       Table: {
//         colorBgContainer:     c.bgCard,
//         headerBg:             isDark ? '#0D1117' : '#F8FAFC',
//         headerColor:          c.textMuted,
//         rowHoverBg:           isDark ? '#0D1117' : '#F8FAFC',
//         borderColor:          c.border,
//         colorText:            c.textSecondary,
//         footerBg:             c.bgCard,
//       },

//       // ── Pagination ────────────────────────────────────────────────────────
//       Pagination: {
//         colorBgContainer: c.bgCard,
//         colorText:        c.textSecondary,
//         colorPrimary:     c.primary,
//         borderRadius:     6,
//       },

//       // ── Form ──────────────────────────────────────────────────────────────
//       Form: {
//         labelColor:        c.textPrimary,
//         labelFontSize:     12,
//         colorError:        c.danger,
//         verticalLabelPadding: '0 0 4px',
//       },

//       // ── Button ────────────────────────────────────────────────────────────
//       Button: {
//         colorBgContainer:     c.bgCard,
//         colorBorder:          c.border,
//         colorText:            c.textSecondary,
//         defaultHoverBg:       isDark ? '#21262D' : '#F8FAFC',
//         defaultHoverColor:    c.primary,
//         defaultHoverBorderColor: c.primary,
//         primaryColor:         '#ffffff',
//         borderRadius:         6,
//         fontWeight:           500,
//       },

//       // ── Menu / Dropdown ───────────────────────────────────────────────────
//       Menu: {
//         colorBgContainer: c.bgCard,
//         colorText:        c.textSecondary,
//         itemBg:           c.bgCard,
//         itemHoverBg:      isDark ? '#21262D' : '#F1F5F9',
//         itemSelectedBg:   isDark ? 'rgba(59,130,246,0.15)' : '#DBEAFE',
//         itemSelectedColor: c.primary,
//         colorItemText:    c.textSecondary,
//         popupBg:          c.bgCard,
//       },

//       // ── Tooltip ───────────────────────────────────────────────────────────
//       Tooltip: {
//         colorBgDefault:  c.bgCard,
//         colorTextLightSolid: c.textPrimary,
//         borderRadius:    6,
//       },

//       // ── Popconfirm ────────────────────────────────────────────────────────
//       Popconfirm: {
//         colorText: c.textPrimary,
//       },

//       // ── Tabs ──────────────────────────────────────────────────────────────
//       Tabs: {
//         colorBgContainer: c.bgCard,
//         colorText:        c.textSecondary,
//         inkBarColor:      c.primary,
//         itemActiveColor:  c.primary,
//         itemSelectedColor: c.primary,
//         itemHoverColor:   c.primary,
//         cardBg:           c.bgBase,
//       },

//       // ── Descriptions ──────────────────────────────────────────────────────
//       Descriptions: {
//         colorText:          c.textPrimary,
//         colorTextSecondary: c.textMuted,
//         labelBg:            c.bgBase,
//         colorBorder:        c.border,
//       },

//       // ── Tag ───────────────────────────────────────────────────────────────
//       Tag: {
//         colorBgContainer: c.bgBase,
//         colorBorder:      c.border,
//         colorText:        c.textSecondary,
//         borderRadius:     4,
//       },

//       // ── Notification ──────────────────────────────────────────────────────
//       Notification: {
//         colorBgElevated: c.bgCard,
//         colorText:       c.textPrimary,
//         colorTextHeading: c.textPrimary,
//         colorIcon:       c.primary,
//       },

//       // ── Alert ─────────────────────────────────────────────────────────────
//       Alert: {
//         borderRadius: 6,
//         colorText:    c.textPrimary,
//       },

//       // ── Spin ──────────────────────────────────────────────────────────────
//       Spin: {
//         colorPrimary: c.primary,
//       },

//       // ── Skeleton ──────────────────────────────────────────────────────────
//       Skeleton: {
//         color:        isDark ? '#30363D' : '#E2E8F0',
//         colorGradientEnd: isDark ? '#21262D' : '#F1F5F9',
//       },

//       // ── Divider ───────────────────────────────────────────────────────────
//       Divider: {
//         colorSplit:   c.border,
//         colorText:    c.textMuted,
//       },

//       // ── Steps ─────────────────────────────────────────────────────────────
//       Steps: {
//         colorText:          c.textPrimary,
//         colorTextDescription: c.textMuted,
//         colorFillContent:   c.bgBase,
//       },

//       // ── Radio ─────────────────────────────────────────────────────────────
//       Radio: {
//         colorBgContainer: c.bgCard,
//         colorBorder:      c.border,
//         colorText:        c.textSecondary,
//         buttonBg:         c.bgCard,
//         buttonCheckedBg:  c.primary,
//         buttonColor:      c.textSecondary,
//         buttonCheckedColor: '#ffffff',
//         borderRadius:     6,
//       },

//       // ── Segmented ─────────────────────────────────────────────────────────
//       Segmented: {
//         colorBgLayout:    c.bgBase,
//         itemColor:        c.textSecondary,
//         itemHoverColor:   c.textPrimary,
//         itemSelectedBg:   c.bgCard,
//         itemSelectedColor: c.textPrimary,
//         colorText:        c.textSecondary,
//         trackBg:          c.bgBase,
//         borderRadius:     6,
//       },

//       // ── Calendar ──────────────────────────────────────────────────────────
//       Calendar: {
//         colorBgContainer: c.bgCard,
//         colorText:        c.textPrimary,
//         colorBorder:      c.border,
//         itemActiveBg:     isDark ? 'rgba(59,130,246,0.15)' : '#DBEAFE',
//       },
//     },
//   };
// };

// // ─── Provider ─────────────────────────────────────────────────────────────────
// export const AppThemeProvider = ({ children, tenantConfig }) => {
//   const [themeName, setThemeNameState] = useState('default');

//   useEffect(() => {
//     idbGet(IDB_KEYS.THEME).then((saved) => {
//       if (saved?.themeName && THEMES[saved.themeName]) {
//         setThemeNameState(saved.themeName);
//       }
//     });
//   }, []);

//   const setTheme = useCallback(async (name) => {
//     if (!THEMES[name]) return;
//     setThemeNameState(name);
//     await idbSet(IDB_KEYS.THEME, { themeName: name });
//   }, []);

//   const toggleDark = useCallback(() => {
//     setTheme(themeName === 'dark' ? 'default' : 'dark');
//   }, [themeName, setTheme]);

//   // Build final theme — merge tenant color overrides on top
//   const baseTheme  = THEMES[themeName] || defaultTheme;
//   const finalTheme = tenantConfig?.primary_color
//     ? {
//         ...baseTheme,
//         colors: {
//           ...baseTheme.colors,
//           primary:      tenantConfig.primary_color,
//           primaryDark:  tenantConfig.primary_color_dark  || baseTheme.colors.primaryDark,
//           primaryLight: tenantConfig.primary_color_light || baseTheme.colors.primaryLight,
//         },
//         branding: {
//           name:    tenantConfig.name    || 'HealthCare',
//           logo:    tenantConfig.logo    || null,
//           tagline: tenantConfig.tagline || 'Empowering Healthcare',
//         },
//       }
//     : {
//         ...baseTheme,
//         branding: {
//           name:    tenantConfig?.name || 'HealthCare',
//           logo:    null,
//           tagline: 'Empowering Healthcare',
//         },
//       };

//   const antConfig = buildAntToken(finalTheme);

//   return (
//     <ThemeContext.Provider value={{
//       themeName,
//       setTheme,
//       toggleDark,
//       isDark: themeName === 'dark',
//     }}>
//       <ConfigProvider theme={antConfig}>
//         <ThemeProvider theme={finalTheme}>
//           {children}
//         </ThemeProvider>
//       </ConfigProvider>
//     </ThemeContext.Provider>
//   );
// };

// export default ThemeContext;

// import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
// import { ThemeProvider } from 'styled-components';
// import defaultTheme from '../theme/defaultTheme';
// import darkTheme    from '../theme/darkTheme';
// import warmTheme    from '../theme/warmTheme';
// import { idbGet, idbSet, IDB_KEYS } from '../utils/indexedDB';

// const THEMES = { default: defaultTheme, dark: darkTheme, warm: warmTheme };

// // ─── Auto-color palette for new tenants (cycles by tenant ID) ────────────────
// const AUTO_COLORS = [
//   { primary: '#2563EB', dark: '#1D4ED8', light: 'rgba(37,99,235,0.15)'   }, // blue
//   { primary: '#0891B2', dark: '#0E7490', light: 'rgba(8,145,178,0.15)'   }, // teal
//   { primary: '#7C3AED', dark: '#6D28D9', light: 'rgba(124,58,237,0.15)'  }, // violet
//   { primary: '#16A34A', dark: '#15803D', light: 'rgba(22,163,74,0.15)'   }, // green
//   { primary: '#DC2626', dark: '#B91C1C', light: 'rgba(220,38,38,0.15)'   }, // red
//   { primary: '#D97706', dark: '#B45309', light: 'rgba(217,119,6,0.15)'   }, // amber
//   { primary: '#0F766E', dark: '#0D5C56', light: 'rgba(15,118,110,0.15)'  }, // teal-dark
//   { primary: '#BE185D', dark: '#9D174D', light: 'rgba(190,24,93,0.15)'   }, // pink
// ];

// const ThemeContext = createContext({
//   themeName:  'default',
//   setTheme:   () => {},
//   toggleDark: () => {},
//   isDark:     false,
// });

// export const useTheme = () => useContext(ThemeContext);

// export const AppThemeProvider = ({ children, tenantConfig }) => {
//   const [themeName, setThemeNameState] = useState('default');

//   // Load saved user theme preference from IndexedDB
//   useEffect(() => {
//     idbGet(IDB_KEYS.THEME).then((saved) => {
//       if (saved?.themeName && THEMES[saved.themeName]) {
//         setThemeNameState(saved.themeName);
//       }
//     });
//   }, []);

//   const setTheme = useCallback(async (name) => {
//     if (!THEMES[name]) return;
//     setThemeNameState(name);
//     await idbSet(IDB_KEYS.THEME, { themeName: name });
//   }, []);

//   const toggleDark = useCallback(() => {
//     setTheme(themeName === 'dark' ? 'default' : 'dark');
//   }, [themeName, setTheme]);

//   const baseTheme = THEMES[themeName] || defaultTheme;

//   // ── Resolve tenant brand colors ──────────────────────────────────────────
//   // Priority: 1) explicit colors from DB, 2) auto-color by tenant ID, 3) theme default
//   const resolveBrandColors = () => {
//     if (tenantConfig?.primary_color) {
//       // Colors set explicitly by admin in Settings → Branding
//       return {
//         primary:      tenantConfig.primary_color,
//         primaryDark:  tenantConfig.primary_color_dark  || baseTheme.colors.primaryDark,
//         primaryLight: tenantConfig.primary_color_light || baseTheme.colors.primaryLight,
//       };
//     }
//     if (tenantConfig?.id) {
//       // Auto-assign color based on tenant ID — new tenants get unique colors
//       const auto = AUTO_COLORS[(tenantConfig.id - 1) % AUTO_COLORS.length];
//       return {
//         primary:      auto.primary,
//         primaryDark:  auto.dark,
//         primaryLight: auto.light,
//       };
//     }
//     // No tenant config — use base theme colors
//     return {
//       primary:      baseTheme.colors.primary,
//       primaryDark:  baseTheme.colors.primaryDark,
//       primaryLight: baseTheme.colors.primaryLight,
//     };
//   };

//   const brandColors = resolveBrandColors();

//   const finalTheme = {
//     ...baseTheme,
//     colors: {
//       ...baseTheme.colors,
//       ...brandColors,
//     },
//     branding: {
//       name:    tenantConfig?.name    || 'HealthCare',
//       tagline: tenantConfig?.tagline || 'Empowering Healthcare',
//       id:      tenantConfig?.id      || null,
//     },
//   };

//   return (
//     <ThemeContext.Provider value={{
//       themeName,
//       setTheme,
//       toggleDark,
//       isDark: themeName === 'dark',
//     }}>
//       <ThemeProvider theme={finalTheme}>
//         {children}
//       </ThemeProvider>
//     </ThemeContext.Provider>
//   );
// };

// export default ThemeContext;


import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ThemeProvider } from 'styled-components';
import { ConfigProvider, theme as antTheme } from 'antd';
import defaultTheme from '../theme/defaultTheme';
import darkTheme    from '../theme/darkTheme';
import warmTheme    from '../theme/warmTheme';
import { idbGet, idbSet, IDB_KEYS } from '../utils/indexedDB';

const THEMES = { default: defaultTheme, dark: darkTheme, warm: warmTheme };

// ─── Auto-color palette for new tenants (cycles by tenant ID) ────────────────
const AUTO_COLORS = [
  { primary: '#2563EB', dark: '#1D4ED8', light: 'rgba(37,99,235,0.15)',  sidebar: '#0F172A', sidebarHover: '#1E293B' },
  { primary: '#0891B2', dark: '#0E7490', light: 'rgba(8,145,178,0.15)',  sidebar: '#042F2E', sidebarHover: '#134E4A' },
  { primary: '#7C3AED', dark: '#6D28D9', light: 'rgba(124,58,237,0.15)', sidebar: '#1E1B4B', sidebarHover: '#312E81' },
  { primary: '#16A34A', dark: '#15803D', light: 'rgba(22,163,74,0.15)',  sidebar: '#052E16', sidebarHover: '#14532D' },
  { primary: '#DC2626', dark: '#B91C1C', light: 'rgba(220,38,38,0.15)',  sidebar: '#1C0606', sidebarHover: '#450A0A' },
  { primary: '#D97706', dark: '#B45309', light: 'rgba(217,119,6,0.15)',  sidebar: '#1C1007', sidebarHover: '#451A03' },
  { primary: '#0F766E', dark: '#0D5C56', light: 'rgba(15,118,110,0.15)', sidebar: '#042F2E', sidebarHover: '#134E4A' },
  { primary: '#BE185D', dark: '#9D174D', light: 'rgba(190,24,93,0.15)',  sidebar: '#1F0A16', sidebarHover: '#500724' },
];

const ThemeContext = createContext({
  themeName:  'default',
  setTheme:   () => {},
  toggleDark: () => {},
  isDark:     false,
});

export const useTheme = () => useContext(ThemeContext);

// ─── Ant Design ConfigProvider tokens ────────────────────────────────────────
const buildAntToken = (appTheme) => {
  const c      = appTheme.colors;
  const isDark = appTheme.name === 'dark';

  return {
    algorithm: isDark ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
    token: {
      colorPrimary:         c.primary,
      colorPrimaryHover:    c.primaryDark,
      colorPrimaryActive:   c.primaryDark,
      colorBgBase:          isDark ? '#0D1117' : '#FFFFFF',
      colorBgContainer:     c.bgInput  || c.bgCard,
      colorBgElevated:      c.bgCard,
      colorBgLayout:        c.bgBase,
      colorText:            c.textPrimary,
      colorTextSecondary:   c.textSecondary,
      colorTextTertiary:    c.textMuted,
      colorTextPlaceholder: c.textMuted,
      colorTextDisabled:    c.textMuted,
      colorBorder:          c.border,
      colorBorderSecondary: c.border,
      colorFill:            isDark ? '#21262D' : '#F1F5F9',
      colorFillSecondary:   isDark ? '#161B22' : '#FFFFFF',
      colorFillTertiary:    isDark ? '#0D1117' : '#F8FAFC',
      colorFillQuaternary:  isDark ? '#010409' : '#F1F5F9',
      colorSuccess:         c.success,
      colorWarning:         c.warning,
      colorError:           c.danger,
      colorInfo:            c.primary,
      borderRadius:         6,
      borderRadiusLG:       10,
      borderRadiusSM:       4,
      fontFamily:           "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      fontSize:             14,
      lineHeight:           1.6,
      motionDurationFast:   '0.1s',
      motionDurationMid:    '0.2s',
      motionDurationSlow:   '0.3s',
    },
    components: {
      Modal:    { contentBg: c.bgCard, headerBg: c.bgCard, footerBg: c.bgCard, titleColor: c.textPrimary, colorText: c.textPrimary, colorIcon: c.textMuted, borderRadiusLG: 10 },
      Input:    { colorBgContainer: c.bgInput || c.bgCard, colorBorder: c.border, colorText: c.textPrimary, colorTextPlaceholder: c.textMuted, activeBorderColor: c.primary, hoverBorderColor: c.primary, colorBgContainerDisabled: isDark ? '#0D1117' : '#F8FAFC', colorTextDisabled: c.textMuted, borderRadius: 6, paddingBlock: 8, paddingInline: 12 },
      Select:   { colorBgContainer: c.bgInput || c.bgCard, colorBorder: c.border, colorText: c.textPrimary, colorTextPlaceholder: c.textMuted, colorBgElevated: c.bgCard, optionSelectedBg: c.primaryLight, optionSelectedColor: c.primary, optionActiveBg: isDark ? '#21262D' : '#F1F5F9', colorIcon: c.textMuted, activeBorderColor: c.primary, hoverBorderColor: c.primary, borderRadius: 6 },
      DatePicker: { colorBgContainer: c.bgInput || c.bgCard, colorBorder: c.border, colorText: c.textPrimary, colorTextPlaceholder: c.textMuted, colorBgElevated: c.bgCard, colorIcon: c.textMuted, activeBorderColor: c.primary, hoverBorderColor: c.primary, borderRadius: 6 },
      TimePicker: { colorBgContainer: c.bgInput || c.bgCard, colorBorder: c.border, colorText: c.textPrimary, colorTextPlaceholder: c.textMuted, colorBgElevated: c.bgCard, colorIcon: c.textMuted, activeBorderColor: c.primary, hoverBorderColor: c.primary, borderRadius: 6 },
      Table:    { colorBgContainer: c.bgCard, headerBg: isDark ? '#0D1117' : '#F8FAFC', headerColor: c.textMuted, rowHoverBg: isDark ? '#0D1117' : '#F8FAFC', borderColor: c.border, colorText: c.textSecondary, footerBg: c.bgCard },
      Pagination: { colorBgContainer: c.bgCard, colorText: c.textSecondary, colorPrimary: c.primary, borderRadius: 6 },
      Form:     { labelColor: c.textPrimary, labelFontSize: 12, colorError: c.danger, verticalLabelPadding: '0 0 4px' },
      Button:   { colorBgContainer: c.bgCard, colorBorder: c.border, colorText: c.textSecondary, defaultHoverBg: isDark ? '#21262D' : '#F8FAFC', defaultHoverColor: c.primary, defaultHoverBorderColor: c.primary, primaryColor: '#ffffff', borderRadius: 6, fontWeight: 500 },
      Menu:     { colorBgContainer: c.bgCard, colorText: c.textSecondary, itemBg: c.bgCard, itemHoverBg: isDark ? '#21262D' : '#F1F5F9', itemSelectedBg: c.primaryLight, itemSelectedColor: c.primary, popupBg: c.bgCard },
      Tooltip:  { colorBgDefault: c.bgCard, colorTextLightSolid: c.textPrimary, borderRadius: 6 },
      Popconfirm: { colorText: c.textPrimary },
      Tabs:     { colorBgContainer: c.bgCard, colorText: c.textSecondary, inkBarColor: c.primary, itemActiveColor: c.primary, itemSelectedColor: c.primary, itemHoverColor: c.primary, cardBg: c.bgBase },
      Descriptions: { colorText: c.textPrimary, colorTextSecondary: c.textMuted, labelBg: c.bgBase, colorBorder: c.border },
      Tag:      { colorBgContainer: c.bgBase, colorBorder: c.border, colorText: c.textSecondary, borderRadius: 4 },
      Notification: { colorBgElevated: c.bgCard, colorText: c.textPrimary, colorTextHeading: c.textPrimary, colorIcon: c.primary },
      Alert:    { borderRadius: 6, colorText: c.textPrimary },
      Spin:     { colorPrimary: c.primary },
      Skeleton: { color: isDark ? '#30363D' : '#E2E8F0', colorGradientEnd: isDark ? '#21262D' : '#F1F5F9' },
      Divider:  { colorSplit: c.border, colorText: c.textMuted },
      Steps:    { colorText: c.textPrimary, colorTextDescription: c.textMuted, colorFillContent: c.bgBase },
      Radio:    { colorBgContainer: c.bgCard, colorBorder: c.border, colorText: c.textSecondary, buttonBg: c.bgCard, buttonCheckedBg: c.primary, buttonColor: c.textSecondary, buttonCheckedColor: '#ffffff', borderRadius: 6 },
      Segmented: { colorBgLayout: c.bgBase, itemColor: c.textSecondary, itemHoverColor: c.textPrimary, itemSelectedBg: c.bgCard, itemSelectedColor: c.textPrimary, trackBg: c.bgBase, borderRadius: 6 },
      Calendar:  { colorBgContainer: c.bgCard, colorText: c.textPrimary, colorBorder: c.border, itemActiveBg: c.primaryLight },
    },
  };
};

// ─── Provider ─────────────────────────────────────────────────────────────────
export const AppThemeProvider = ({ children, tenantConfig }) => {
  const [themeName, setThemeNameState] = useState('default');

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

  const baseTheme = THEMES[themeName] || defaultTheme;

  // ── Resolve tenant brand colors ───────────────────────────────────────────
  const resolveBrandColors = () => {
    if (tenantConfig?.primary_color) {
      // Explicit colors set by admin — also derive matching sidebar colors
      // Parse primary to create a dark variant for sidebar
      const p = tenantConfig.primary_color;
      return {
        primary:        p,
        primaryDark:    tenantConfig.primary_color_dark  || baseTheme.colors.primaryDark,
        primaryLight:   tenantConfig.primary_color_light || baseTheme.colors.primaryLight,
        bgSidebar:      tenantConfig.sidebar_color       || deriveSidebarColor(p),
        bgSidebarHover: tenantConfig.sidebar_hover       || deriveSidebarHoverColor(p),
      };
    }
    if (tenantConfig?.id) {
      // Auto-assign from palette by tenant ID
      const auto = AUTO_COLORS[(tenantConfig.id - 1) % AUTO_COLORS.length];
      return {
        primary:        auto.primary,
        primaryDark:    auto.dark,
        primaryLight:   auto.light,
        bgSidebar:      auto.sidebar,
        bgSidebarHover: auto.sidebarHover,
      };
    }
    // No tenant — use base theme defaults
    return {
      primary:        baseTheme.colors.primary,
      primaryDark:    baseTheme.colors.primaryDark,
      primaryLight:   baseTheme.colors.primaryLight,
      bgSidebar:      baseTheme.colors.bgSidebar,
      bgSidebarHover: baseTheme.colors.bgSidebarHover,
    };
  };

  const brandColors = resolveBrandColors();

  const finalTheme = {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      ...brandColors,
    },
    branding: {
      name:    tenantConfig?.name    || 'HealthCare',
      tagline: tenantConfig?.tagline || 'Empowering Healthcare',
      id:      tenantConfig?.id      || null,
    },
  };

  const antConfig = buildAntToken(finalTheme);

  return (
    <ThemeContext.Provider value={{
      themeName,
      setTheme,
      toggleDark,
      isDark: themeName === 'dark',
    }}>
      <ConfigProvider theme={antConfig}>
        <ThemeProvider theme={finalTheme}>
          {children}
        </ThemeProvider>
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};

// ─── Helpers: derive dark sidebar color from primary hex ─────────────────────
function deriveSidebarColor(hex) {
  try {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    // Very dark version — multiply by 0.15
    const dr = Math.round(r * 0.15).toString(16).padStart(2, '0');
    const dg = Math.round(g * 0.15).toString(16).padStart(2, '0');
    const db = Math.round(b * 0.15).toString(16).padStart(2, '0');
    return `#${dr}${dg}${db}`;
  } catch { return '#0F172A'; }
}

function deriveSidebarHoverColor(hex) {
  try {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    // Slightly lighter than sidebar — multiply by 0.25
    const dr = Math.round(r * 0.25).toString(16).padStart(2, '0');
    const dg = Math.round(g * 0.25).toString(16).padStart(2, '0');
    const db = Math.round(b * 0.25).toString(16).padStart(2, '0');
    return `#${dr}${dg}${db}`;
  } catch { return '#1E293B'; }
}

export default ThemeContext;