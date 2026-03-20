import { createSlice } from '@reduxjs/toolkit';

const recordsSlice = createSlice({
    name: 'records',
    initialState: { list: [], item: null, loading: false, saving: false, error: null, pagination: {} },
    reducers: {
        fetchRequest: (state) => { state.loading = true; state.error = null; },
        fetchSuccess: (state, { payload }) => { state.loading = false; state.list = payload.data || payload; state.pagination = payload.pagination || {}; },
        fetchFailure: (state, { payload }) => { state.loading = false; state.error = payload; },
        fetchOneSuccess: (state, { payload }) => { state.item = payload; },
        clearItem: (state) => { state.item = null; },

        // ── Create ────────────────────────────────────────────────────────────
        createRequest: (state) => { state.saving = true; state.error = null; },
        createSuccess: (state, { payload }) => { state.saving = false; state.list = [payload, ...state.list]; },
        createFailure: (state, { payload }) => { state.saving = false; state.error = payload; },
    },
});

export const {
    fetchRequest, fetchSuccess, fetchFailure, fetchOneSuccess, clearItem,
    createRequest, createSuccess, createFailure,
} = recordsSlice.actions;

export default recordsSlice.reducer;
