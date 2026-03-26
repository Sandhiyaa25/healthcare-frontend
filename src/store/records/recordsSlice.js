import { createSlice } from '@reduxjs/toolkit';

const recordsSlice = createSlice({
  name: 'records',
  initialState: {
    list:       [],
    item:       null,
    loading:    false,
    saving:     false,
    error:      null,
    saveError:  null,
    pagination: { page: 1, perPage: 5, total: 0 },
  },
  reducers: {
    fetchRecordsRequest:  (state) => { state.loading = true;  state.error = null; },
    fetchRecordsSuccess:  (state, { payload }) => {
      state.loading    = false;
      state.list       = payload.data || [];
      state.pagination = payload.pagination || state.pagination;
    },
    fetchRecordsFailure:  (state, { payload }) => { state.loading = false; state.error = payload; },

    fetchRecordRequest:   (state) => { state.loading = true; state.item = null; },
    fetchRecordSuccess:   (state, { payload }) => { state.loading = false; state.item = payload; },
    fetchRecordFailure:   (state, { payload }) => { state.loading = false; state.error = payload; },

    createRecordRequest:  (state) => { state.saving = true;  state.saveError = null; },
    createRecordSuccess:  (state, { payload }) => {
      state.cache = {};
      state.saving = false;
      if (payload) {                          // ← guard against null (offline-queued)
      state.list   = [payload, ...state.list];
      }
    },
    createRecordFailure:  (state, { payload }) => { state.saving = false; state.saveError = payload; },

    updateRecordRequest:  (state) => { state.saving = true;  state.saveError = null; },
    updateRecordSuccess:  (state, { payload }) => {
      state.cache = {};
      state.saving = false;
      state.list   = state.list.map((r) => r.id === payload.id ? payload : r);
      if (state.item?.id === payload.id) state.item = payload;
    },
    updateRecordFailure:  (state, { payload }) => { state.saving = false; state.saveError = payload; },

    clearItem:      (state) => { state.item = null; },
    clearSaveError: (state) => { state.saveError = null; },
    clearError:     (state) => { state.error = null; },
  },
});

export const {
  fetchRecordsRequest, fetchRecordsSuccess, fetchRecordsFailure,
  fetchRecordRequest,  fetchRecordSuccess,  fetchRecordFailure,
  createRecordRequest, createRecordSuccess, createRecordFailure,
  updateRecordRequest, updateRecordSuccess, updateRecordFailure,
  clearItem, clearSaveError, clearError,
} = recordsSlice.actions;

export default recordsSlice.reducer;