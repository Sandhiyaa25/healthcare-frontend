import axiosInstance from './axiosInstance';

export const fetchAppointmentsApi  = (p)      => axiosInstance.get('/api/appointments', { params: p });
export const fetchAppointmentApi   = (id)     => axiosInstance.get(`/api/appointments/${id}`);
export const createAppointmentApi  = (d)      => axiosInstance.post('/api/appointments', d);
export const updateAppointmentApi  = (id, d)  => axiosInstance.put(`/api/appointments/${id}`, d);

// FIX: Pass empty object {} so Axios keeps Content-Type: application/json header
export const cancelAppointmentApi  = (id)     => axiosInstance.patch(`/api/appointments/${id}/cancel`, {});

// Also fix updateStatus if you have it — same issue:
export const updateStatusApi       = (id, status) => axiosInstance.patch(`/api/appointments/${id}/status`, { status });
// ```

// ---

// ## Why This Happens
// ```
// PATCH with no body:
//   Axios sees no body → strips Content-Type header → sends plain PATCH
//   Backend JsonValidatorMiddleware checks Content-Type
//   Not application/json → returns 415 "Content-Type must be application/json"

// PATCH with {} body:
//   Axios sees body → keeps Content-Type: application/json header
//   Backend accepts it → processes the cancel → returns 200