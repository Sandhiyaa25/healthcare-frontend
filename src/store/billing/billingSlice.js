import { createSlice } from '@reduxjs/toolkit';

const billingSlice = createSlice({
  name: 'billing',
  initialState: {
    list:        [],
    item:        null,
    summary:     [],
    loading:     false,
    itemLoading: false,
    saving:      false,
    paying:      false,
    error:       null,
    itemError:   null,
    pagination:  {},
  },
  reducers: {
    // ─── FETCH LIST ───────────────────────────────────────────────────────────
    fetchInvoicesRequest: (state) => {
      state.loading = true;
      state.error   = null;
    },
    fetchInvoicesSuccess: (state, { payload }) => {
      state.loading    = false;
      state.list       = payload.invoices || payload.data || payload;
      state.pagination = payload.pagination || {};
    },
    fetchInvoicesFailure: (state, { payload }) => {
      state.loading = false;
      state.error   = payload;
    },

    // ─── FETCH SINGLE ─────────────────────────────────────────────────────────
    fetchInvoiceRequest: (state) => {
      state.itemLoading = true;
      state.itemError   = null;
    },
    fetchInvoiceSuccess: (state, { payload }) => {
      state.itemLoading = false;
      state.item        = payload;
    },
    fetchInvoiceFailure: (state, { payload }) => {
      state.itemLoading = false;
      state.itemError   = payload;
    },

    // ─── FETCH SUMMARY ────────────────────────────────────────────────────────
    fetchSummaryRequest: () => {},
    fetchSummarySuccess: (state, { payload }) => {
      state.summary = payload;
    },
    fetchSummaryFailure: () => {},

    // ─── CREATE ───────────────────────────────────────────────────────────────
    createInvoiceRequest: (state) => {
      state.saving = true;
      state.error  = null;
    },
    // createInvoiceSuccess: (state, { payload }) => {
    //   state.saving = false;
    //   state.list   = [payload, ...state.list];
    // },

    createInvoiceSuccess: (state, { payload }) => {
  state.saving = false;
  if (payload) {                          // ← guard against null (offline-queued)
    state.list = [payload, ...state.list];
  }
},

    createInvoiceFailure: (state, { payload }) => {
      state.saving = false;
      state.error  = payload;
    },

    // ─── RECORD PAYMENT ───────────────────────────────────────────────────────
    paymentRequest: (state) => {
      state.paying = true;
      state.error  = null;
    },
    paymentSuccess: (state, { payload }) => {
      state.paying = false;
      state.item   = payload;
    },
    paymentFailure: (state, { payload }) => {
      state.paying = false;
      state.error  = payload;
    },

    // ─── UTILS ────────────────────────────────────────────────────────────────
    clearItem: (state) => {
      state.item      = null;
      state.itemError = null;
    },
    clearError: (state) => {
      state.error     = null;
      state.itemError = null;
    },
  },
});

export const {
  fetchInvoicesRequest, fetchInvoicesSuccess, fetchInvoicesFailure,
  fetchInvoiceRequest,  fetchInvoiceSuccess,  fetchInvoiceFailure,
  fetchSummaryRequest,  fetchSummarySuccess,  fetchSummaryFailure,
  createInvoiceRequest, createInvoiceSuccess, createInvoiceFailure,
  paymentRequest,       paymentSuccess,       paymentFailure,
  clearItem, clearError,
} = billingSlice.actions;

export default billingSlice.reducer;
