import axiosInstance from './axiosInstance';

export const fetchPatientsApi  = (params) => axiosInstance.get('/api/patients', { params });
export const fetchPatientApi   = (id)     => axiosInstance.get(`/api/patients/${id}`);
export const createPatientApi  = (data)   => axiosInstance.post('/api/patients', data);
export const updatePatientApi  = (id, d)  => axiosInstance.put(`/api/patients/${id}`, d);
export const deletePatientApi  = (id)     => axiosInstance.delete(`/api/patients/${id}`);
