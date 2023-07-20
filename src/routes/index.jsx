import { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';

import { setupInterceptors } from '../services/api';
import Platform from '@/pages/Platform';
import SignIn from '@/pages/SignIn';
import SignUp from '@/pages/SignUp';
import AccountManagement from '@/pages/AccountManagement';
import PrivateRoutes from './PrivateRoutes';

const RoutesApp = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setupInterceptors(navigate);
  }, [navigate]);

  return (
    <Routes>
      <Route path='/' element={<SignIn />} />
      <Route path='/signup' element={<SignUp />} />

      <Route element={<PrivateRoutes />}>
        <Route path='/platform' element={<Platform />} />
        <Route path='/account' element={<AccountManagement />} />
      </Route>

    </Routes>
  )
}

export default RoutesApp;
