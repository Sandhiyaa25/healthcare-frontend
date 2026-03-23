import { createSlice } from '@reduxjs/toolkit';
import { getToken } from '../../utils/tokenStorage';

// getToken() now returns null if token is expired — safe to use here
const token = getToken();

const initialState = {
  user:            null,
  token:           token,
  isAuthenticated: !!token,  // false if token expired/missing
  loading:         false,
  error:           null,
  fieldErrors:     {},
  tenant:          null,
  csrfToken:       null,
  initialized:     false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {

    // ── App init — hydrate user from IndexedDB ────────────────────────
    hydrateUser: (state, { payload }) => {
      state.user        = payload;
      state.initialized = true;
      // Re-check token validity at hydration time
      // If token is gone (expired + cleared by getToken), mark as not authenticated
      if (!state.token) {
        state.isAuthenticated = false;
        state.user            = null; // don't keep stale user if no valid token
      }
    },

    // ── Login ─────────────────────────────────────────────────────────
    loginRequest: (state) => {
      state.loading     = true;
      state.error       = null;
      state.fieldErrors = {};
    },
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
    loginFailure: (state, { payload }) => {
      state.loading     = false;
      state.error       = payload.message;
      state.fieldErrors = payload.fields || {};
    },

    // ── Logout ────────────────────────────────────────────────────────
    logoutRequest: (state) => {
      state.loading = true;
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
    logoutFailure: (state) => {
      state.loading = false;
    },

    // ── Tenant ────────────────────────────────────────────────────────
    setTenant: (state, { payload }) => {
      state.tenant = payload;
    },

    // ── CSRF ──────────────────────────────────────────────────────────
    setCsrfToken: (state, { payload }) => {
      state.csrfToken = payload;
    },

    // ── Clear auth (force logout without API call) ────────────────────
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