import { useLayoutEffect, useRef, useState } from 'react'
import type { ScrollDirection } from './useScrollDirection'

export type SectionAnimState = 'animating' | 'visible' | 'hidden'

/**
 * Decides the animation state for a section ONCE at the moment it enters the viewport,
 * then locks that decision for as long as it stays in view.
 *
 * - 'animating' : entered while scrolling down  → play entrance animation
 * - 'visible'   : entered while scrolling up    → show immediately, no animation
 * - 'hidden'    : not in viewport               → opacity-0
 *
 * Wiggling scroll direction while the section is already in view does NOT change
 * the state, preventing animation re-triggers on micro up/down movements.
 */
export function useSectionAnimState(
  isInView: boolean,
  scrollDir: ScrollDirection,
): SectionAnimState {
  const [state, setState] = useState<SectionAnimState>('hidden')
  const wasInView = useRef(false)

  useLayoutEffect(() => {
    if (isInView && !wasInView.current) {
      // Entered viewport — decide once based on current direction
      setState(scrollDir === 'up' ? 'visible' : 'animating')
      wasInView.current = true
    } else if (!isInView && wasInView.current) {
      // Left viewport — reset so next entry re-evaluates
      setState('hidden')
      wasInView.current = false
    }
    // Still in view → no change, regardless of scroll direction wiggles
  }, [isInView, scrollDir])

  return state
}
