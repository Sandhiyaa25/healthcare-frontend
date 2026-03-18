import defaultTheme from './defaultTheme';

const warmTheme = {
  ...defaultTheme,
  name: 'warm',
  colors: {
    ...defaultTheme.colors,
    primary:       '#D97706',
    primaryDark:   '#B45309',
    primaryLight:  '#FEF3C7',
    secondary:     '#F59E0B',
    bgBase:        '#FFFBF0',
    bgCard:        '#FFFFFF',
    bgSidebar:     '#1C1410',
    bgSidebarHover:'#2D2015',
    border:        '#F3E8C8',
    borderFocus:   '#D97706',
  },
};
export default warmTheme;
