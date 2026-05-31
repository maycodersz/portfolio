import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Handles two cases on every SPA route change:
 *
 * 1. Plain route (no hash) — e.g. `/cv`, `/work/:id`:
 *    Immediately scroll to the top so the user doesn't inherit the scroll
 *    offset from whichever section they came from.
 *
 * 2. Path + hash — e.g. `/#works`, `/#contact`:
 *    Scroll the matching section element into view (handles client render
 *    timing and overlay reveal delays).
 */
export function RouteHashScroll() {
  const { pathname, hash } = useLocation()

  useLayoutEffect(() => {
    // No hash → reset to top of the page
    if (!hash || hash === '#') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
      return
    }

    // Hash navigation only meaningful on the homepage
    if (pathname !== '/') return

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
