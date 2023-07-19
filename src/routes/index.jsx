import { Routes, Route, useNavigate } from 'react-router-dom';

import Platform from '@/pages/Platform';
import SignIn from '@/pages/SignIn';
import SignUp from '@/pages/SignUp';
import { setupInterceptors } from '../services/api';
import { useEffect } from 'react';

const RoutesApp = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setupInterceptors(navigate);
  }, [navigate]);

  return (
    <Routes>
      <Route path='/' element={<SignIn />} />
      <Route path='/signup' element={<SignUp />} />
      <Route path='/platform' element={<Platform />} />
    </Routes>
  )
}

export default RoutesApp;
