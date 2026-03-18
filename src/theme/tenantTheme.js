import defaultTheme from './defaultTheme';

/**
 * Merges tenant-specific overrides into the default theme.
 * Tenant config comes from GET /api/tenant/resolve response.
 */
const buildTenantTheme = (tenantConfig = {}) => {
  const overrides = {};

  if (tenantConfig?.primary_color) {
    overrides.colors = {
      ...defaultTheme.colors,
      primary:      tenantConfig.primary_color,
      primaryDark:  tenantConfig.primary_color_dark || defaultTheme.colors.primaryDark,
      primaryLight: tenantConfig.primary_color_light || defaultTheme.colors.primaryLight,
    };
  }

  return {
    ...defaultTheme,
    ...overrides,
    branding: {
      name:    tenantConfig?.name    || 'HealthCare',
      logo:    tenantConfig?.logo    || null,
      tagline: tenantConfig?.tagline || 'Empowering Healthcare',
    },
  };
};

export default buildTenantTheme;
