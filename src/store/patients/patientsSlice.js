import { createSlice } from '@reduxjs/toolkit';

const patientsSlice = createSlice({
  name: 'patients',
  initialState: {
    list:       [],
    item:       null,
    loading:    false,
    saving:     false,
    error:      null,
    pagination: {},
  },
  reducers: {
    fetchPatientsRequest:  (state)              => { state.loading = true;  state.error = null; },
    fetchPatientsSuccess:  (state, { payload }) => { state.loading = false; state.list = payload.data || payload; state.pagination = payload.pagination || {}; },
    fetchPatientsFailure:  (state, { payload }) => { state.loading = false; state.error = payload; },

    fetchPatientRequest:   (state)              => { state.loading = true;  state.error = null; },
    fetchPatientSuccess:   (state, { payload }) => { state.loading = false; state.item = payload; },
    fetchPatientFailure:   (state, { payload }) => { state.loading = false; state.error = payload; },

    createPatientRequest:  (state)              => { state.saving = true;   state.error = null; },
    createPatientSuccess:  (state, { payload }) => { state.saving = false;  state.list = [payload, ...state.list]; },
    createPatientFailure:  (state, { payload }) => { state.saving = false;  state.error = payload; },

    updatePatientRequest:  (state)              => { state.saving = true;   state.error = null; },
    updatePatientSuccess:  (state, { payload }) => {
      state.saving = false;
      state.list   = state.list.map((p) => p.id === payload.id ? payload : p);
      state.item   = payload;
    },
    updatePatientFailure:  (state, { payload }) => { state.saving = false;  state.error = payload; },

    deletePatientRequest:  (state)              => { state.saving = true;   state.error = null; },
    deletePatientSuccess:  (state, { payload }) => { state.saving = false;  state.list = state.list.filter((p) => p.id !== payload); },
    deletePatientFailure:  (state, { payload }) => { state.saving = false;  state.error = payload; },

    clearItem:   (state) => { state.item = null; },
    clearError:  (state) => { state.error = null; },
  },
});

export const {
  fetchPatientsRequest, fetchPatientsSuccess, fetchPatientsFailure,
  fetchPatientRequest,  fetchPatientSuccess,  fetchPatientFailure,
  createPatientRequest, createPatientSuccess, createPatientFailure,
  updatePatientRequest, updatePatientSuccess, updatePatientFailure,
  deletePatientRequest, deletePatientSuccess, deletePatientFailure,
  clearItem, clearError,
} = patientsSlice.actions;

export default patientsSlice.reducer;
