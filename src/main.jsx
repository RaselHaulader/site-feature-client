import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import AuthProvider from './providers/AuthProvider'
import FeaturesProvider from './providers/featuresProvider.jsx'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <FeaturesProvider>
        <App></App>
      </FeaturesProvider>
    </AuthProvider>
  </React.StrictMode>,
)
