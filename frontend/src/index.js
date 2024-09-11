import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import store from './app/store';
import { Provider } from 'react-redux';
import { Toaster } from 'sonner';

// import { ApiProvider } from "@reduxjs/toolkit/query/react";
// import { apiSlice } from "./app/api/apiSlice";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Toaster richColors />
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);