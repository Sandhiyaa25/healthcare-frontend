import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import {
  fetchPrescriptionsRequest,
  fetchPrescriptionRequest,
  createPrescriptionRequest,
  verifyPrescriptionRequest,
  clearItem,
  clearSaveError,
  clearError,
} from '../store/prescriptions/prescriptionsSlice';

const usePrescriptions = () => {
  const dispatch = useDispatch();
  const {
    list, item, loading, saving,
    error, saveError, pagination,
  } = useSelector((s) => s.prescriptions);

  const fetchList = useCallback((params = {}) => {
    dispatch(fetchPrescriptionsRequest(params));
  }, [dispatch]);

  const fetchOne = useCallback((id) => {
    dispatch(fetchPrescriptionRequest(id));
  }, [dispatch]);

  const createPrescription = useCallback((data, onSuccess) => {
    dispatch(createPrescriptionRequest({ data, onSuccess }));
  }, [dispatch]);

  const verifyPrescription = useCallback((id, status, onSuccess) => {
    dispatch(verifyPrescriptionRequest({ id, status, onSuccess }));
  }, [dispatch]);

  const clearSelected  = useCallback(() => dispatch(clearItem()),      [dispatch]);
  const clearSaveErr   = useCallback(() => dispatch(clearSaveError()), [dispatch]);
  const clearFetchErr  = useCallback(() => dispatch(clearError()),     [dispatch]);

  return {
    list, item, loading, saving,
    error, saveError, pagination,
    fetchList, fetchOne,
    createPrescription, verifyPrescription,
    clearSelected, clearSaveErr, clearFetchErr,
  };
};

export default usePrescriptions;