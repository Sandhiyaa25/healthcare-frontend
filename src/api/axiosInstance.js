import axios from 'axios';
import {
  getToken, getCsrfToken, clearAll, setToken, getTenantId,
} from '../utils/tokenStorage';
import { getSubdomain } from '../utils/subdomainUtils';

// const BASE_URL = process.env.REACT_APP_API_BASE_URL
//   || 'http://localhost/healthcare-project/public';
const BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

const axiosInstance = axios.create({
  baseURL:         BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type':    'application/json',
    'X-Requested-With':'XMLHttpRequest',
  },
});

// ─── Request Interceptor ─────────────────────────────────────────────────────
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) config.headers['Authorization'] = `Bearer ${token}`;

    const csrf = getCsrfToken();
    if (csrf)  config.headers['X-CSRF-Token'] = csrf;

    const subdomain = getSubdomain();
    if (subdomain) config.headers['X-Tenant-Subdomain'] = subdomain;

    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Token Refresh ────────────────────────────────────────────────────────────
let isRefreshing = false;
let failedQueue  = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((p) => error ? p.reject(error) : p.resolve(token));
  failedQueue = [];
};

// ─── Response Interceptor ────────────────────────────────────────────────────
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const isAuthUrl =
      originalRequest.url?.includes('/api/auth/login')   ||
      originalRequest.url?.includes('/api/auth/refresh') ||
      originalRequest.url?.includes('/api/tenant/resolve');

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthUrl
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const tenantId = getTenantId(); // ← uses localStorage fallback
        if (!tenantId) throw new Error('No tenant_id for refresh');

        const res = await axiosInstance.post('/api/auth/refresh', {
          tenant_id: Number(tenantId),
        });
        const { access_token } = res.data.data;

        setToken(access_token);
        axiosInstance.defaults.headers['Authorization'] = `Bearer ${access_token}`;
        processQueue(null, access_token);

        originalRequest.headers['Authorization'] = `Bearer ${access_token}`;
        return axiosInstance(originalRequest);

      } catch (refreshErr) {
        processQueue(refreshErr, null);
        clearAll();
        window.location.href = '/login';
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;