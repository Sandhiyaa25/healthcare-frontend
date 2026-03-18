/**
 * IndexedDB utility — encrypted storage for user data.
 * All non-token data (user profile, preferences) goes here.
 * Uses the same XOR cipher as tokenStorage for consistency.
 */

const DB_NAME    = 'hc_saas_db';
const DB_VERSION = 1;
const STORE_NAME = 'secure_store';
const SECRET     = process.env.REACT_APP_TOKEN_SECRET || 'hc_saas_secret_2024';

// ─── Cipher ──────────────────────────────────────────────────────────────────

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

const encrypt = (data) => xorCipher(JSON.stringify(data), SECRET);
const decrypt = (enc)  => {
  try { return JSON.parse(xorDecipher(enc, SECRET)); }
  catch { return null; }
};

// ─── DB Init ─────────────────────────────────────────────────────────────────

let dbInstance = null;

const openDB = () => new Promise((resolve, reject) => {
  if (dbInstance) { resolve(dbInstance); return; }

  const req = indexedDB.open(DB_NAME, DB_VERSION);

  req.onupgradeneeded = (e) => {
    const db = e.target.result;
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      db.createObjectStore(STORE_NAME, { keyPath: 'key' });
    }
  };

  req.onsuccess = (e) => {
    dbInstance = e.target.result;
    resolve(dbInstance);
  };

  req.onerror = (e) => reject(e.target.error);
});

// ─── CRUD ────────────────────────────────────────────────────────────────────

export const idbSet = async (key, value) => {
  try {
    const db    = await openDB();
    const tx    = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put({ key, value: encrypt(value) });
    return new Promise((res, rej) => {
      tx.oncomplete = () => res(true);
      tx.onerror    = () => rej(tx.error);
    });
  } catch (e) {
    console.error('[IndexedDB] set error:', e);
    return false;
  }
};

export const idbGet = async (key) => {
  try {
    const db    = await openDB();
    const tx    = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req   = store.get(key);
    return new Promise((res) => {
      req.onsuccess = () => {
        const result = req.result;
        if (!result) { res(null); return; }
        res(decrypt(result.value));
      };
      req.onerror = () => res(null);
    });
  } catch (e) {
    console.error('[IndexedDB] get error:', e);
    return null;
  }
};

export const idbDelete = async (key) => {
  try {
    const db    = await openDB();
    const tx    = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.delete(key);
    return new Promise((res) => {
      tx.oncomplete = () => res(true);
      tx.onerror    = () => res(false);
    });
  } catch { return false; }
};

export const idbClear = async () => {
  try {
    const db    = await openDB();
    const tx    = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).clear();
    return new Promise((res) => {
      tx.oncomplete = () => res(true);
      tx.onerror    = () => res(false);
    });
  } catch { return false; }
};

// ─── Keys ────────────────────────────────────────────────────────────────────

export const IDB_KEYS = {
  USER:        'hc_user_profile',
  TENANT:      'hc_tenant_info',
  PREFERENCES: 'hc_user_prefs',
  THEME:       'hc_theme',
};
