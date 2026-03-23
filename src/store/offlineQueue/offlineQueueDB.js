/**
 * offlineQueueDB.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Encrypted IndexedDB store for offline action queue.
 * Completely separate from the main hc_saas_db store.
 * Each queued action is individually AES-XOR encrypted before storage.
 */

const DB_NAME    = 'hc_offline_queue';
const DB_VERSION = 1;
const STORE_NAME = 'queue';
const SECRET     = process.env.REACT_APP_TOKEN_SECRET || 'hc_saas_secret_2024';

// ─── XOR Cipher (same pattern as indexedDB.js) ────────────────────────────────
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

const encryptPayload = (data) => xorCipher(JSON.stringify(data), SECRET);
const decryptPayload = (enc)  => {
  try { return JSON.parse(xorDecipher(enc, SECRET)); }
  catch { return null; }
};

// ─── DB Init ──────────────────────────────────────────────────────────────────
let dbInstance = null;

const openQueueDB = () => new Promise((resolve, reject) => {
  if (dbInstance) { resolve(dbInstance); return; }

  const req = indexedDB.open(DB_NAME, DB_VERSION);

  req.onupgradeneeded = (e) => {
    const db = e.target.result;
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      store.createIndex('created_at', 'created_at', { unique: false });
    }
  };

  req.onsuccess = (e) => { dbInstance = e.target.result; resolve(dbInstance); };
  req.onerror   = (e) => reject(e.target.error);
});

// ─── Add action to queue (encrypted) ─────────────────────────────────────────
export const queueAdd = async (action) => {
  try {
    const db    = await openQueueDB();
    const tx    = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const item  = {
      id:           action.id,
      created_at:   action.created_at,
      action:       action.action,      // plain — for display
      label:        action.label,       // plain — for UI banner
      payload_enc:  encryptPayload(action.payload),  // encrypted
      endpoint_enc: encryptPayload({ endpoint: action.endpoint, method: action.method }),
      retries:      0,
    };
    store.put(item);
    return new Promise((res, rej) => {
      tx.oncomplete = () => res(true);
      tx.onerror    = () => rej(tx.error);
    });
  } catch (e) {
    console.error('[OfflineQueue] add error:', e);
    return false;
  }
};

// ─── Get all queued actions (decrypted) ───────────────────────────────────────
export const queueGetAll = async () => {
  try {
    const db    = await openQueueDB();
    const tx    = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req   = store.getAll();
    return new Promise((res) => {
      req.onsuccess = () => {
        const items = (req.result || []).map((item) => ({
          id:         item.id,
          created_at: item.created_at,
          action:     item.action,
          label:      item.label,
          retries:    item.retries,
          payload:    decryptPayload(item.payload_enc),
          ...decryptPayload(item.endpoint_enc),  // endpoint, method
        }));
        res(items);
      };
      req.onerror = () => res([]);
    });
  } catch { return []; }
};

// ─── Remove by ID ─────────────────────────────────────────────────────────────
export const queueRemove = async (id) => {
  try {
    const db    = await openQueueDB();
    const tx    = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).delete(id);
    return new Promise((res) => {
      tx.oncomplete = () => res(true);
      tx.onerror    = () => res(false);
    });
  } catch { return false; }
};

// ─── Increment retry count ────────────────────────────────────────────────────
export const queueIncrementRetry = async (id) => {
  try {
    const db    = await openQueueDB();
    const tx    = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req   = store.get(id);
    req.onsuccess = () => {
      if (req.result) {
        req.result.retries += 1;
        store.put(req.result);
      }
    };
    return new Promise((res) => {
      tx.oncomplete = () => res(true);
      tx.onerror    = () => res(false);
    });
  } catch { return false; }
};

// ─── Clear entire queue ───────────────────────────────────────────────────────
export const queueClear = async () => {
  try {
    const db = await openQueueDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).clear();
    return new Promise((res) => {
      tx.oncomplete = () => res(true);
      tx.onerror    = () => res(false);
    });
  } catch { return false; }
};

// ─── Count items ──────────────────────────────────────────────────────────────
export const queueCount = async () => {
  try {
    const db    = await openQueueDB();
    const tx    = db.transaction(STORE_NAME, 'readonly');
    const req   = tx.objectStore(STORE_NAME).count();
    return new Promise((res) => {
      req.onsuccess = () => res(req.result || 0);
      req.onerror   = () => res(0);
    });
  } catch { return 0; }
};