/* eslint-disable react-refresh/only-export-components */
import { Turnstile } from '@marsidev/react-turnstile'
import type { RealtimeChannel } from '@supabase/supabase-js'
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

import { getVisitorId } from '@/analytics/identity'
import { publicEnv } from '@/config/publicEnv'
import { supabase } from '@/lib/supabase'

type PresenceStatus = 'checking' | 'live' | 'unavailable'

type VisitorPresenceValue = {
  count: number | null
  status: PresenceStatus
}

const VisitorPresenceContext = createContext<VisitorPresenceValue | null>(null)
const TOPIC = 'site:portfolio:presence'
const ACTIVITY_INTERVAL_MS = 60_000
const STALE_AFTER_MS = 120_000

export function VisitorPresenceProvider({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  const [captchaToken, setCaptchaToken] = useState<string | null>(
    publicEnv.turnstileSiteKey ? null : '',
  )
  const [count, setCount] = useState<number | null>(null)
  const [status, setStatus] = useState<PresenceStatus>(supabase ? 'checking' : 'unavailable')
  const channelRef = useRef<RealtimeChannel | null>(null)
  const connectedAtRef = useRef(new Date().toISOString())
  const lastSyncRef = useRef(0)

  const track = useCallback(async () => {
    const channel = channelRef.current
    if (!channel || document.visibilityState === 'hidden') return
    await channel.track({
      visitorId: getVisitorId(),
      pathname: window.location.pathname,
      connectedAt: connectedAtRef.current,
      lastActivityAt: new Date().toISOString(),
    })
  }, [])

  useEffect(() => {
    const client = supabase
    if (!client || captchaToken === null) return

    let cancelled = false
    let staleTimer = 0

    const connect = async () => {
      const { data: sessionData } = await client.auth.getSession()
      let session = sessionData.session
      if (!session) {
        const result = await client.auth.signInAnonymously({
          options: captchaToken ? { captchaToken } : undefined,
        })
        if (result.error) throw result.error
        session = result.data.session
      }
      if (!session || cancelled) throw new Error('Anonymous session unavailable')
      await client.realtime.setAuth(session.access_token)

      const visitorId = getVisitorId()
      const channel = client.channel(TOPIC, {
        config: { private: true, presence: { key: visitorId, enabled: true } },
      })
      channelRef.current = channel

      const sync = () => {
        if (cancelled) return
        lastSyncRef.current = Date.now()
        setCount(Object.keys(channel.presenceState()).length)
        setStatus('live')
      }

      channel.on('presence', { event: 'sync' }, sync)
      channel.on('presence', { event: 'join' }, sync)
      channel.on('presence', { event: 'leave' }, sync)
      channel.subscribe(async (subscriptionStatus) => {
        if (subscriptionStatus === 'SUBSCRIBED') await track()
        if (subscriptionStatus === 'CHANNEL_ERROR' || subscriptionStatus === 'TIMED_OUT') {
          setStatus('unavailable')
          setCount(null)
        }
      })

      staleTimer = window.setInterval(() => {
        if (lastSyncRef.current && Date.now() - lastSyncRef.current > STALE_AFTER_MS) {
          setStatus('unavailable')
          setCount(null)
        }
      }, ACTIVITY_INTERVAL_MS)
    }

    connect().catch(() => {
      if (!cancelled) {
        setStatus('unavailable')
        setCount(null)
      }
    })

    return () => {
      cancelled = true
      window.clearInterval(staleTimer)
      const channel = channelRef.current
      channelRef.current = null
      if (channel) void channel.untrack().finally(() => void client.removeChannel(channel))
    }
  }, [captchaToken, track])

  useEffect(() => {
    void track()
  }, [pathname, track])

  useEffect(() => {
    const onVisibility = () => {
      const channel = channelRef.current
      if (!channel) return
      if (document.visibilityState === 'hidden') void channel.untrack()
      else void track()
    }
    const interval = window.setInterval(() => void track(), ACTIVITY_INTERVAL_MS)
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('focus', track)
    return () => {
      window.clearInterval(interval)
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('focus', track)
    }
  }, [track])

  const value = useMemo(() => ({ count, status }), [count, status])

  return (
    <VisitorPresenceContext.Provider value={value}>
      {children}
      {publicEnv.turnstileSiteKey && captchaToken === null ? (
        <div className="fixed bottom-0 left-0 z-[-1] size-px overflow-hidden" aria-hidden>
          <Turnstile
            siteKey={publicEnv.turnstileSiteKey}
            options={{ size: 'invisible', action: 'portfolio_presence' }}
            onSuccess={setCaptchaToken}
            onError={() => setStatus('unavailable')}
          />
        </div>
      ) : null}
    </VisitorPresenceContext.Provider>
  )
}

export function useVisitorPresence(): VisitorPresenceValue {
  const value = useContext(VisitorPresenceContext)
  if (!value) throw new Error('useVisitorPresence must be used within VisitorPresenceProvider')
  return value
}
