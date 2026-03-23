import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  list:       [],
  item:       null,
  loading:    false,
  saving:     false,
  error:      null,
  saveError:  null,
  pagination: { page: 1, perPage: 5, total: 0 },
};

const prescriptionsSlice = createSlice({
  name: 'prescriptions',
  initialState,
  reducers: {
    // Fetch list
    fetchPrescriptionsRequest: (state) => {
      state.loading = true;
      state.error   = null;
    },
    fetchPrescriptionsSuccess: (state, { payload }) => {
      state.loading    = false;
      state.list       = payload.data || [];
      state.pagination = payload.pagination || state.pagination;
    },
    fetchPrescriptionsFailure: (state, { payload }) => {
      state.loading = false;
      state.error   = payload;
    },

    // Fetch single
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

    // Create
    createPrescriptionRequest: (state) => {
      state.saving    = true;
      state.saveError = null;
    },
    createPrescriptionSuccess: (state, { payload }) => {
      state.saving = false;
      state.list   = [payload, ...state.list];
    },
    createPrescriptionFailure: (state, { payload }) => {
      state.saving    = false;
      state.saveError = payload;
    },

    // Verify
    verifyPrescriptionRequest: (state) => {
      state.saving    = true;
      state.saveError = null;
    },
    verifyPrescriptionSuccess: (state, { payload }) => {
      state.saving = false;
      state.list   = state.list.map((rx) =>
        rx.id === payload.id ? payload : rx
      );
      if (state.item?.id === payload.id) state.item = payload;
    },
    verifyPrescriptionFailure: (state, { payload }) => {
      state.saving    = false;
      state.saveError = payload;
    },

    clearItem:      (state) => { state.item = null; },
    clearSaveError: (state) => { state.saveError = null; },
    clearError:     (state) => { state.error = null; },
  },
});

export const {
  fetchPrescriptionsRequest, fetchPrescriptionsSuccess, fetchPrescriptionsFailure,
  fetchPrescriptionRequest,  fetchPrescriptionSuccess,  fetchPrescriptionFailure,
  createPrescriptionRequest, createPrescriptionSuccess, createPrescriptionFailure,
  verifyPrescriptionRequest, verifyPrescriptionSuccess, verifyPrescriptionFailure,
  clearItem, clearSaveError, clearError,
} = prescriptionsSlice.actions;

export default prescriptionsSlice.reducer;