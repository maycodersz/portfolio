import { Outlet } from 'react-router-dom'

import { AnalyticsProvider } from '@/analytics/AnalyticsContext'
import { AnalyticsConsentBanner } from '@/components/AnalyticsConsentBanner'
import { VisitorPresenceProvider } from '@/realtime/VisitorPresenceContext'

export function SiteRuntime() {
  return (
    <VisitorPresenceProvider>
      <AnalyticsProvider>
        <Outlet />
        <AnalyticsConsentBanner />
      </AnalyticsProvider>
    </VisitorPresenceProvider>
  )
}
