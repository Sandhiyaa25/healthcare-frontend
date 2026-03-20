import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import {
    fetchRequest, fetchOneRequest,
    createRequest, updateRequest,
    cancelRequest, statusRequest,
    clearItem, clearError,
    clearConflict,
} from '../store/appointments/appointmentsSlice';

const useAppointments = () => {
    const dispatch = useDispatch();
    const {
        list, item, loading, saving, cancelling, error, pagination, conflict,
    } = useSelector((s) => s.appointments);

    return {
        appointments: list,
        appointment: item,
        loading,
        saving,
        cancelling,
        error,
        pagination,
        conflict,
        fetchAppointments: useCallback((p) => dispatch(fetchRequest(p)), [dispatch]),
        fetchAppointment: useCallback((id) => dispatch(fetchOneRequest(id)), [dispatch]),
        createAppointment: useCallback((d) => dispatch(createRequest(d)), [dispatch]),
        updateAppointment: useCallback((id, d) => dispatch(updateRequest({ id, data: d })), [dispatch]),
        cancelAppointment: useCallback((id) => dispatch(cancelRequest(id)), [dispatch]),
        updateStatus: useCallback((id, s) => dispatch(statusRequest({ id, status: s })), [dispatch]),
        clearAppointment: useCallback(() => dispatch(clearItem()), [dispatch]),
        clearError: useCallback(() => dispatch(clearError()), [dispatch]),
        clearConflict: useCallback(() => dispatch(clearConflict()), [dispatch]),
    };
};

export default useAppointments;
