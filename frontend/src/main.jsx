import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { Toaster } from 'react-hot-toast'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Toaster 
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#27272a',
          color: '#fafafa',
          border: '1px solid rgba(113, 113, 122, 0.3)',
          borderRadius: '12px',
          backdropFilter: 'blur(10px)',
        },
        success: {
          iconTheme: {
            primary: '#8B5CF6',
            secondary: '#fafafa',
          },
        },
        error: {
          iconTheme: {
            primary: '#EF4444',
            secondary: '#fafafa',
          },
        },
      }}
    />
    <App />
  </React.StrictMode>,
)
