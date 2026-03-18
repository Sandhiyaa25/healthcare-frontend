import axiosInstance from './axiosInstance';

export const fetchDashboardApi = () =>
  axiosInstance.get('/api/dashboard');

export const fetchDashboardAnalyticsApi = () =>
  axiosInstance.get('/api/dashboard/analytics');
