import { useEffect, useRef, useState } from 'react'

export type ScrollDirection = 'down' | 'up' | null

/**
 * Returns the current scroll direction.
 * `'down'` when scrolling towards the bottom, `'up'` when scrolling towards the top.
 * `null` on initial load before any scroll has occurred.
 */
export function useScrollDirection(): ScrollDirection {
  const [direction, setDirection] = useState<ScrollDirection>(null)
  const lastY = useRef(0)

  useEffect(() => {
    lastY.current = window.scrollY

    const onScroll = () => {
      const y = window.scrollY
      const delta = y - lastY.current
      if (delta > 2) setDirection('down')
      else if (delta < -2) setDirection('up')
      lastY.current = y
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return direction
}
