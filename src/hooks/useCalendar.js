import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import {
  fetchEventsRequest, fetchDayEventsRequest,
  setSelectedDate, setFilters, clearEvents,
} from '../store/calendar/calendarSlice';

const useCalendar = () => {
  const dispatch = useDispatch();
  const {
    events, dayEvents, loading, dayLoading,
    error, selectedDate, filters,
  } = useSelector((s) => s.calendar);

  const fetchMonthEvents = useCallback((year, month, extra = {}) => {
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const lastDay   = new Date(year, month, 0).getDate();
    const endDate   = `${year}-${String(month).padStart(2, '0')}-${lastDay}`;
    dispatch(fetchEventsRequest({
      startDate, endDate, month, year, ...extra,
    }));
  }, [dispatch]);

  const fetchDayEvents = useCallback((date, doctorId) => {
    dispatch(fetchDayEventsRequest({ date, doctorId }));
  }, [dispatch]);

  const selectDate    = useCallback((date) => dispatch(setSelectedDate(date)), [dispatch]);
  const updateFilters = useCallback((f)    => dispatch(setFilters(f)),         [dispatch]);
  const clear         = useCallback(()     => dispatch(clearEvents()),          [dispatch]);

  return {
    events, dayEvents, loading, dayLoading,
    error, selectedDate, filters,
    fetchMonthEvents, fetchDayEvents, selectDate, updateFilters, clear,
  };
};

export default useCalendar;