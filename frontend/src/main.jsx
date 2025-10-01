import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from '/home/walid/ShopSphere/frontend/src/pages/app.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
