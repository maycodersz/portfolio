import { useLocation } from 'react-router-dom'

import { useAnalytics } from '@/analytics/AnalyticsContext'
import { LiveVisitorCounter } from '@/components/LiveVisitorCounter'
import { ScrollToTopFab } from '@/components/ScrollToTopFab'

export function FloatingUiStack() {
  const { pathname } = useLocation()
  const { showBanner } = useAnalytics()
  const hasBottomBackButton = pathname === '/cv' || pathname.startsWith('/work/')
  const bottomClass = showBanner
    ? 'bottom-[max(11rem,calc(env(safe-area-inset-bottom,0px)+10.5rem))]'
    : hasBottomBackButton
      ? 'bottom-[max(5.25rem,calc(env(safe-area-inset-bottom,0px)+4.75rem))]'
      : 'bottom-[max(1rem,calc(env(safe-area-inset-bottom,0px)+0.75rem))]'

  return (
    <aside
      aria-label="Site activity and page controls"
      className={`pointer-events-none fixed right-[max(1rem,calc(10%+env(safe-area-inset-right,0px)))] z-30 flex max-w-[calc(100vw-2rem)] flex-col items-end gap-2 ${bottomClass}`}
    >
      <ScrollToTopFab />
      <LiveVisitorCounter />
    </aside>
  )
}
