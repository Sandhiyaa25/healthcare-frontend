import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import {
    fetchRequest,
    createRequest,
    clearItem,
} from '../store/prescriptions/prescriptionsSlice';

const usePrescriptions = () => {
    const dispatch = useDispatch();
    const { list, item, loading, saving, error, pagination } = useSelector((s) => s.prescriptions);

    return {
        prescriptions: list,
        prescription: item,
        loading,
        saving,
        error,
        pagination,
        fetchPrescriptions: useCallback((p) => dispatch(fetchRequest(p)), [dispatch]),
        createPrescription: useCallback((d) => dispatch(createRequest(d)), [dispatch]),
        clearPrescription: useCallback(() => dispatch(clearItem()), [dispatch]),
    };
};

export default usePrescriptions;
