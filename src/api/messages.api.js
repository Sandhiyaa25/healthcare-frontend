import axiosInstance from './axiosInstance';

export const fetchMessagesApi = (appointmentId) =>
  axiosInstance.get(`/api/messages/${appointmentId}`);

export const sendMessageApi = (data) =>
  axiosInstance.post('/api/messages', data);
