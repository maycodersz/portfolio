import { useLayoutEffect } from 'react'

import { AppShell } from '@/components/AppShell'
import { Button } from '@/components/ui/button'
import Link from '@/components/ui/link'
import NavBar from '@/components/ui/navbar'
import { useAnalytics } from '@/analytics/AnalyticsContext'

const sections = [
  ['What this site uses', 'A random anonymous visitor identifier is stored in your browser for realtime presence. If you allow analytics, a session identifier, page views, and clicks on explicitly marked links or buttons are also recorded. Form values, clipboard contents, pointer coordinates, selections, and keystrokes are never collected.'],
  ['Live presence', 'Minimal Supabase Presence starts immediately and shares only the anonymous visitor ID, pathname, connection time, and a low-frequency activity time. It is used to show an aggregate live visitor count and is not written to a public visitor-log table.'],
  ['Optional analytics', 'Analytics is opt-in. It includes only the page or marked action, anonymous visitor and session IDs, language, timezone, device category, allowlisted source and campaign, bot classification, and approximate city, region, and country supplied by Vercel. Full IPs, IP hashes, user agents, browser versions, operating systems, referrer URLs, clicked URLs, and form values are not stored in the report.'],
  ['Processors and purpose', 'Supabase processes realtime presence. Vercel receives and validates same-origin analytics requests. Upstash supports rate limiting and duplicate prevention. Server-side code writes the reporting rows directly to Google Sheets. This data is used to understand portfolio traffic and improve the site.'],
  ['Consent and opt-out', 'You can choose “Not now” in the preference banner or use the preference control below at any time. Global Privacy Control automatically disables historical analytics.'],
  ['Retention', 'Raw analytics events have a 90-day retention target. Anonymous visitor summaries have a 12-month inactivity target. Scheduled deletion must be configured before historical analytics is enabled. Operational logs may expire sooner, and full-IP storage remains disabled.'],
] as const

export default function PrivacyPage() {
  const { consent, deny, grant } = useAnalytics()
  const analyticsGranted = consent === 'granted'
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    document.title = 'Privacy | Maycoder'
  }, [])

  return (
    <AppShell>
      <NavBar />
      <article className="px-[10%] pb-24 pt-10">
        <div className="mx-auto max-w-3xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.38em] text-accent-foreground">Privacy</p>
          <h1 className="text-gradient-brand mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">Privacy and analytics</h1>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground">A plain-language summary of what the portfolio processes and why.</p>
          <div className="mt-10 space-y-5">
            {sections.map(([title, body]) => (
              <section key={title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h2 className="text-lg font-bold text-foreground">{title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
              </section>
            ))}
          </div>
          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Button
              variant="secondary"
              className="min-w-0 w-full whitespace-normal text-center leading-snug"
              aria-pressed={analyticsGranted}
              onClick={analyticsGranted ? deny : grant}
            >
              {analyticsGranted
                ? 'Disable analytics on this browser'
                : 'Enable analytics on this browser'}
            </Button>
            <Button variant="accent" className="min-w-0 w-full whitespace-normal text-center leading-snug" asChild>
              <Link href="/#contact">Contact Maycoder</Link>
            </Button>
          </div>
        </div>
      </article>
    </AppShell>
  )
}
