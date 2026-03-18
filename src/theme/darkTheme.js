import defaultTheme from './defaultTheme';

const darkTheme = {
  ...defaultTheme,
  name: 'dark',
  colors: {
    ...defaultTheme.colors,
    primary:       '#3B82F6',
    primaryDark:   '#2563EB',
    primaryLight:  'rgba(59,130,246,0.15)',
    bgBase:        '#0D1117',
    bgCard:        '#161B22',
    bgSidebar:     '#010409',
    bgSidebarHover:'#161B22',
    textPrimary:   '#E6EDF3',
    textSecondary: '#8B949E',
    textMuted:     '#6E7681',
    textInverse:   '#0D1117',
    border:        '#30363D',
    borderFocus:   '#3B82F6',
    shadow:        'rgba(0,0,0,0.3)',
    shadowMd:      'rgba(0,0,0,0.5)',
  },
};
export default darkTheme;
