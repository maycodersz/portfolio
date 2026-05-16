import { createBrowserRouter } from 'react-router-dom'

import App from '@/App'
import ProjectPage from '@/pages/ProjectPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/work/:id',
    element: <ProjectPage />,
  },
])
