import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { AuthProvider } from './contexts/AuthContext'
import { ConfessionProvider } from './contexts/ConfessionContext'
import { Toaster } from 'react-hot-toast'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ConfessionProvider>
          <App />
          <Toaster position="top-right" />
        </ConfessionProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)