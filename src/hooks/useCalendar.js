import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { fetchRequest, clearItem } from '../store/calendar/calendarSlice';

const useCalendar = () => {
    const dispatch = useDispatch();
    const { list, item, loading, error, pagination } = useSelector((s) => s.calendar);

    return {
        events: list,
        event: item,
        loading,
        error,
        pagination,
        fetchEvents: useCallback((params) => dispatch(fetchRequest(params)), [dispatch]),
        clearEvent: useCallback(() => dispatch(clearItem()), [dispatch]),
    };
};

export default useCalendar;
