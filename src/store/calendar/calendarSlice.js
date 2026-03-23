import { createSlice } from '@reduxjs/toolkit';

const calendarSlice = createSlice({
  name: 'calendar',
  initialState: {
    events:       [],
    dayEvents:    [],
    loading:      false,
    dayLoading:   false,
    error:        null,
    currentMonth: null,
    currentYear:  null,
    selectedDate: null,
    filters: {
      doctorId: null,
      status:   null,
    },
  },
  reducers: {
    fetchEventsRequest: (state) => {
      state.loading = true;
      state.error   = null;
    },
    fetchEventsSuccess: (state, { payload }) => {
      state.loading = false;
      state.events  = payload.events || [];
      state.currentMonth = payload.month;
      state.currentYear  = payload.year;
    },
    fetchEventsFailure: (state, { payload }) => {
      state.loading = false;
      state.error   = payload;
    },

    fetchDayEventsRequest: (state) => {
      state.dayLoading = true;
    },
    fetchDayEventsSuccess: (state, { payload }) => {
      state.dayLoading = false;
      state.dayEvents  = payload;
    },
    fetchDayEventsFailure: (state) => {
      state.dayLoading = false;
      state.dayEvents  = [];
    },

    setSelectedDate: (state, { payload }) => {
      state.selectedDate = payload;
    },
    setFilters: (state, { payload }) => {
      state.filters = { ...state.filters, ...payload };
    },
    clearEvents: (state) => {
      state.events    = [];
      state.dayEvents = [];
      state.error     = null;
    },
  },
});

export const {
  fetchEventsRequest, fetchEventsSuccess, fetchEventsFailure,
  fetchDayEventsRequest, fetchDayEventsSuccess, fetchDayEventsFailure,
  setSelectedDate, setFilters, clearEvents,
} = calendarSlice.actions;

export default calendarSlice.reducer;