import axiosInstance from './axiosInstance';

export const fetchCalendarEventsApi = (params) =>
  axiosInstance.get('/api/calendar', { params });

export const fetchCalendarByDateApi = (date, doctorId) =>
  axiosInstance.get(`/api/calendar/${date}`, {
    params: doctorId ? { doctor_id: doctorId } : {},
  });

export const fetchCalendarEventDetailApi = (id) =>
  axiosInstance.get(`/api/calendar/event/${id}`);