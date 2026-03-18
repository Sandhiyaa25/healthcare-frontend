import { createSlice } from '@reduxjs/toolkit';

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: { data: null, loading: false, error: null },
  reducers: {
    fetchDashboardRequest: (state)           => { state.loading = true; state.error = null; },
    fetchDashboardSuccess: (state, { payload }) => { state.loading = false; state.data = payload; },
    fetchDashboardFailure: (state, { payload }) => { state.loading = false; state.error = payload; },
  },
});

export const { fetchDashboardRequest, fetchDashboardSuccess, fetchDashboardFailure } = dashboardSlice.actions;
export default dashboardSlice.reducer;
