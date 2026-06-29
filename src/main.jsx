// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import { AuthProvider } from './lib/AuthContext';
import { MusicProvider } from './lib/MusicContext';
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <MusicProvider>
          <App />
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: '#fdf8ed',
                color: '#4a2c3a',
                border: '1px solid #f2c4d0',
                fontFamily: 'Lato, sans-serif',
                borderRadius: '1rem',
                boxShadow: '0 8px 32px rgba(201,160,180,0.2)',
              },
            }}
          />
        </MusicProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
