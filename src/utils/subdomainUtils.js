/**
 * Extract tenant subdomain from the current hostname.
 *
 * Examples:
 *   apollo.localhost:3000   → "apollo"
 *   apollo.app.com          → "apollo"
 *   localhost:3000          → null  (no subdomain)
 *   app.com                 → null  (apex domain)
 */
export const getSubdomain = () => {
  const hostname = window.location.hostname; // e.g. "apollo.localhost"

  // Split by dot
  const parts = hostname.split('.');

  // Development: something.localhost
  if (parts.length >= 2 && parts[parts.length - 1] === 'localhost') {
    return parts[0] === 'localhost' ? null : parts[0];
  }

  // Production: subdomain.domain.tld  (3+ parts)
  if (parts.length >= 3) {
    return parts[0];
  }

  return null;
};

/**
 * Resolve tenant_id from the backend using the subdomain.
 * The backend has a Tenant model with findBySubdomain().
 * We call GET /api/tenant/resolve?subdomain=xxx
 */
export const resolveTenantFromSubdomain = async (axiosInstance) => {
  const subdomain = getSubdomain();
  if (!subdomain) return null;

  const response = await axiosInstance.get('/api/tenant/resolve', {
    params: { subdomain },
  });
  return response.data?.data ?? null;
};
