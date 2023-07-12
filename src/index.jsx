import React from 'react'
import ReactDOM from 'react-dom/client';
import Modal from 'react-modal';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Platform from './templates/Platform';
import SignIn from './templates/SignIn';

import './styles/global.css';

Modal.setAppElement('#root');

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<SignIn />} />
      <Route path='/platform' element={<Platform />} />
    </Routes>
   </BrowserRouter>
  </React.StrictMode>,
)
