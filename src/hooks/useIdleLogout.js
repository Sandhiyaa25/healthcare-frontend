import { useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutRequest } from '../store/auth/authSlice';

const useIdleLogout = (idleMs = 60 * 60 * 1000, enabled = true) => {
  const dispatch     = useDispatch();
  const initialized  = useSelector((s) => s.auth.initialized);
  const timerRef     = useRef(null);

  const resetTimer = useCallback(() => {
    if (!enabled || !initialized) return;
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      dispatch(logoutRequest());
    }, idleMs);
  }, [dispatch, idleMs, enabled, initialized]);

  useEffect(() => {
    if (!enabled || !initialized) return;

    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'click'];
    events.forEach((e) => window.addEventListener(e, resetTimer, { passive: true }));
    resetTimer();

    return () => {
      clearTimeout(timerRef.current);
      events.forEach((e) => window.removeEventListener(e, resetTimer));
    };
  }, [resetTimer, enabled, initialized]);
};

export default useIdleLogout;