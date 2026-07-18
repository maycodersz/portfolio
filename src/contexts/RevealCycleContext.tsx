/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useLocation } from 'react-router-dom'

export type ScrollDirection = 'down' | 'up' | null

type RevealCycleValue = {
  cycleId: number
  scrollDirection: ScrollDirection
}

const RevealCycleContext = createContext<RevealCycleValue | null>(null)

const SUBPAGE_ARM_Y = 300
const SUBPAGE_RESET_Y = 80
const HERO_RESET_RATIO = 0.6

export function RevealCycleProvider({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  const [cycleId, setCycleId] = useState(0)
  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>(null)
  const lastYRef = useRef(0)
  const resetArmedRef = useRef(false)

  useEffect(() => {
    lastYRef.current = window.scrollY

    const onScroll = () => {
      const y = window.scrollY
      const delta = y - lastYRef.current
      if (delta > 2) setScrollDirection('down')
      else if (delta < -2) setScrollDirection('up')
      lastYRef.current = y

      if (pathname !== '/') {
        if (y >= SUBPAGE_ARM_Y) resetArmedRef.current = true
        if (y <= SUBPAGE_RESET_Y && resetArmedRef.current) {
          resetArmedRef.current = false
          setCycleId((value) => value + 1)
        }
      }
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [pathname])

  useEffect(() => {
    resetArmedRef.current = false
    if (pathname !== '/') return
    const hero = document.getElementById('hero')
    if (!hero) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        const insideResetZone = entry.isIntersecting && entry.intersectionRatio >= HERO_RESET_RATIO
        if (!insideResetZone) {
          resetArmedRef.current = true
          return
        }
        if (resetArmedRef.current) {
          resetArmedRef.current = false
          setCycleId((value) => value + 1)
        }
      },
      { threshold: [0, HERO_RESET_RATIO, 1] },
    )

    observer.observe(hero)
    return () => observer.disconnect()
  }, [pathname])

  const value = useMemo(
    () => ({ cycleId, scrollDirection }),
    [cycleId, scrollDirection],
  )

  return <RevealCycleContext.Provider value={value}>{children}</RevealCycleContext.Provider>
}

export function useRevealCycle(): RevealCycleValue {
  const value = useContext(RevealCycleContext)
  if (!value) throw new Error('useRevealCycle must be used within RevealCycleProvider')
  return value
}
