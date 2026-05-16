import { useEffect, useState } from 'react'

/** Phones only — matches Tailwind `md` lower bound (768px); tablets (`md`+) excluded. */
const MOBILE_MAX_WIDTH_QUERY = '(max-width: 767px)'

export function useIsMobileViewport(): boolean {
  const [mobile, setMobile] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(MOBILE_MAX_WIDTH_QUERY).matches : false,
  )

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_MAX_WIDTH_QUERY)
    const sync = () => setMobile(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  return mobile
}
