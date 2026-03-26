import axiosInstance from './axiosInstance';

export const fetchRecordsApi          = (params)     => axiosInstance.get('/api/records', { params });
export const fetchRecordsByPatientApi = (patId, p)   => axiosInstance.get(`/api/records/patient/${patId}`, { params: p });
export const fetchRecordApi           = (id)         => axiosInstance.get(`/api/records/${id}`);
export const createRecordApi          = (data)       => axiosInstance.post('/api/records', data);
export const updateRecordApi          = (id, data)   => axiosInstance.put(`/api/records/${id}`, data);