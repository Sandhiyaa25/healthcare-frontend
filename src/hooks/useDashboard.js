import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { fetchDashboardRequest } from '../store/dashboard/dashboardSlice';

const useDashboard = () => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.dashboard);

  const fetchDashboard = useCallback(() => dispatch(fetchDashboardRequest()), [dispatch]);

  return { data, loading, error, fetchDashboard };
};

export default useDashboard;
