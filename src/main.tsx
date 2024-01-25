import './index.scss';
import store from 'store';
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import Router from 'routes/Router';
import { Provider } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { RouterProvider } from 'react-router-dom';
import { paths } from 'routes/paths';

// eslint-disable-next-line react-refresh/only-export-components
const AppRoot = () => {
  const checkToken = () => {
    const token = localStorage.getItem('authToken');

    if (!token && window.location.pathname !== paths.login) {
      // alert('Token does not exist. Please refresh the page');
      window.location.href = paths.login;
    }
  };

  useEffect(() => {
    checkToken();

    const handleStorageChange = () => {
      checkToken();
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <React.StrictMode>
      <Provider store={store}>
        <RouterProvider router={Router} />
      </Provider>
      <ToastContainer />
    </React.StrictMode>
  );
};

ReactDOM.render(<AppRoot />, document.getElementById('root'));
