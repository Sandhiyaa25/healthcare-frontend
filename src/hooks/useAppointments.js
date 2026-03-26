import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import {
  fetchRequest, fetchOneRequest,
  createRequest, updateRequest, cancelRequest, statusRequest,
  clearConflict, clearItem, clearError,
} from '../store/appointments/appointmentsSlice';

const useAppointments = () => {
  const dispatch = useDispatch();
  const { list, item, loading, saving, cancelling, error, pagination, conflict } =
    useSelector((s) => s.appointments);

  return {
    appointments:  list,
    appointment:   item,
    loading,
    saving,
    cancelling,
    error,
    pagination,
    conflict,

    fetchAppointments:  useCallback((params)      => dispatch(fetchRequest(params)),              [dispatch]),
    fetchAppointment:   useCallback((id)          => dispatch(fetchOneRequest(id)),               [dispatch]),
    createAppointment:  useCallback((data)        => dispatch(createRequest(data)),               [dispatch]),
    updateAppointment:  useCallback((id, data)    => dispatch(updateRequest({ id, data })),       [dispatch]),
    cancelAppointment:  useCallback((id)          => dispatch(cancelRequest(id)),                 [dispatch]),
    updateStatus:       useCallback((id, status)  => dispatch(statusRequest({ id, status })),     [dispatch]),
    clearConflict:      useCallback(()            => dispatch(clearConflict()),                   [dispatch]),
    clearAppointment:   useCallback(()            => dispatch(clearItem()),                       [dispatch]),
    clearError:         useCallback(()            => dispatch(clearError()),                      [dispatch]),
  };
};

export default useAppointments;