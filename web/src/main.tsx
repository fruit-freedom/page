import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import './index.css'
import App from './App.tsx'

const theme = createTheme({
  palette: {
    mode: 'light',
  },
})

// Determine base path for GitHub Pages
// Vite's BASE_URL includes the trailing slash, but BrowserRouter basename should not
const getBasePath = () => {
  const baseUrl = import.meta.env.BASE_URL
  // Remove trailing slash for BrowserRouter basename
  return baseUrl === '/' ? '/' : baseUrl.slice(0, -1)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <BrowserRouter basename={getBasePath()}>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)
