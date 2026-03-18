/**
 * Token Storage — localStorage for access token only (encrypted).
 * All user/tenant data moved to IndexedDB via indexedDB.js
 */

const SECRET = process.env.REACT_APP_TOKEN_SECRET || 'hc_saas_secret_2024';

const xorCipher = (str, key) => {
  try {
    return btoa(
      str.split('').map((c, i) =>
        String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
      ).join('')
    );
  } catch { return str; }
};

const xorDecipher = (encoded, key) => {
  try {
    const str = atob(encoded);
    return str.split('').map((c, i) =>
      String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
    ).join('');
  } catch { return null; }
};

export const encryptToken = (token) => xorCipher(token, SECRET);
export const decryptToken = (enc)   => xorDecipher(enc, SECRET);

// ─── Access Token — localStorage (encrypted) ─────────────────────────────────
export const TOKEN_KEY = 'hc_at';

export const setToken   = (t) => localStorage.setItem(TOKEN_KEY, encryptToken(t));
export const getToken   = () => { const e = localStorage.getItem(TOKEN_KEY); return e ? decryptToken(e) : null; };
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

// ─── CSRF Token — sessionStorage ─────────────────────────────────────────────
export const CSRF_KEY = 'hc_csrf';

export const setCsrfToken   = (t) => sessionStorage.setItem(CSRF_KEY, t);
export const getCsrfToken   = ()  => sessionStorage.getItem(CSRF_KEY);
export const clearCsrfToken = ()  => sessionStorage.removeItem(CSRF_KEY);

// ─── Tenant ID — sessionStorage ──────────────────────────────────────────────
export const TENANT_KEY = 'hc_tenant';

export const setTenantId   = (id) => sessionStorage.setItem(TENANT_KEY, String(id));
export const getTenantId   = ()   => sessionStorage.getItem(TENANT_KEY);
export const clearTenantId = ()   => sessionStorage.removeItem(TENANT_KEY);

// ─── Legacy helpers (kept for backward compat — data now in IndexedDB) ───────
// These are no-ops now; actual user data goes through indexedDB.js
export const setUser   = () => {};
export const getUser   = () => null;
export const clearUser = () => {
  // clean up old localStorage key if present
  localStorage.removeItem('hc_user');
};

// ─── Clear All ────────────────────────────────────────────────────────────────
export const clearAll = () => {
  clearToken();
  clearCsrfToken();
  clearTenantId();
  clearUser();
};
