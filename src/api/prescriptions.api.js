import axiosInstance from './axiosInstance';

export const fetchPrescriptionsApi = (params) =>
  axiosInstance.get('/api/prescriptions', { params });

export const fetchPrescriptionApi  = (id) =>
  axiosInstance.get(`/api/prescriptions/${id}`);

export const createPrescriptionApi = (data) =>
  axiosInstance.post('/api/prescriptions', data);

export const verifyPrescriptionApi = (id, status) =>
  axiosInstance.patch(`/api/prescriptions/${id}/verify`, { status });