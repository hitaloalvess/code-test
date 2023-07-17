import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Platform from '@/pages/Platform';
import SignIn from '@/pages/SignIn';
import SignUp from '@/pages/SignUp';

const RoutesApp = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<SignIn />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/platform' element={<Platform />} />
      </Routes>
    </BrowserRouter>
  )
}

export default RoutesApp;
