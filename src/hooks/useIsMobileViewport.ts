import { useEffect, useState } from 'react'

/** Viewports below Tailwind `lg` (1024px) — phones and tablets. */
const BELOW_LG_MAX_WIDTH_QUERY = '(max-width: 1023px)'

export function useIsMobileViewport(): boolean {
  const [mobile, setMobile] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(BELOW_LG_MAX_WIDTH_QUERY).matches : false,
  )

  useEffect(() => {
    const mq = window.matchMedia(BELOW_LG_MAX_WIDTH_QUERY)
    const sync = () => setMobile(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  return mobile
}
