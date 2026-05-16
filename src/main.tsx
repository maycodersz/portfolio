import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { SiteCursorProvider } from '@/contexts/SiteCursorContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import './index.css'
import { router } from './router'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <SiteCursorProvider>
        <RouterProvider router={router} />
      </SiteCursorProvider>
    </ThemeProvider>
  </StrictMode>,
)
