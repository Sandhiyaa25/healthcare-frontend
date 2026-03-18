import { useSelector } from 'react-redux';

const useTenant = () => {
  const { info } = useSelector((state) => state.tenant);
  const authTenant = useSelector((state) => state.auth.tenant);
  return info || authTenant;
};

export default useTenant;
