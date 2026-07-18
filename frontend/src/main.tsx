import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { LanguageProvider } from './context/LanguageContext'
import { ThemeProvider } from './context/ThemeContext'
import { SimulationProvider } from './context/SimulationContext'
import { AuthProvider } from './context/AuthContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <ThemeProvider>
        <SimulationProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </SimulationProvider>
      </ThemeProvider>
    </LanguageProvider>
  </StrictMode>,
)

