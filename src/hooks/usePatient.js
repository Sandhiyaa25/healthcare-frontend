import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import {
  fetchPatientsRequest, fetchPatientRequest,
  createPatientRequest, updatePatientRequest, deletePatientRequest,
  clearItem, clearError,
} from '../store/patients/patientsSlice';

const usePatients = () => {
  const dispatch = useDispatch();
  const { list, item, loading, saving, error, pagination } = useSelector((s) => s.patients);

  return {
    patients:      list,
    patient:       item,
    loading,
    saving,
    error,
    pagination,
    fetchPatients:  useCallback((p)      => dispatch(fetchPatientsRequest(p)),               [dispatch]),
    fetchPatient:   useCallback((id)     => dispatch(fetchPatientRequest(id)),               [dispatch]),
    createPatient:  useCallback((d)      => dispatch(createPatientRequest(d)),               [dispatch]),
    updatePatient:  useCallback((id, d)  => dispatch(updatePatientRequest({ id, data: d })), [dispatch]),
    deletePatient:  useCallback((id)     => dispatch(deletePatientRequest(id)),              [dispatch]),
    clearPatient:   useCallback(()       => dispatch(clearItem()),                           [dispatch]),
    clearError:     useCallback(()       => dispatch(clearError()),                          [dispatch]),
  };
};
export default usePatients;
