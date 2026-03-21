import axios from 'axios';
import {
  getToken, getCsrfToken, setCsrfToken, clearAll,
  setToken, getTenantId,
} from '../utils/tokenStorage';
import { getSubdomain } from '../utils/subdomainUtils';

const BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

const axiosInstance = axios.create({
  baseURL:         BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type':     'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

// ─── Request Interceptor ──────────────────────────────────────────────────────
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) config.headers['Authorization'] = `Bearer ${token}`;

    const csrf = getCsrfToken();
    if (csrf) config.headers['X-CSRF-Token'] = csrf;

    const subdomain = getSubdomain();
    if (subdomain) config.headers['X-Tenant-Subdomain'] = subdomain;

    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Queues ───────────────────────────────────────────────────────────────────
let isRefreshing     = false;
let isRegeneratingCsrf = false;
let failedQueue      = [];
let csrfQueue        = [];

const processQueue = (queue, error, value = null) => {
  queue.forEach((p) => error ? p.reject(error) : p.resolve(value));
  queue.length = 0;
};

// ─── Response Interceptor ─────────────────────────────────────────────────────
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const isAuthUrl =
      originalRequest.url?.includes('/api/auth/login')         ||
      originalRequest.url?.includes('/api/auth/refresh')       ||
      originalRequest.url?.includes('/api/auth/csrf/regenerate') ||
      originalRequest.url?.includes('/api/tenant/resolve');

    // ── 401: Access token expired → silent refresh ────────────────────────────
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
        const tenantId = getTenantId();
        if (!tenantId) throw new Error('No tenant_id for refresh');

        const res = await axiosInstance.post('/api/auth/refresh', {
          tenant_id: Number(tenantId),
        });
        const { access_token } = res.data.data;

        setToken(access_token);
        axiosInstance.defaults.headers['Authorization'] = `Bearer ${access_token}`;
        processQueue(failedQueue, null, access_token);

        originalRequest.headers['Authorization'] = `Bearer ${access_token}`;
        return axiosInstance(originalRequest);

      } catch (refreshErr) {
        processQueue(failedQueue, refreshErr, null);
        clearAll();
        window.location.href = '/login';
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    // ── 403: CSRF token expired → auto-regenerate ─────────────────────────────
    if (
      error.response?.status === 403 &&
      !originalRequest._csrfRetry &&
      !isAuthUrl
    ) {
      // Check if it's actually a CSRF error
      const errCode = error.response?.data?.error_code;
      const errMsg  = error.response?.data?.message || '';

      const isCsrfError =
        errCode === 'CSRF_INVALID'  ||
        errCode === 'CSRF_MISSING'  ||
        errMsg.toLowerCase().includes('csrf');

      if (!isCsrfError) {
        // 403 for other reasons (role permission) — don't retry
        return Promise.reject(error);
      }

      if (isRegeneratingCsrf) {
        return new Promise((resolve, reject) => {
          csrfQueue.push({ resolve, reject });
        }).then(() => {
          return axiosInstance(originalRequest);
        });
      }

      originalRequest._csrfRetry = true;
      isRegeneratingCsrf = true;

      try {
        // Regenerate CSRF token
        const res = await axiosInstance.post('/api/auth/csrf/regenerate');
        const newCsrf = res.data?.data?.csrf_token;

        if (newCsrf) {
          setCsrfToken(newCsrf);
          axiosInstance.defaults.headers['X-CSRF-Token'] = newCsrf;
        }

        processQueue(csrfQueue, null);

        // Retry original request with new CSRF token
        originalRequest.headers['X-CSRF-Token'] = getCsrfToken();
        return axiosInstance(originalRequest);

      } catch (csrfErr) {
        processQueue(csrfQueue, csrfErr);
        // CSRF regeneration failed — likely session ended, force logout
        clearAll();
        window.location.href = '/login';
        return Promise.reject(csrfErr);
      } finally {
        isRegeneratingCsrf = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;