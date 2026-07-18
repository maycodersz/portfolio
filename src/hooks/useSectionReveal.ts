/* State transitions are driven by IntersectionObserver and the shared cycle boundary. */
/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useLayoutEffect, useRef, useState } from 'react'

import { useRevealCycle } from '@/contexts/RevealCycleContext'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

type RevealPhase = 'hidden' | 'animating' | 'visible'

type UseSectionRevealOptions = {
  threshold?: number
  rootMargin?: string
  animationWindowMs?: number
  resetOnCycle?: boolean
}

export function useSectionReveal<T extends Element = HTMLElement>({
  threshold = 0.14,
  rootMargin = '0px 0px -12% 0px',
  animationWindowMs = 1900,
  resetOnCycle = true,
}: UseSectionRevealOptions = {}) {
  const ref = useRef<T | null>(null)
  const [isInView, setIsInView] = useState(false)
  const [phase, setPhase] = useState<RevealPhase>('hidden')
  const { cycleId, scrollDirection } = useRevealCycle()
  const prefersReducedMotion = usePrefersReducedMotion()
  const previousInViewRef = useRef(false)
  const playedCycleRef = useRef<number | null>(null)
  const effectiveCycle = resetOnCycle ? cycleId : 0

  useEffect(() => {
    const element = ref.current
    if (!element) return
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold, rootMargin },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [threshold, rootMargin])

  useLayoutEffect(() => {
    if (prefersReducedMotion) {
      playedCycleRef.current = effectiveCycle
      setPhase('visible')
      previousInViewRef.current = isInView
      return
    }

    if (playedCycleRef.current !== null && playedCycleRef.current !== effectiveCycle) {
      playedCycleRef.current = null
      setPhase(isInView ? 'visible' : 'hidden')
    }

    const entered = isInView && !previousInViewRef.current
    if (entered) {
      if (scrollDirection !== 'up' && playedCycleRef.current !== effectiveCycle) {
        playedCycleRef.current = effectiveCycle
        setPhase('animating')
      } else {
        setPhase('visible')
      }
    } else if (!isInView && playedCycleRef.current !== effectiveCycle) {
      setPhase('hidden')
    }

    previousInViewRef.current = isInView
  }, [effectiveCycle, isInView, prefersReducedMotion, scrollDirection])

  useEffect(() => {
    if (phase !== 'animating') return
    const timeoutId = window.setTimeout(() => setPhase('visible'), animationWindowMs)
    return () => window.clearTimeout(timeoutId)
  }, [animationWindowMs, phase])

  return {
    ref,
    isInView,
    isVisible: phase !== 'hidden',
    shouldAnimate: phase === 'animating',
    revealKey: effectiveCycle,
  } as const
}
