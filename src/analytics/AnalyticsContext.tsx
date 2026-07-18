/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useLocation } from 'react-router-dom'

import { captureAttribution, type Attribution } from '@/analytics/attribution'
import { getSessionId, getVisitorId } from '@/analytics/identity'
import { publicEnv } from '@/config/publicEnv'
import type {
  AnalyticsCommon,
  ClickPayload,
  VisitPayload,
} from '../../shared/analytics-contract'

export type AnalyticsConsent = 'granted' | 'denied' | 'unset'
type TrackEventInput = Pick<ClickPayload, 'eventName' | 'clickLabel'> & {
  target?: string
}

type AnalyticsValue = {
  consent: AnalyticsConsent
  showBanner: boolean
  grant: () => void
  deny: () => void
  trackEvent: (input: TrackEventInput) => void
}

const AnalyticsContext = createContext<AnalyticsValue | null>(null)
const CONSENT_KEY = 'portfolio_analytics_consent'
const DEDUPE_MS = 900

function initialConsent(): AnalyticsConsent {
  const gpc = (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl
  if (gpc) {
    localStorage.setItem(CONSENT_KEY, 'denied')
    return 'denied'
  }
  const stored = localStorage.getItem(CONSENT_KEY)
  if (stored === 'granted' || stored === 'denied') return stored
  return publicEnv.analyticsEnabled ? 'unset' : 'denied'
}

function screenCategory(): 'mobile' | 'tablet' | 'desktop' {
  if (window.innerWidth < 640) return 'mobile'
  if (window.innerWidth < 1024) return 'tablet'
  return 'desktop'
}

function commonPayload(attribution: Attribution): AnalyticsCommon {
  return {
    schemaVersion: 1,
    eventId: crypto.randomUUID(),
    occurredAt: new Date().toISOString(),
    visitorId: getVisitorId(),
    sessionId: getSessionId(),
    pathname: window.location.pathname,
    screenCategory: screenCategory(),
    language: navigator.language.slice(0, 24),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone.slice(0, 64),
    source: attribution.source,
    campaign: attribution.campaign,
  }
}

function send(path: string, body: VisitPayload | ClickPayload) {
  void fetch(path, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
    credentials: 'same-origin',
    keepalive: true,
  }).catch(() => undefined)
}

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  const location = useLocation()
  const [consent, setConsent] = useState<AnalyticsConsent>(initialConsent)
  const [attribution] = useState<Attribution>(() => captureAttribution())
  const sentPageKeysRef = useRef(new Set<string>())
  const recentEventsRef = useRef(new Map<string, number>())

  const trackEvent = useCallback((input: TrackEventInput) => {
    if (consent !== 'granted' || !publicEnv.analyticsEnabled) return
    const dedupeKey = `${input.eventName}|${input.clickLabel}|${input.target ?? ''}`
    const now = Date.now()
    const previous = recentEventsRef.current.get(dedupeKey) ?? 0
    if (now - previous < DEDUPE_MS) return
    recentEventsRef.current.set(dedupeKey, now)

    send('/api/analytics/event', {
      type: 'event',
      ...commonPayload(attribution),
      eventName: input.eventName.slice(0, 80),
      clickLabel: input.clickLabel.slice(0, 160),
    })
  }, [attribution, consent])

  useEffect(() => {
    if (consent !== 'granted' || !publicEnv.analyticsEnabled) return
    const pageKey = location.key || `${location.pathname}${location.search}`
    if (sentPageKeysRef.current.has(pageKey)) return
    sentPageKeysRef.current.add(pageKey)
    const timer = window.setTimeout(() => {
      send('/api/analytics/visit', {
        type: 'visit',
        ...commonPayload(attribution),
      })
    }, 0)
    return () => window.clearTimeout(timer)
  }, [attribution, consent, location.key, location.pathname, location.search])

  useEffect(() => {
    if (consent !== 'granted') return
    const onClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return
      const marked = event.target.closest<HTMLElement>('[data-analytics-event]')
      if (!marked) return
      const href = marked instanceof HTMLAnchorElement ? marked.href : marked.closest<HTMLAnchorElement>('a')?.href ?? ''
      trackEvent({
        eventName: marked.dataset.analyticsEvent ?? 'click',
        clickLabel: marked.dataset.analyticsLabel ?? 'marked-control',
        target: href,
      })
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [consent, trackEvent])

  const grant = useCallback(() => {
    localStorage.setItem(CONSENT_KEY, 'granted')
    setConsent('granted')
  }, [])
  const deny = useCallback(() => {
    localStorage.setItem(CONSENT_KEY, 'denied')
    setConsent('denied')
  }, [])

  const value = useMemo(() => ({
    consent,
    showBanner: publicEnv.analyticsEnabled && consent === 'unset',
    grant,
    deny,
    trackEvent,
  }), [consent, deny, grant, trackEvent])

  return <AnalyticsContext.Provider value={value}>{children}</AnalyticsContext.Provider>
}

export function useAnalytics(): AnalyticsValue {
  const value = useContext(AnalyticsContext)
  if (!value) throw new Error('useAnalytics must be used within AnalyticsProvider')
  return value
}
