// src/main.jsx (or main.js)
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx'; // Or ./App.js
import './index.css'; // We'll create this next

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);