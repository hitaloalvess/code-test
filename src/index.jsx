import React from 'react'
import ReactDOM from 'react-dom/client';
import Modal from 'react-modal';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Platform from './templates/Platform';
import SignIn from './templates/SignIn';
import SignUp from './templates/SignUp';

import './styles/global.css';

Modal.setAppElement('#root');

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ToastContainer
      position="bottom-center"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="colored"
      style={{
        zIndex: 9999999999,
      }}
    />
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<SignIn />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/platform' element={<Platform />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
