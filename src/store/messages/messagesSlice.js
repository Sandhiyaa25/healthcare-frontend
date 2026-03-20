import { createSlice } from '@reduxjs/toolkit';

const messagesSlice = createSlice({
  name: 'messages',
  initialState: {
    threads:             {},     // keyed by appointment_id → array of messages
    activeAppointmentId: null,
    loading:             false,  // fetching thread
    sending:             false,  // sending a message
    error:               null,
    sendError:           null,
  },
  reducers: {
    // ─── FETCH THREAD ──────────────────────────────────────────────────────────
    fetchThreadRequest: (state, { payload }) => {
      state.loading             = true;
      state.activeAppointmentId = payload;
      state.error               = null;
    },
    fetchThreadSuccess: (state, { payload: { appointmentId, messages } }) => {
      state.loading                = false;
      state.threads[appointmentId] = messages;
    },
    fetchThreadFailure: (state, { payload }) => {
      state.loading = false;
      state.error   = payload;
    },

    // ─── SEND MESSAGE ──────────────────────────────────────────────────────────
    sendMessageRequest: (state) => {
      state.sending   = true;
      state.sendError = null;
    },
    sendMessageSuccess: (state, { payload: { appointmentId, messages } }) => {
      state.sending                = false;
      state.threads[appointmentId] = messages;
    },
    sendMessageFailure: (state, { payload }) => {
      state.sending   = false;
      state.sendError = payload;
    },

    // ─── UTILS ────────────────────────────────────────────────────────────────
    setActiveAppointment: (state, { payload }) => {
      state.activeAppointmentId = payload;
    },
    clearThread: (state) => {
      state.activeAppointmentId = null;
      state.error               = null;
      state.sendError           = null;
    },
    clearError: (state) => {
      state.error     = null;
      state.sendError = null;
    },
  },
});

export const {
  fetchThreadRequest, fetchThreadSuccess, fetchThreadFailure,
  sendMessageRequest, sendMessageSuccess, sendMessageFailure,
  setActiveAppointment,
  clearThread,
  clearError,
} = messagesSlice.actions;

export default messagesSlice.reducer;
