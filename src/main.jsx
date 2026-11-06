import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import './index.css'
import { initTelegram } from './hooks/useTelegram'
import App from './App'

initTelegram()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <App/>
    </HashRouter>
  </StrictMode>,
)