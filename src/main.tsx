import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from "react-redux";
import "rsuite/dist/rsuite-no-reset.min.css";
import 'sweetalert2/src/sweetalert2.scss'
import App from './App.tsx';
import './index.css';
import store from './Store/Store.ts';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

createRoot(document.getElementById('root')!).render(

  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
    <ToastContainer position="top-right" autoClose={3000} />
  </StrictMode>
  ,
)

