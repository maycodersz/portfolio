import { createBrowserRouter } from 'react-router-dom'

import App from '@/App'
import CvPage from '@/pages/CvPage'
import ProjectPage from '@/pages/ProjectPage'
import PrivacyPage from '@/pages/PrivacyPage'
import { SiteRuntime } from '@/components/SiteRuntime'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <SiteRuntime />,
    children: [
      { index: true, element: <App /> },
      { path: 'cv', element: <CvPage /> },
      { path: 'work/:id', element: <ProjectPage /> },
      { path: 'privacy', element: <PrivacyPage /> },
    ],
  },
])
