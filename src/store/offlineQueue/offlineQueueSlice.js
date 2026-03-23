/**
 * offlineQueueSlice.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Redux state for the offline action queue.
 * Manages: pending count, syncing state, last sync time, error tracking.
 */
import { createSlice } from '@reduxjs/toolkit';

const offlineQueueSlice = createSlice({
  name: 'offlineQueue',
  initialState: {
    // Core state
    isOnline:      navigator.onLine,
    pendingCount:  0,
    items:         [],        // decrypted items for display only

    // Sync state
    isSyncing:     false,
    lastSyncedAt:  null,
    syncedCount:   0,         // total successfully synced this session

    // Banner state
    showBanner:    false,
    bannerMode:    'idle',    // 'offline' | 'syncing' | 'synced' | 'error'
    bannerMessage: '',

    // Error tracking
    failedIds:     [],
  },
  reducers: {

    // ── Network status ───────────────────────────────────────────────────────
    setOnline:  (state) => { state.isOnline = true;  },
    setOffline: (state) => { state.isOnline = false; },

    // ── Queue action (triggers saga) ─────────────────────────────────────────
    // Dispatched by any component that wants offline support
    queueAction: (_state, _action) => {
      // Handled by saga — no state change here
      // payload: { id, action, label, endpoint, method, payload }
    },

    // ── Count / items refresh ────────────────────────────────────────────────
    setPendingCount: (state, { payload }) => {
      state.pendingCount = payload;
    },
    setQueueItems: (state, { payload }) => {
      state.items        = payload;
      state.pendingCount = payload.length;
    },

    // ── Sync lifecycle ───────────────────────────────────────────────────────
    syncStart: (state) => {
      state.isSyncing     = true;
      state.bannerMode    = 'syncing';
      state.showBanner    = true;
      state.bannerMessage = `Syncing ${state.pendingCount} queued action${state.pendingCount !== 1 ? 's' : ''}…`;
    },
    syncItemSuccess: (state, { payload: id }) => {
      state.items        = state.items.filter((i) => i.id !== id);
      state.pendingCount = state.items.length;
      state.syncedCount += 1;
      state.failedIds    = state.failedIds.filter((fid) => fid !== id);
    },
    syncItemFailed: (state, { payload: id }) => {
      if (!state.failedIds.includes(id)) state.failedIds.push(id);
    },
    syncComplete: (state) => {
      state.isSyncing    = false;
      state.lastSyncedAt = Date.now();
      if (state.failedIds.length === 0 && state.pendingCount === 0) {
        state.bannerMode    = 'synced';
        state.bannerMessage = `All actions synced successfully`;
      } else if (state.failedIds.length > 0) {
        state.bannerMode    = 'error';
        state.bannerMessage = `${state.failedIds.length} action${state.failedIds.length !== 1 ? 's' : ''} failed to sync`;
      }
    },

    // ── Banner control ───────────────────────────────────────────────────────
    showOfflineBanner: (state) => {
      state.showBanner    = true;
      state.bannerMode    = 'offline';
      state.bannerMessage = 'You\'re offline. Actions will sync when connected.';
    },
    hideBanner: (state) => {
      state.showBanner = false;
    },

    // ── Drain trigger (saga watches this) ───────────────────────────────────
    drainQueue: (_state) => {
      // Handled entirely by saga
    },

    // ── Load queue from IDB into Redux (on app start) ────────────────────────
    loadQueueRequest:  (_state) => {},
    loadQueueSuccess:  (state, { payload }) => {
      state.items        = payload;
      state.pendingCount = payload.length;
      if (payload.length > 0 && !state.isOnline) {
        state.showBanner    = true;
        state.bannerMode    = 'offline';
        state.bannerMessage = `${payload.length} action${payload.length !== 1 ? 's' : ''} queued offline`;
      }
    },
  },
});

export const {
  setOnline, setOffline,
  queueAction,
  setPendingCount, setQueueItems,
  syncStart, syncItemSuccess, syncItemFailed, syncComplete,
  showOfflineBanner, hideBanner,
  drainQueue,
  loadQueueRequest, loadQueueSuccess,
} = offlineQueueSlice.actions;

export default offlineQueueSlice.reducer;