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
    hydrateFallbackElement: (
      <div
        role="status"
        aria-label="Loading page"
        className="grid min-h-screen place-items-center bg-background text-sm text-muted-foreground"
      >
        Loading page...
      </div>
    ),
    children: [
      { index: true, element: <App /> },
      { path: 'cv', element: <CvPage /> },
      {
        path: 'work/accountingops-automation-system',
        lazy: async () => ({ Component: (await import('@/pages/AccountingOpsPage')).default }),
      },
      { path: 'work/:id', element: <ProjectPage /> },
      { path: 'privacy', element: <PrivacyPage /> },
    ],
  },
])
