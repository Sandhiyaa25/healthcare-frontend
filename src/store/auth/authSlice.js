import { createSlice } from '@reduxjs/toolkit';
import { getToken } from '../../utils/tokenStorage';

const token = getToken();

const initialState = {
  user:            null,
  token:           token,
  isAuthenticated: !!token,
  loading:         false,
  error:           null,
  fieldErrors:     {},
  tenant:          null,
  csrfToken:       null,
  initialized:     false, // always false until hydration completes
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // App init — hydrate user from IndexedDB
    hydrateUser: (state, { payload }) => {
      state.user        = payload;
      state.initialized = true;
    },

    // Login triggers
    loginRequest:  (state) => { state.loading = true; state.error = null; state.fieldErrors = {}; },
    logoutRequest: (state) => { state.loading = true; },

    // Success
    loginSuccess: (state, { payload }) => {
      state.loading         = false;
      state.isAuthenticated = true;
      state.user            = payload.user;
      state.token           = payload.token;
      state.csrfToken       = payload.csrfToken;
      state.error           = null;
      state.fieldErrors     = {};
      state.initialized     = true;
    },
    logoutSuccess: (state) => {
      state.loading         = false;
      state.isAuthenticated = false;
      state.user            = null;
      state.token           = null;
      state.csrfToken       = null;
      state.tenant          = null;
      state.initialized     = true;
    },

    // Failure
    loginFailure: (state, { payload }) => {
      state.loading     = false;
      state.error       = payload.message;
      state.fieldErrors = payload.fields || {};
    },
    logoutFailure: (state) => { state.loading = false; },

    // Tenant
    setTenant: (state, { payload }) => { state.tenant = payload; },

    // CSRF
    setCsrfToken: (state, { payload }) => { state.csrfToken = payload; },

    clearAuth: (state) => {
      state.isAuthenticated = false;
      state.user            = null;
      state.token           = null;
      state.csrfToken       = null;
      state.tenant          = null;
      state.error           = null;
      state.fieldErrors     = {};
    },
  },
});

export const {
  hydrateUser,
  loginRequest, loginSuccess, loginFailure,
  logoutRequest, logoutSuccess, logoutFailure,
  setTenant, setCsrfToken, clearAuth,
} = authSlice.actions;

export default authSlice.reducer;
