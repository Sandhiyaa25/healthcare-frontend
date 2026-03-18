import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { loginRequest, logoutRequest } from '../store/auth/authSlice';

const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading, error, fieldErrors, tenant, initialized } =
    useSelector((state) => state.auth);

  // role with fallback for old cached objects
  const role = user?.role || user?.role_slug;

  const login  = useCallback((creds) => dispatch(loginRequest(creds)),  [dispatch]);
  const logout = useCallback(()      => dispatch(logoutRequest()),       [dispatch]);

  return {
    user,
    isAuthenticated,
    loading,
    error,
    fieldErrors,
    tenant,
    role,
    initialized,
    login,
    logout,
  };
};

export default useAuth;
