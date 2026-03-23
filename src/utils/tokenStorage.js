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

// ─── Check if a JWT token is expired ─────────────────────────────────────────
export const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    // exp is in seconds — compare with current time in seconds
    return payload.exp < Math.floor(Date.now() / 1000);
  } catch {
    return true; // if we can't decode it, treat as expired
  }
};

// ─── Access Token — localStorage (encrypted) ─────────────────────────────────
export const TOKEN_KEY = 'hc_at';

export const setToken   = (t) => localStorage.setItem(TOKEN_KEY, encryptToken(t));
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

// getToken returns the token ONLY if it is not expired
// If expired — clears it from storage and returns null
export const getToken = () => {
  const enc = localStorage.getItem(TOKEN_KEY);
  if (!enc) return null;
  const token = decryptToken(enc);
  if (!token || isTokenExpired(token)) {
    clearToken(); // auto-clear expired token
    return null;
  }
  return token;
};

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

// ─── Legacy helpers ───────────────────────────────────────────────────────────
export const setUser   = () => {};
export const getUser   = () => null;
export const clearUser = () => { localStorage.removeItem('hc_user'); };

// ─── Clear All ────────────────────────────────────────────────────────────────
export const clearAll = () => {
  clearToken();
  clearCsrfToken();
  clearTenantId();
  clearUser();
};