import { useEffect, useState } from 'react'

/**
 * Returns true when the primary pointer is a mouse (fine pointer).
 * Returns false on touch/coarse-pointer devices.
 * Defaults to false until the media query can be evaluated client-side.
 */
export function useIsPointerFine(): boolean {
  const [isPointerFine, setIsPointerFine] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches,
  )

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)')
    const handler = (e: MediaQueryListEvent) => setIsPointerFine(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return isPointerFine
}
