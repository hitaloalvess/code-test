import Modal from 'react-modal';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import RoutesApp from "./routes"
import { ModalProvider } from '@/contexts/ModalContext';
import { AuthProvider } from './contexts/AuthContext';

import './styles/global.css';

Modal.setAppElement('#root');

const App = () => {

  return (
    <BrowserRouter>

      <ModalProvider>

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

      </ModalProvider>

    </BrowserRouter>

  )
}

export default App;
