import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  list:        [],
  item:        null,
  loading:     false,
  saving:      false,
  error:       null,
  saveError:   null,
  pagination:  { page: 1, perPage: 5, total: 0 },
  cache:       {},        // { [page]: { list, pagination } }
  currentPage: 1,
  prefetching: false,
};

const prescriptionsSlice = createSlice({
  name: 'prescriptions',
  initialState,
  reducers: {
    // ── Fetch list ────────────────────────────────────────────────────────────
    fetchPrescriptionsRequest: (state) => {
      state.loading = true;
      state.error   = null;
    },
    // payload shape: { data: [...], pagination: { page, perPage, total } }
    fetchPrescriptionsSuccess: (state, { payload }) => {
      state.loading = false;

      const list       = payload.data       || [];
      const pagination = payload.pagination || state.pagination;

      state.list       = list;
      state.pagination = pagination;

      // BUG FIX: Store as { list, pagination } object — not a flat array.
      // The original code stored a flat array but setCurrentPage expected an object,
      // meaning pagination was never restored when navigating back to a cached page.
      const page = pagination?.page ?? state.currentPage;
      state.cache[page] = { list, pagination };
    },
    fetchPrescriptionsFailure: (state, { payload }) => {
      state.loading = false;
      state.error   = payload;
    },

    // ── Prefetch (background — never touches state.list) ─────────────────────
    prefetchPrescriptionsRequest: (state) => {
      state.prefetching = true;
    },
    prefetchPrescriptionsSuccess: (state, { payload }) => {
      state.prefetching = false;

      const list       = payload.data       || [];
      const pagination = payload.pagination || {};

      // Resolve page: prefer pagination.page, then the explicit page key the saga attaches
      const page = pagination?.page ?? payload?.page;

      if (page) {
        state.cache[page] = { list, pagination };
      }
    },

    // ── Page navigation ───────────────────────────────────────────────────────
    // BUG FIX: Original restored only state.list from cache (flat array).
    // Must also restore state.pagination so the paginator renders correctly.
    setCurrentPage: (state, { payload }) => {
      state.currentPage = payload;

      if (state.cache[payload]) {
        state.list       = state.cache[payload].list;
        state.pagination = state.cache[payload].pagination;
        state.loading    = false;
      }
    },

    // ── Fetch single ──────────────────────────────────────────────────────────
    fetchPrescriptionRequest: (state) => {
      state.loading = true;
      state.error   = null;
      state.item    = null;
    },
    fetchPrescriptionSuccess: (state, { payload }) => {
      state.loading = false;
      state.item    = payload;
    },
    fetchPrescriptionFailure: (state, { payload }) => {
      state.loading = false;
      state.error   = payload;
    },

    // ── Create ────────────────────────────────────────────────────────────────
    createPrescriptionRequest: (state) => {
      state.saving    = true;
      state.saveError = null;
    },
    createPrescriptionSuccess: (state, { payload }) => {
      state.cache = {};
      state.saving = false;
      if (payload) {
        state.list = [payload, ...state.list];
      }
    },
    createPrescriptionFailure: (state, { payload }) => {
      state.saving    = false;
      state.saveError = payload;
    },

    // ── Verify ────────────────────────────────────────────────────────────────
    verifyPrescriptionRequest: (state) => {
      state.saving    = true;
      state.saveError = null;
    },
    verifyPrescriptionSuccess: (state, { payload }) => {
      state.saving = false;
      state.list   = state.list.map((rx) => (rx.id === payload.id ? payload : rx));
      if (state.item?.id === payload.id) state.item = payload;
    },
    verifyPrescriptionFailure: (state, { payload }) => {
      state.saving    = false;
      state.saveError = payload;
    },

    // ── Misc ──────────────────────────────────────────────────────────────────
    clearItem:      (state) => { state.item = null; },
    clearSaveError: (state) => { state.saveError = null; },
    clearError:     (state) => { state.error = null; },
  },
});

export const {
  fetchPrescriptionsRequest, fetchPrescriptionsSuccess, fetchPrescriptionsFailure,
  prefetchPrescriptionsRequest, prefetchPrescriptionsSuccess,
  setCurrentPage,
  fetchPrescriptionRequest,  fetchPrescriptionSuccess,  fetchPrescriptionFailure,
  createPrescriptionRequest, createPrescriptionSuccess, createPrescriptionFailure,
  verifyPrescriptionRequest, verifyPrescriptionSuccess, verifyPrescriptionFailure,
  clearItem, clearSaveError, clearError,
} = prescriptionsSlice.actions;

export default prescriptionsSlice.reducer;