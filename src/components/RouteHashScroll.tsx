import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * One-page sections live under `/`. After SPA navigation updates `location.hash`, scroll the
 * matching element into view (covers client render timing and overlay reveal).
 */
export function RouteHashScroll() {
  const { pathname, hash } = useLocation()

  useLayoutEffect(() => {
    if (pathname !== '/' || !hash || hash === '#') return
    const id = decodeURIComponent(hash.slice(1))
    if (!id) return

    const scrollIntoSection = (): boolean => {
      const el = document.getElementById(id)
      if (!el) return false
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return true
    }

    if (scrollIntoSection()) return

    let raf = 0
    const timeouts: Array<ReturnType<typeof window.setTimeout>> = []

    raf = window.requestAnimationFrame(() => {
      if (scrollIntoSection()) return
      timeouts.push(window.setTimeout(scrollIntoSection, 200))
      timeouts.push(window.setTimeout(scrollIntoSection, 700))
    })

    return () => {
      window.cancelAnimationFrame(raf)
      timeouts.forEach(window.clearTimeout)
    }
  }, [pathname, hash])

  return null
}
