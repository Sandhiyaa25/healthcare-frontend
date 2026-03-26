import axiosInstance from './axiosInstance';

export const fetchNotificationsApi  = (params) => axiosInstance.get('/api/notifications', { params });
// To (send empty object to preserve Content-Type header):
export const markAllReadApi = () => axiosInstance.patch('/api/notifications/read-all', {});
export const markReadApi    = (id) => axiosInstance.patch(`/api/notifications/${id}/read`, {});
export const getUnreadCountApi      = ()       => axiosInstance.get('/api/notifications/unread-count');