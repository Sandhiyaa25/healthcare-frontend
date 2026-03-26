import { createSlice } from '@reduxjs/toolkit';

const appointmentsSlice = createSlice({
  name: 'appointments',
  initialState: {
    list:        [],
    item:        null,
    loading:     false,
    saving:      false,
    cancelling:  false,
    error:       null,
    pagination:  {},
    conflict:    null,
    cache:       {},        // { [page]: { list, pagination } }
    currentPage: 1,
    prefetching: false,
  },

  reducers: {
    // ── Fetch list ────────────────────────────────────────────────────────────
    fetchRequest: (state) => {
      state.loading = true;
      state.error   = null;
    },
    // payload shape from API: { appointments: [...], pagination: { current_page, last_page, ... } }
    // payload shape from cache hit (passed through by saga): same shape already stored in cache
    fetchSuccess: (state, { payload }) => {
      state.loading = false;

      const list       = payload?.appointments ?? [];
      const pagination = payload?.pagination   ?? {};

      state.list       = list;
      state.pagination = pagination;

      // Write through to cache so subsequent navigations are instant
      const page = pagination?.current_page ?? state.currentPage;
      state.cache[page] = { list, pagination };
    },
    fetchFailure: (state, { payload }) => {
      state.loading = false;
      state.error   = payload;
    },

    // ── Prefetch (background — never touches state.list) ──────────────────────
    prefetchRequest: (state) => {
      state.prefetching = true;
    },
    prefetchSuccess: (state, { payload }) => {
      state.prefetching = false;

      const list       = payload?.appointments ?? [];
      const pagination = payload?.pagination   ?? {};
      const page       = pagination?.current_page ?? payload?.page;

      if (page) {
        state.cache[page] = { list, pagination };
      }
    },

    // ── Page navigation ───────────────────────────────────────────────────────
    // When the saga already has the data in cache the slice applies it here so
    // the UI updates synchronously before the saga even runs.
    setCurrentPage: (state, { payload }) => {
      state.currentPage = payload;

      if (state.cache[payload]) {
        state.list       = state.cache[payload].list;
        state.pagination = state.cache[payload].pagination;
        state.loading    = false;
      }
    },

    // ── Fetch single ──────────────────────────────────────────────────────────
    fetchOneRequest: (state) => {
      state.loading = true;
      state.error   = null;
    },
    fetchOneSuccess: (state, { payload }) => {
      state.loading = false;
      state.item    = payload;
    },
    fetchOneFailure: (state, { payload }) => {
      state.loading = false;
      state.error   = payload;
    },

    // ── Create ────────────────────────────────────────────────────────────────
    createRequest: (state) => {
      state.saving   = true;
      state.error    = null;
      state.conflict = null;
    },
    createSuccess: (state, { payload }) => {
      state.saving = false;
      state.cache  = {};
      state.error  = null;
      if (payload?.id) {
        state.list = [payload, ...state.list];
      }
    },
    createFailure: (state, { payload }) => {
      state.saving = false;
      state.error  = payload;
    },

    // ── Update ────────────────────────────────────────────────────────────────
    updateRequest: (state) => {
      state.saving   = true;
      state.error    = null;
      state.conflict = null;
    },
    updateSuccess: (state, { payload }) => {
      state.saving = false;
      state.cache  = {};
      state.error  = null;
      if (payload?.id) {
        state.list = state.list.map((a) => (a.id === payload.id ? payload : a));
        state.item = payload;
      }
    },
    updateFailure: (state, { payload }) => {
      state.saving = false;
      state.error  = payload;
    },

    // ── Cancel ────────────────────────────────────────────────────────────────
    cancelRequest: (state) => {
      state.cancelling = true;
      state.error      = null;
    },
    cancelSuccess: (state, { payload }) => {
      state.cancelling = false;
      state.cache      = {};
      state.error      = null;
      if (payload?.id) {
        state.list = state.list.map((a) => (a.id === payload.id ? payload : a));
        if (state.item?.id === payload.id) state.item = payload;
      }
    },
    cancelFailure: (state, { payload }) => {
      state.cancelling = false;
      state.error      = payload;
    },

    // ── Status update ─────────────────────────────────────────────────────────
    statusRequest: (state) => {
      state.saving = true;
      state.error  = null;
    },
    statusSuccess: (state, { payload }) => {
      state.saving = false;
      state.list   = state.list.map((a) => (a.id === payload.id ? payload : a));
      state.item   = payload;
    },
    statusFailure: (state, { payload }) => {
      state.saving = false;
      state.error  = payload;
    },

    // ── Misc ──────────────────────────────────────────────────────────────────
    setConflict:   (state, { payload }) => { state.conflict = payload; },
    clearConflict: (state)              => { state.conflict = null; },
    clearItem:     (state)              => { state.item = null; },
    clearError:    (state)              => { state.error = null; },
  },
});

export const {
  fetchRequest, fetchSuccess, fetchFailure,
  prefetchRequest, prefetchSuccess,
  setCurrentPage,
  fetchOneRequest, fetchOneSuccess, fetchOneFailure,
  createRequest, createSuccess, createFailure,
  updateRequest, updateSuccess, updateFailure,
  cancelRequest, cancelSuccess, cancelFailure,
  statusRequest, statusSuccess, statusFailure,
  setConflict, clearConflict,
  clearItem, clearError,
} = appointmentsSlice.actions;

export default appointmentsSlice.reducer;