import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutRequest } from '../store/auth/authSlice';
import { TOKEN_KEY } from '../utils/tokenStorage';

const useSecurity = () => {
  const dispatch        = useDispatch();
  const isAuthenticated = useSelector((s) => s.auth.isAuthenticated);
  const initialized     = useSelector((s) => s.auth.initialized);

  useEffect(() => {
    if (!isAuthenticated || !initialized) return;

    const handleStorageChange = (e) => {
      // Only logout if token removed from ANOTHER browser tab
      if (
        e.key === TOKEN_KEY &&
        !e.newValue &&
        e.storageArea === localStorage
      ) {
        dispatch(logoutRequest());
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [isAuthenticated, initialized, dispatch]);
};

export default useSecurity;