import axiosInstance from './axiosInstance';

export const fetchAppointmentsApi  = (p) => axiosInstance.get('/api/appointments', { params: p });
export const fetchAppointmentApi   = (id) => axiosInstance.get(`/api/appointments/${id}`);
export const createAppointmentApi  = (d)  => axiosInstance.post('/api/appointments', d);
export const updateAppointmentApi  = (id, d) => axiosInstance.put(`/api/appointments/${id}`, d);
export const cancelAppointmentApi  = (id) => axiosInstance.patch(`/api/appointments/${id}/cancel`);
