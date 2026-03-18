import { createSlice } from '@reduxjs/toolkit';

const tenantSlice = createSlice({
  name: 'tenant',
  initialState: { info: null, loading: false, error: null },
  reducers: {
    setTenantInfo:    (state, { payload }) => { state.info = payload; },
    clearTenantInfo:  (state)             => { state.info = null; },
    tenantLoading:    (state, { payload }) => { state.loading = payload; },
    tenantError:      (state, { payload }) => { state.error = payload; },
  },
});

export const { setTenantInfo, clearTenantInfo, tenantLoading, tenantError } = tenantSlice.actions;
export default tenantSlice.reducer;
