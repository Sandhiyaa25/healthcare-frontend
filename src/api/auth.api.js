import axiosInstance from './axiosInstance';

export const loginApi = (credentials) =>
  axiosInstance.post('/api/auth/login', credentials);

export const logoutApi = () =>
  axiosInstance.post('/api/auth/logout');

export const refreshTokenApi = (tenantId) =>
  axiosInstance.post('/api/auth/refresh', { tenant_id: tenantId });

export const regenerateCsrfApi = () =>
  axiosInstance.post('/api/auth/csrf/regenerate');

export const resolveTenantApi = (subdomain) =>
  axiosInstance.get('/api/tenant/resolve', { params: { subdomain } });
