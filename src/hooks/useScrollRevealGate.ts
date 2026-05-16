import { useLayoutEffect, useRef, useState } from 'react'

/**
 * True for a short window after `isInView` becomes true (scroll into view).
 * Use to run entrance animations only on scroll, not on later UI events (e.g. card clicks).
 */
export function useScrollRevealGate(isInView: boolean, holdMs = 900): boolean {
  const [armed, setArmed] = useState(false)
  const prevInView = useRef(false)

  useLayoutEffect(() => {
    if (isInView && !prevInView.current) {
      setArmed(true)
      prevInView.current = true
      const id = window.setTimeout(() => setArmed(false), holdMs)
      return () => clearTimeout(id)
    }
    if (!isInView) {
      prevInView.current = false
      setArmed(false)
    }
  }, [isInView, holdMs])

  return armed
}
