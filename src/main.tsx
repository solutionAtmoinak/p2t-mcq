import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from "react-redux";
import "rsuite/dist/rsuite-no-reset.min.css";
import 'sweetalert2/src/sweetalert2.scss'
import 'react-toastify/dist/ReactToastify.css';
import './index.css';
import { ToastContainer } from 'react-toastify';
import store from './Store/Store.ts';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(

  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
    <ToastContainer position="top-right" autoClose={3000} />
  </StrictMode>
  ,
)

