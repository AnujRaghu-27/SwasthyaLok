import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// Boot i18next before anything renders
import './i18n.config'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
