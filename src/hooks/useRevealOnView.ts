import { useEffect, useRef, useState } from 'react'

/**
 * Tracks viewport intersection and bumps `revealKey` each time the element
 * crosses from not-intersecting → intersecting so CSS entrance animations can replay.
 *
 * When `replayOnReenter` is false, `revealKey` increments only on the first intersect.
 * When `suppress` is true, `visible` still updates but `revealKey` won't bump — use
 * this to skip animations when scrolling in the wrong direction on mobile.
 */
export function useRevealOnView<T extends HTMLElement = HTMLElement>(options?: {
  threshold?: number
  rootMargin?: string
  replayOnReenter?: boolean
  suppress?: boolean
}) {
  const { threshold = 0.1, rootMargin = '0px', replayOnReenter = true, suppress = false } = options ?? {}
  const ref = useRef<T>(null)
  const [visible, setVisible] = useState(false)
  const [revealKey, setRevealKey] = useState(0)
  const wasIntersectingRef = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(([entry]) => {
      const inView = entry.isIntersecting
      setVisible(inView)
      if (inView && !wasIntersectingRef.current && !suppress) {
        if (replayOnReenter) {
          setRevealKey((k) => k + 1)
        } else {
          setRevealKey((k) => (k === 0 ? 1 : k))
        }
      }
      wasIntersectingRef.current = inView
    }, { threshold, rootMargin })

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, rootMargin, replayOnReenter, suppress])

  return [ref, visible, revealKey] as const
}
