import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchThreadRequest,
  sendMessageRequest,
  setActiveAppointment,
  clearThread,
  clearError,
} from '../store/messages/messagesSlice';

const useMessages = () => {
  const dispatch = useDispatch();
  const {
    threads,
    activeAppointmentId,
    loading,
    sending,
    error,
    sendError,
  } = useSelector((state) => state.messages);

  const getMessages = useCallback(
    (appointmentId) => threads[appointmentId] || [],
    [threads],
  );

  const fetchThread = useCallback(
    (appointmentId) => dispatch(fetchThreadRequest(appointmentId)),
    [dispatch],
  );

  const sendMessage = useCallback(
    (data) => dispatch(sendMessageRequest(data)),
    [dispatch],
  );

  const setActive = useCallback(
    (appointmentId) => dispatch(setActiveAppointment(appointmentId)),
    [dispatch],
  );

  const clearThreadAction = useCallback(
    () => dispatch(clearThread()),
    [dispatch],
  );

  const clearErrorAction = useCallback(
    () => dispatch(clearError()),
    [dispatch],
  );

  return {
    threads,
    activeAppointmentId,
    loading,
    sending,
    error,
    sendError,
    getMessages,
    fetchThread,
    sendMessage,
    setActive,
    clearThread: clearThreadAction,
    clearError:  clearErrorAction,
  };
};

export default useMessages;
