/**
 * useOfflineQueue.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Hook for any component that wants offline queue support.
 *
 * Usage:
 *   const { dispatch: qDispatch, isOnline, pendingCount } = useOfflineQueue();
 *
 *   // Instead of: axiosInstance.post('/api/appointments', data)
 *   // Use:
 *   qDispatch({
 *     action:   'CREATE_APPOINTMENT',
 *     label:    'Book Appointment',
 *     endpoint: '/api/appointments',
 *     method:   'post',
 *     payload:  data,
 *   });
 */

import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { queueAction } from '../store/offlineQueue/offlineQueueSlice';

const useOfflineQueue = () => {
  const reduxDispatch = useDispatch();

  const isOnline     = useSelector((s) => s.offlineQueue?.isOnline     ?? true);
  const pendingCount = useSelector((s) => s.offlineQueue?.pendingCount  ?? 0);
  const isSyncing    = useSelector((s) => s.offlineQueue?.isSyncing     ?? false);
  const items        = useSelector((s) => s.offlineQueue?.items         ?? []);

  // Dispatch an action through the offline queue
  // If online  → executes immediately via saga
  // If offline → encrypts and stores in IndexedDB
  const dispatch = useCallback((actionPayload) => {
    reduxDispatch(queueAction(actionPayload));
  }, [reduxDispatch]);

  return {
    dispatch,       // use instead of axiosInstance for offline support
    isOnline,
    pendingCount,
    isSyncing,
    items,
  };
};

export default useOfflineQueue;