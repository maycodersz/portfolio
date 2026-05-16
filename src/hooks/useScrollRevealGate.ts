import { useLayoutEffect, useRef, useState } from 'react'

/**
 * True for a short window after `isInView` becomes true (scroll into view).
 * Use to run entrance animations only on scroll, not on later UI events (e.g. card clicks).
 *
 * When `suppress` is true, the gate stays disarmed — useful for skipping
 * animations when scrolling in the wrong direction on mobile.
 */
export function useScrollRevealGate(isInView: boolean, holdMs = 900, suppress = false): boolean {
  const [armed, setArmed] = useState(false)
  const prevInView = useRef(false)

  useLayoutEffect(() => {
    if (isInView && !prevInView.current && !suppress) {
      setArmed(true)
      prevInView.current = true
      const id = window.setTimeout(() => setArmed(false), holdMs)
      return () => clearTimeout(id)
    }
    if (!isInView) {
      prevInView.current = false
      setArmed(false)
    }
  }, [isInView, holdMs, suppress])

  return armed
}
