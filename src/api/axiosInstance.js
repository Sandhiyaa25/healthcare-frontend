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

// // ─── Response Interceptor ─────────────────────────────────────────────────────
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     const isAuthUrl =
//       originalRequest.url?.includes('/api/auth/login')         ||
//       originalRequest.url?.includes('/api/auth/refresh')       ||
//       originalRequest.url?.includes('/api/auth/csrf/regenerate') ||
//       originalRequest.url?.includes('/api/tenant/resolve');

//     // ── 401: Access token expired → silent refresh ────────────────────────────
//     if (
//       error.response?.status === 401 &&
//       !originalRequest._retry &&
//       !isAuthUrl
//     ) {
//       if (isRefreshing) {
//         return new Promise((resolve, reject) => {
//           failedQueue.push({ resolve, reject });
//         }).then((token) => {
//           originalRequest.headers['Authorization'] = `Bearer ${token}`;
//           return axiosInstance(originalRequest);
//         });
//       }

//       originalRequest._retry = true;
//       isRefreshing = true;

//       try {
//         const tenantId = getTenantId();
//         if (!tenantId) throw new Error('No tenant_id for refresh');

//         const res = await axiosInstance.post('/api/auth/refresh', {
//           tenant_id: Number(tenantId),
//         });
//         const { access_token } = res.data.data;

//         setToken(access_token);
//         axiosInstance.defaults.headers['Authorization'] = `Bearer ${access_token}`;
//         processQueue(failedQueue, null, access_token);

//         originalRequest.headers['Authorization'] = `Bearer ${access_token}`;
//         return axiosInstance(originalRequest);

//       } catch (refreshErr) {
//         processQueue(failedQueue, refreshErr, null);
//         clearAll();
//         window.location.href = '/login';
//         return Promise.reject(refreshErr);
//       } finally {
//         isRefreshing = false;
//       }
//     }

//     // ── 403: CSRF token expired → auto-regenerate ─────────────────────────────
//     if (
//       error.response?.status === 403 &&
//       !originalRequest._csrfRetry &&
//       !isAuthUrl
//     ) {
//       // Check if it's actually a CSRF error
//       const errCode = error.response?.data?.error_code;
//       const errMsg  = error.response?.data?.message || '';

//       const isCsrfError =
//         errCode === 'CSRF_INVALID'  ||
//         errCode === 'CSRF_MISSING'  ||
//         errMsg.toLowerCase().includes('csrf');

//       if (!isCsrfError) {
//         // 403 for other reasons (role permission) — don't retry
//         return Promise.reject(error);
//       }

//       if (isRegeneratingCsrf) {
//         return new Promise((resolve, reject) => {
//           csrfQueue.push({ resolve, reject });
//         }).then(() => {
//           return axiosInstance(originalRequest);
//         });
//       }

//       originalRequest._csrfRetry = true;
//       isRegeneratingCsrf = true;

//       try {
//         // Regenerate CSRF token
//         const res = await axiosInstance.post('/api/auth/csrf/regenerate');
//         const newCsrf = res.data?.data?.csrf_token;

//         if (newCsrf) {
//           setCsrfToken(newCsrf);
//           axiosInstance.defaults.headers['X-CSRF-Token'] = newCsrf;
//         }

//         processQueue(csrfQueue, null);

//         // Retry original request with new CSRF token
//         originalRequest.headers['X-CSRF-Token'] = getCsrfToken();
//         return axiosInstance(originalRequest);

//       } catch (csrfErr) {
//         processQueue(csrfQueue, csrfErr);
//         // CSRF regeneration failed — likely session ended, force logout
//         clearAll();
//         window.location.href = '/login';
//         return Promise.reject(csrfErr);
//       } finally {
//         isRegeneratingCsrf = false;
//       }
//     }

//     return Promise.reject(error);
//   }
// );
// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Detects if a string looks like a backend AES-256-CBC encrypted value.
 * Backend format: base64( iv[16 bytes] + ciphertext )
 * Minimum base64 length for 16-byte IV + 1 block (16 bytes) = ceil(32/3)*4 = 44 chars
 */
const looksEncrypted = (val) =>
  typeof val === 'string' &&
  val.length >= 44 &&
  /^[A-Za-z0-9+/]+=*$/.test(val);

/**
 * Attempt AES-256-CBC decrypt of a single string value.
 * Uses SubtleCrypto (built-in, no extra libraries).
 * Returns decrypted string on success, or original value on failure.
 */
const AES_KEY_HEX = process.env.REACT_APP_ENCRYPTION_KEY || '';

let _cryptoKey = null; // cached CryptoKey
const getCryptoKey = async () => {
  if (_cryptoKey) return _cryptoKey;
  if (!AES_KEY_HEX) return null;
  try {
    // Key may be hex string — convert to bytes
    const keyBytes = AES_KEY_HEX.match(/.{1,2}/g)
      ? Uint8Array.from(
          AES_KEY_HEX.match(/.{1,2}/g).map((b) => parseInt(b, 16))
        )
      : new TextEncoder().encode(AES_KEY_HEX);

    _cryptoKey = await window.crypto.subtle.importKey(
      'raw',
      keyBytes,
      { name: 'AES-CBC' },
      false,
      ['decrypt']
    );
    return _cryptoKey;
  } catch {
    return null;
  }
};

const decryptValue = async (val) => {
  if (!looksEncrypted(val)) return val;
  const key = await getCryptoKey();
  if (!key) return val; // no key configured → return as-is
  try {
    const raw = Uint8Array.from(atob(val), (c) => c.charCodeAt(0));
    const iv = raw.slice(0, 16);
    const ciphertext = raw.slice(16);
    const decrypted = await window.crypto.subtle.decrypt(
      { name: 'AES-CBC', iv },
      key,
      ciphertext
    );
    return new TextDecoder().decode(decrypted);
  } catch {
    return val; // decryption failed → safe fallback, return original
  }
};

/**
 * Deep-walks an object/array and decrypts any encrypted string values.
 * Safe: null/undefined pass through. Non-string values are untouched.
 */
const deepDecrypt = async (data) => {
  if (data === null || data === undefined) return data;
  if (typeof data === 'string') return decryptValue(data);
  if (Array.isArray(data)) {
    return Promise.all(data.map((item) => deepDecrypt(item)));
  }
  if (typeof data === 'object') {
    const entries = await Promise.all(
      Object.entries(data).map(async ([k, v]) => [k, await deepDecrypt(v)])
    );
    return Object.fromEntries(entries);
  }
  return data; // number, boolean, etc. — untouched
};

// ─── Retry helper ─────────────────────────────────────────────────────────────
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

const retryRequest = async (config, retries = 2, delay = 800) => {
  for (let attempt = 0; attempt < retries; attempt++) {
    await sleep(delay * (attempt + 1)); // 800ms, 1600ms
    try {
      return await axiosInstance(config);
    } catch (err) {
      if (attempt === retries - 1) throw err; // last attempt: re-throw
      const status = err.response?.status;
      if (status && status !== 500) throw err; // only retry 500 / network errors
    }
  }
};

// ─── Response Interceptor ─────────────────────────────────────────────────────
axiosInstance.interceptors.response.use(
  async (response) => {
    // Decrypt encrypted fields in response data (if encryption key is configured)
    if (AES_KEY_HEX && response.data) {
      try {
        response.data = await deepDecrypt(response.data);
      } catch {
        // deepDecrypt failed entirely — return original response untouched
      }
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // ── 500 / Network error: retry up to 2 times ──────────────────────────
    const status = error.response?.status;
    const isNetworkError = !error.response && error.request;
    const should500Retry =
      (status === 500 || isNetworkError) &&
      !originalRequest._500Retry;

    if (should500Retry) {
      originalRequest._500Retry = true;
      try {
        return await retryRequest(originalRequest, 2, 800);
      } catch (retryErr) {
        // All retries exhausted — fall through to normal error handling
        error = retryErr;
      }
    }

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
      const errCode = error.response?.data?.error_code;
      const errMsg  = error.response?.data?.message || '';

      const isCsrfError =
        errCode === 'CSRF_INVALID'  ||
        errCode === 'CSRF_MISSING'  ||
        errMsg.toLowerCase().includes('csrf');

      if (!isCsrfError) {
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
        const res = await axiosInstance.post('/api/auth/csrf/regenerate');
        const newCsrf = res.data?.data?.csrf_token;

        if (newCsrf) {
          setCsrfToken(newCsrf);
          axiosInstance.defaults.headers['X-CSRF-Token'] = newCsrf;
        }

        processQueue(csrfQueue, null);

        originalRequest.headers['X-CSRF-Token'] = getCsrfToken();
        return axiosInstance(originalRequest);

      } catch (csrfErr) {
        processQueue(csrfQueue, csrfErr);
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