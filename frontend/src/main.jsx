import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from '/home/brian-okuku/Documents/ShopSphere/frontend/src/pages/app.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
