import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import StoreContextProvider from './Context/StoreContext';

// Import the admin app from src/admin/AdminApp.js
import AdminApp from './admin/AdminApp';

const root = ReactDOM.createRoot(document.getElementById('root'));

// If the URL path starts with /admin, render the admin app instead of frontend
if (window.location.pathname.startsWith('/admin')) {
  root.render(
    <BrowserRouter>
      <StoreContextProvider>
        <AdminApp />
      </StoreContextProvider>
    </BrowserRouter>
  );
} else {
  root.render(
    <BrowserRouter>
      <StoreContextProvider>
        <App />
      </StoreContextProvider>
    </BrowserRouter>
  );
}
