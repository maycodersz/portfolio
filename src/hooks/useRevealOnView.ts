import { useEffect, useRef, useState } from 'react'

/**
 * Tracks viewport intersection and bumps `revealKey` each time the element
 * crosses from not-intersecting → intersecting so CSS entrance animations can replay.
 */
export function useRevealOnView<T extends HTMLElement = HTMLElement>(options?: {
  threshold?: number
  rootMargin?: string
}) {
  const { threshold = 0.1, rootMargin = '0px' } = options ?? {}
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
      if (inView && !wasIntersectingRef.current) {
        setRevealKey((k) => k + 1)
      }
      wasIntersectingRef.current = inView
    }, { threshold, rootMargin })

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, rootMargin])

  return [ref, visible, revealKey] as const
}
