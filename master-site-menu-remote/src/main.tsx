import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from 'globalUtils/context';
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="darkVar1" storageKey="vite-ui-theme">
      <App />
    </ThemeProvider>
  </StrictMode>
)
