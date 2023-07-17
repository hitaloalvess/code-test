import React from 'react'
import Modal from 'react-modal';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './styles/global.css';

import RoutesApp from "./routes"
import { AuthProvider } from './contexts/AuthContext';
import { BrowserRouter } from 'react-router-dom';

Modal.setAppElement('#root');

const App = () => {
  return (
    <React.StrictMode>
      <BrowserRouter>
        <AuthProvider>
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
          <RoutesApp />
        </AuthProvider>
      </BrowserRouter>

    </React.StrictMode>
  )
}

export default App;
