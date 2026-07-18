import { useAnalytics } from '@/analytics/AnalyticsContext'
import { Button } from '@/components/ui/button'
import Link from '@/components/ui/link'

export function AnalyticsConsentBanner() {
  const { showBanner, grant, deny } = useAnalytics()
  if (!showBanner) return null

  return (
    <section
      aria-label="Analytics preference"
      className="fixed bottom-[max(1rem,calc(env(safe-area-inset-bottom,0px)+0.75rem))] left-[max(1rem,calc(env(safe-area-inset-left,0px)+0.75rem))] z-40 w-[min(26rem,calc(100vw-2rem))] rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] p-4 text-sm text-foreground shadow-xl backdrop-blur-xl"
    >
      <p className="leading-relaxed text-muted-foreground">
        Maycoder uses optional, privacy-conscious analytics to understand visits and marked clicks. Realtime presence works without historical tracking.
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Button size="sm" variant="accent" onClick={grant}>Allow analytics</Button>
        <Button size="sm" variant="secondary" onClick={deny}>Not now</Button>
        <Link href="/privacy" className="min-h-11 px-2 py-3 text-xs font-semibold text-accent-foreground underline underline-offset-4">
          Privacy
        </Link>
      </div>
    </section>
  )
}
