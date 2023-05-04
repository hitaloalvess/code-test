import React from 'react'
import ReactDOM from 'react-dom/client';
import Modal from 'react-modal';

import Platform from './templates/Platform';
import './styles/global.css';

Modal.setAppElement('#root');

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Platform />
  </React.StrictMode>,
)
