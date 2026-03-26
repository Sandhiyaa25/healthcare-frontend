// // import { useDispatch, useSelector } from 'react-redux';
// // import { useCallback, useEffect,useRef } from 'react';
// // import {
// //   fetchNotificationsRequest,
// //   startPolling, stopPolling,
// // } from '../store/notifications/notificationsSlice';
// // import { markReadAction, markAllReadAction } from '../store/notifications/notificationsSaga';

// // const useNotifications = () => {
// //   const dispatch = useDispatch();
// //   const { list, unreadCount, loading } = useSelector((s) => s.notifications);

// //   const fetchNotifications = useCallback((params) => {
// //     dispatch(fetchNotificationsRequest(params));
// //   }, [dispatch]);

// //   const markRead    = useCallback((id) => dispatch(markReadAction(id)),    [dispatch]);
// //   const markAllRead = useCallback(()   => dispatch(markAllReadAction()),   [dispatch]);

// //   // Start polling on mount, stop on unmount
// //   useEffect(() => {
// //     dispatch(startPolling());
// //     return () => dispatch(stopPolling());
// //   }, [dispatch]);

// //   return {
// //     list, unreadCount, loading,
// //     fetchNotifications, markRead, markAllRead,
// //   };
// // };

// // export default useNotifications;
// import { useEffect, useRef } from 'react';
// import { useDispatch } from 'react-redux';
// import { startPolling, stopPolling, fetchNotificationsRequest } from '../store/notifications/notificationsSlice';

// const useNotifications = () => {
//   const dispatch   = useDispatch();
//   const startedRef = useRef(false);   // ← prevents multiple starts

//   useEffect(() => {
//     if (startedRef.current) return;   // ← already running, don't start again
//     startedRef.current = true;

//     dispatch(fetchNotificationsRequest());
//     dispatch(startPolling());

//     return () => {
//       startedRef.current = false;
//       dispatch(stopPolling());
//     };
//   }, [dispatch]);
// };

// export default useNotifications;
import { useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  startPolling,
  stopPolling,
  fetchNotificationsRequest,
  markReadRequest,
  markAllReadRequest,
} from '../store/notifications/notificationsSlice';

const useNotifications = () => {
  const dispatch   = useDispatch();
  const startedRef = useRef(false);

  // Start polling once on mount, stop on unmount
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    dispatch(fetchNotificationsRequest());
    dispatch(startPolling());

    return () => {
      startedRef.current = false;
      dispatch(stopPolling());
    };
  }, [dispatch]);

  // Expose actions so components can call them directly
  const fetchNotifications = useCallback(
    (params) => dispatch(fetchNotificationsRequest(params)),
    [dispatch]
  );

  const markRead = useCallback(
    (id) => dispatch(markReadRequest(id)),
    [dispatch]
  );

  const markAllRead = useCallback(
    () => dispatch(markAllReadRequest()),
    [dispatch]
  );

  const { list, unreadCount, loading } = useSelector((s) => s.notifications);

  return { list, unreadCount, loading, fetchNotifications, markRead, markAllRead };
};

export default useNotifications;