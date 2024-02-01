import { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';

import PlatformGuard from './CustomRoutes/PlatformGuard';
import PrivateRoutes from './CustomRoutes/PrivateRoutes';
import { setupInterceptorsApiAuth } from '@/services/api';
import { setupInterceptorsApiMicroCode } from '@/services/apiMicrocode';
import SignIn from '@/pages/SignIn';
import SignUp from '@/pages/SignUp';
import AccountManagement from '@/pages/AccountManagement';
import MyProjects from '@/pages/MyProjects';
import { useModal } from '@/hooks/useModal';

import MoutingPanel from '@/components/Platform/MoutingPanel';


const RoutesApp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { disableModal } = useModal();

  useEffect(() => {
    setupInterceptorsApiAuth(navigate);
    setupInterceptorsApiMicroCode(navigate);
  }, [navigate]);

  useEffect(() => {
    disableModal();
  }, [location.pathname]);

  return (
    <Routes>
      <Route path='/' element={<SignIn />} />
      <Route path='/signup' element={<SignUp />} />

      <Route element={<PrivateRoutes />}>
        <Route path='/plataforma/projeto' element={<PlatformGuard />} >
          <Route path=':id' element={<MoutingPanel />} />
        </Route>
        <Route path='/conta' element={<AccountManagement />} />
        <Route path='/projetos' element={<MyProjects />} />
      </Route>

    </Routes>
  )
}

export default RoutesApp;
