import { createBrowserRouter } from 'react-router-dom'

import App from '@/App'
import CvPage from '@/pages/CvPage'
import ProjectPage from '@/pages/ProjectPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/cv',
    element: <CvPage />,
  },
  {
    path: '/work/:id',
    element: <ProjectPage />,
  },
])
