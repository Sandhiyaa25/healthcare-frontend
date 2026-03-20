import { createSlice } from '@reduxjs/toolkit';

const appointmentsSlice = createSlice({
  name: 'appointments',
  initialState: {
    list: [],
    item: null,
    loading: false,
    saving: false,
    cancelling: false,
    error: null,
    pagination: {},
    conflict: null,
  },
  reducers: {
    // ── Fetch list ──────────────────────────────────────────────────────────
    fetchRequest: (state) => { state.loading = true; state.error = null; },
    fetchSuccess: (state, { payload }) => {
      state.loading = false;
      state.list = payload?.appointments ?? payload?.data ?? payload ?? [];
      state.pagination = payload?.pagination ?? {};
    },
    fetchFailure: (state, { payload }) => { state.loading = false; state.error = payload; },

    // ── Fetch single ────────────────────────────────────────────────────────
    fetchOneRequest: (state) => { state.loading = true; state.error = null; },
    fetchOneSuccess: (state, { payload }) => { state.loading = false; state.item = payload; },
    fetchOneFailure: (state, { payload }) => { state.loading = false; state.error = payload; },

    // ── Create ──────────────────────────────────────────────────────────────
    createRequest: (state) => { state.saving = true; state.error = null; state.conflict = null; },
    createSuccess: (state, { payload }) => {
      state.saving = false;
      state.error = null;
      if (payload?.id) {
        state.list = [payload, ...state.list];
      }
    },
    createFailure: (state, { payload }) => { state.saving = false; state.error = payload; },

    // ── Update ──────────────────────────────────────────────────────────────
    updateRequest: (state) => { state.saving = true; state.error = null; state.conflict = null; },
    updateSuccess: (state, { payload }) => {
      state.saving = false;
      state.error = null;
      state.list = state.list.map((a) => (a.id === payload.id ? payload : a));
      state.item = payload;
    },
    updateFailure: (state, { payload }) => { state.saving = false; state.error = payload; },

    // ── Cancel ──────────────────────────────────────────────────────────────
    cancelRequest: (state) => { state.cancelling = true; state.error = null; },
    // FIND cancelSuccess reducer and REPLACE:
    cancelSuccess: (state, { payload }) => {
      state.cancelling = false;
      state.error = null;
      // payload may be null (cancel returns data:null from backend)
      // Just update the status in the list directly by id
      if (payload && payload.id) {
        // If backend returned the updated appointment object
        state.list = state.list.map((a) =>
          a.id === payload.id ? payload : a
        );
        if (state.item?.id === payload.id) state.item = payload;
      }
    },
    cancelFailure: (state, { payload }) => { state.cancelling = false; state.error = payload; },

    // ── Status update ───────────────────────────────────────────────────────
    statusRequest: (state) => { state.saving = true; state.error = null; },
    statusSuccess: (state, { payload }) => {
      state.saving = false;
      state.list = state.list.map((a) => (a.id === payload.id ? payload : a));
      state.item = payload;
    },
    statusFailure: (state, { payload }) => { state.saving = false; state.error = payload; },

    // ── Conflict / misc ─────────────────────────────────────────────────────
    setConflict: (state, { payload }) => { state.conflict = payload; },
    clearConflict: (state) => { state.conflict = null; },
    clearItem: (state) => { state.item = null; },
    clearError: (state) => { state.error = null; },
  },
});

export const {
  fetchRequest, fetchSuccess, fetchFailure,
  fetchOneRequest, fetchOneSuccess, fetchOneFailure,
  createRequest, createSuccess, createFailure,
  updateRequest, updateSuccess, updateFailure,
  cancelRequest, cancelSuccess, cancelFailure,
  statusRequest, statusSuccess, statusFailure,
  setConflict, clearConflict,
  clearItem, clearError,
} = appointmentsSlice.actions;

export default appointmentsSlice.reducer;
