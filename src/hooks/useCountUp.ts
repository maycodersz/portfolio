import { useEffect, useRef, useState } from 'react'

export interface UseCountUpOptions {
  /** Total animation length in ms */
  durationMs?: number
  /**
   * At least this many integer steps when easing (e.g. 5 → always moves through 0→… like 0→5 pacing for small targets).
   */
  minBasis?: number
}

/**
 * Counts from 0 toward `target` with cubic ease-out.
 * Resets when `isActive` becomes false.
 */
export function useCountUp(
  target: number,
  isActive: boolean,
  durationMsOrOpts: number | UseCountUpOptions = 820,
): number {
  const opts: UseCountUpOptions =
    typeof durationMsOrOpts === 'number'
      ? { durationMs: durationMsOrOpts }
      : durationMsOrOpts
  const durationMs = opts.durationMs ?? 820
  const minBasis = opts.minBasis ?? 5

  const [count, setCount] = useState(0)
  const rafRef = useRef<number | null>(null)
  const startRef = useRef<number | null>(null)

  useEffect(() => {
    if (!isActive) {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
      startRef.current = null
      setCount(0)
      return
    }

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReduced) {
      setCount(target)
      return
    }

    if (target <= 0) {
      setCount(0)
      return
    }

    setCount(0)

    const tick = (timestamp: number) => {
      if (startRef.current === null) startRef.current = timestamp
      const elapsed = timestamp - startRef.current
      const progress = Math.min(elapsed / durationMs, 1)
      const eased = 1 - Math.pow(1 - progress, 3)

      if (progress >= 1) {
        setCount(target)
        return
      }

      const basis = Math.max(target, minBasis)
      const raw = eased * basis
      const next = Math.min(Math.floor(raw + 1e-9), target)
      setCount(next)

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [isActive, target, durationMs, minBasis])

  return count
}
