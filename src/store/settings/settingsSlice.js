import { createSlice } from '@reduxjs/toolkit';
const settingsSlice = createSlice({
  name: 'settings',
  initialState: { list: [], item: null, loading: false, error: null, pagination: {} },
  reducers: {
    fetchRequest:  (state)           => { state.loading = true; state.error = null; },
    fetchSuccess:  (state, { payload }) => { state.loading = false; state.list = payload.data || payload; state.pagination = payload.pagination || {}; },
    fetchFailure:  (state, { payload }) => { state.loading = false; state.error = payload; },
    fetchOneSuccess: (state, { payload }) => { state.item = payload; },
    clearItem:     (state)           => { state.item = null; },
  },
});
export const { fetchRequest, fetchSuccess, fetchFailure, fetchOneSuccess, clearItem } = settingsSlice.actions;
export default settingsSlice.reducer;
