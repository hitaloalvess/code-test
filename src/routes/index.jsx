import { Routes, Route } from 'react-router-dom';

import Platform from '@/pages/Platform';
import SignIn from '@/pages/SignIn';
import SignUp from '@/pages/SignUp';

const RoutesApp = () => {
  return (
    <Routes>
      <Route path='/' element={<SignIn />} />
      <Route path='/signup' element={<SignUp />} />
      <Route path='/platform' element={<Platform />} />
    </Routes>
  )
}

export default RoutesApp;
