import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import {
  fetchRecordsRequest, fetchRecordRequest,
  createRecordRequest, updateRecordRequest,
  clearItem, clearSaveError, clearError,
} from '../store/records/recordsSlice';

const useRecords = () => {
  const dispatch = useDispatch();
  const { list, item, loading, saving, error, saveError, pagination } =
    useSelector((s) => s.records);

  const fetchList   = useCallback((params) => dispatch(fetchRecordsRequest(params)), [dispatch]);
  const fetchOne    = useCallback((id)     => dispatch(fetchRecordRequest(id)),      [dispatch]);

  const createRecord = useCallback((data, onSuccess) =>
    dispatch(createRecordRequest({ data, onSuccess })), [dispatch]);

  const updateRecord = useCallback((id, data, onSuccess) =>
    dispatch(updateRecordRequest({ id, data, onSuccess })), [dispatch]);

  const clearSelected  = useCallback(() => dispatch(clearItem()),      [dispatch]);
  const clearSaveErr   = useCallback(() => dispatch(clearSaveError()), [dispatch]);
  const clearFetchErr  = useCallback(() => dispatch(clearError()),     [dispatch]);

  return {
    list, item, loading, saving, error, saveError, pagination,
    fetchList, fetchOne, createRecord, updateRecord,
    clearSelected, clearSaveErr, clearFetchErr,
  };
};

export default useRecords;