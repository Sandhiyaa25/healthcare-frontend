import { createSlice } from '@reduxjs/toolkit';

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: {
    list:        [],
    unreadCount: 0,
    loading:     false,
    error:       null,
  },
  reducers: {
    // ── Fetch list ───────────────────────────────────────────────────
    fetchNotificationsRequest: (state, _action) => {
      state.loading = true;
      state.error   = null;
    },
    fetchNotificationsSuccess: (state, { payload }) => {
      state.loading     = false;
      state.list        = payload.list        ?? state.list;
      state.unreadCount = payload.unreadCount ?? state.unreadCount;
    },
    fetchNotificationsFailure: (state) => {
      state.loading = false;
    },

    // ── Unread count (from polling) ───────────────────────────────────
    fetchUnreadCountSuccess: (state, { payload }) => {
      state.unreadCount = payload;
    },

    // ── Mark single read ─────────────────────────────────────────────
    markReadRequest: (_state, _action) => {
      // handled by saga
    },
    markReadSuccess: (state, { payload: id }) => {
      state.list = state.list.map((n) =>
        n.id === id ? { ...n, read_at: new Date().toISOString() } : n
      );
      state.unreadCount = Math.max(0, state.unreadCount - 1);
    },

    // ── Mark all read ─────────────────────────────────────────────────
    markAllReadRequest: (_state) => {
      // handled by saga
    },
    markAllReadSuccess: (state) => {
      const now = new Date().toISOString();
      state.list        = state.list.map((n) => ({ ...n, read_at: n.read_at ?? now }));
      state.unreadCount = 0;
    },

    // ── Polling control (no state change — just saga triggers) ────────
    startPolling: () => {},
    stopPolling:  () => {},
  },
});

export const {
  fetchNotificationsRequest,
  fetchNotificationsSuccess,
  fetchNotificationsFailure,
  fetchUnreadCountSuccess,
  markReadRequest,
  markReadSuccess,
  markAllReadRequest,
  markAllReadSuccess,
  startPolling,
  stopPolling,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;