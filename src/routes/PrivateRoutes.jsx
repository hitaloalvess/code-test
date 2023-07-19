import { useContextAuth } from '@/hooks/useAuth';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoutes = () => {
  const { isAuthenticated } = useContextAuth();

  return (
    isAuthenticated ? <Outlet /> : <Navigate to={'/'} replace />
  )
};

export default PrivateRoutes;
