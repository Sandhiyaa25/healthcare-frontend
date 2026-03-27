import { createSlice } from '@reduxjs/toolkit';

const patientsSlice = createSlice({
  name: 'patients',
  // initialState: {
  //   list:       [],
  //   item:       null,
  //   loading:    false,
  //   saving:     false,
  //   error:      null,
  //   pagination: {},
  // },
    initialState: {
    list:        [],
    item:        null,
    loading:     false,
    saving:      false,
    error:       null,
    pagination:  {},
    cache:       {},        // { [page]: [...] }
    currentPage: 1,
    prefetching: false,
  },

  reducers: {
    // ─── FETCH LIST ───────────────────────────────────────────────────────────
    // fetchPatientsRequest: (state) => {
    //   state.loading = true;
    //   state.error   = null;
    // },
    // fetchPatientsSuccess: (state, { payload }) => {
    //   state.loading    = false;
    //   // payload = { patients: [...], pagination: {...} }  ← from backend fix
    //   // OR payload = { data: [...], pagination: {...} }   ← legacy shape
    //   // OR payload = [...]                                ← raw array fallback
    //   state.list       = payload?.patients ?? payload?.data ?? (Array.isArray(payload) ? payload : []);
    //   state.pagination = payload?.pagination ?? {};
    // },
    // fetchPatientsFailure: (state, { payload }) => {
    //   state.loading = false;
    //   state.error   = payload;
    // },
    fetchPatientsRequest: (state) => {
      state.loading = true;
      state.error   = null;
    },
    fetchPatientsSuccess: (state, { payload }) => {
      state.loading    = false;
      const list       = payload?.patients ?? payload?.data ?? (Array.isArray(payload) ? payload : []);
      const pagination = payload?.pagination ?? {};
      state.list       = list;
      state.pagination = pagination;
      const page       = pagination?.current_page ?? state.currentPage;
      state.cache[page] = { list, pagination };
    },
    fetchPatientsFailure: (state, { payload }) => {
      state.loading = false;
      state.error   = payload;
    },

    // ─── PREFETCH ─────────────────────────────────────────────────────────────
    prefetchPatientsRequest: (state) => {
      state.prefetching = true;
    },
    prefetchPatientsSuccess: (state, { payload }) => {
      state.prefetching = false;
      const list       = payload?.patients ?? payload?.data ?? (Array.isArray(payload) ? payload : []);
      const pagination = payload?.pagination ?? {};
      const page       = pagination?.current_page ?? payload?.page;
      if (page) state.cache[page] = { list, pagination };
    },

    // ─── PAGE NAV ─────────────────────────────────────────────────────────────
    setCurrentPage: (state, { payload }) => {
      state.currentPage = payload;
      if (state.cache[payload]) {
        state.list       = state.cache[payload].list;
        state.pagination = state.cache[payload].pagination;
        state.loading    = false;
      }
    },

    // ─── FETCH SINGLE ─────────────────────────────────────────────────────────
    fetchPatientRequest: (state) => {
      state.loading = true;
      state.error   = null;
    },
    fetchPatientSuccess: (state, { payload }) => {
      state.loading = false;
      state.item    = payload ?? null;
    },
    fetchPatientFailure: (state, { payload }) => {
      state.loading = false;
      state.error   = payload;
    },

    // ─── CREATE ───────────────────────────────────────────────────────────────
    createPatientRequest: (state) => {
      state.saving = true;
      state.error  = null;
    },
    createPatientSuccess: (state, { payload }) => {
      state.cache = {};
      state.saving = false;
      state.error  = null;
      // Only prepend to list if payload is a valid patient object with an id
      if (payload && payload.id) {
        state.list = [payload, ...state.list];
      }
    },
    createPatientFailure: (state, { payload }) => {
      state.saving = false;
      state.error  = payload;
    },

    // ─── UPDATE ───────────────────────────────────────────────────────────────
    updatePatientRequest: (state) => {
      state.saving = true;
      state.error  = null;
    },
    updatePatientSuccess: (state, { payload }) => {
      state.cache = {};
      state.saving = false;
      state.error  = null;
      if (payload && payload.id) {
        state.list = state.list.map((p) => p.id === payload.id ? payload : p);
        state.item = payload;
      }
    },
    updatePatientFailure: (state, { payload }) => {
      state.saving = false;
      state.error  = payload;
    },

    // ─── DELETE ───────────────────────────────────────────────────────────────
    deletePatientRequest: (state) => {
      state.saving = true;
      state.error  = null;
    },
    deletePatientSuccess: (state, { payload }) => {
      state.cache = {};
      state.saving = false;
      state.error  = null;
      // payload = deleted patient id (number)
      if (payload != null) {
        state.list = state.list.filter((p) => p.id !== payload);
      }
    },
    deletePatientFailure: (state, { payload }) => {
      state.saving = false;
      state.error  = payload;
    },

    // ─── UTILS ────────────────────────────────────────────────────────────────
    clearItem:  (state) => { state.item  = null; },
    clearError: (state) => { state.error = null; },
    clearCache: (state) => { state.cache = {}; },
  },
});

// export const {
//   fetchPatientsRequest, fetchPatientsSuccess, fetchPatientsFailure,
//   fetchPatientRequest,  fetchPatientSuccess,  fetchPatientFailure,
//   createPatientRequest, createPatientSuccess, createPatientFailure,
//   updatePatientRequest, updatePatientSuccess, updatePatientFailure,
//   deletePatientRequest, deletePatientSuccess, deletePatientFailure,
//   clearItem, clearError,
// } = patientsSlice.actions;
export const {
  fetchPatientsRequest, fetchPatientsSuccess, fetchPatientsFailure,
  prefetchPatientsRequest, prefetchPatientsSuccess,
  setCurrentPage,
  fetchPatientRequest,  fetchPatientSuccess,  fetchPatientFailure,
  createPatientRequest, createPatientSuccess, createPatientFailure,
  updatePatientRequest, updatePatientSuccess, updatePatientFailure,
  deletePatientRequest, deletePatientSuccess, deletePatientFailure,
  clearItem, clearError, clearCache,
} = patientsSlice.actions;

export default patientsSlice.reducer;