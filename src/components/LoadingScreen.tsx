import { useEffect, useState } from 'react'

import alterEgoDarkImg from '@/assets/alter-ego-dark.png'
import alterEgoLightImg from '@/assets/alter-ego-light.png'
import profileDarkImg from '@/assets/profile-dark.png'
import profileLightImg from '@/assets/profile-light.png'
import { cn } from '@/utils/cn'

/**
 * Full-screen branded loading overlay.
 * Fades out once all critical images are loaded (or after 4s max).
 */

const CRITICAL_IMAGES = [profileDarkImg, profileLightImg, alterEgoDarkImg, alterEgoLightImg]
const MAX_WAIT_MS = 4000

function useCriticalImagesReady(): boolean {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let done = false

    const markReady = () => {
      if (done) return
      done = true
      setReady(true)
    }

    const timeout = window.setTimeout(markReady, MAX_WAIT_MS)

    let loaded = 0
    const total = CRITICAL_IMAGES.length

    CRITICAL_IMAGES.forEach((src) => {
      const img = new Image()
      img.onload = img.onerror = () => {
        loaded++
        if (loaded >= total) markReady()
      }
      img.src = src
    })

    return () => window.clearTimeout(timeout)
  }, [])

  return ready
}

export function LoadingScreen() {
  const ready = useCriticalImagesReady()
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (ready) {
      const id = window.setTimeout(() => setVisible(false), 450)
      return () => window.clearTimeout(id)
    }
  }, [ready])

  if (!visible) return null

  return (
    <div
      aria-hidden
      className={cn(
        'fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-6',
        'bg-[color:var(--color-page-background)]',
        'transition-opacity duration-[450ms] ease-out',
        ready ? 'pointer-events-none opacity-0' : 'opacity-100',
      )}
    >
      <span className="text-gradient-brand select-none px-px py-px text-3xl font-bold tracking-[-0.03em] sm:text-4xl">
        Maycoder
      </span>

      <div className="h-[2px] w-40 overflow-hidden rounded-full bg-border">
        <div className="h-full w-[60%] rounded-full bg-primary [animation:loading-bar_1.4s_ease-in-out_infinite]" />
      </div>

      <style>{`
        @keyframes loading-bar {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(260%); }
        }
      `}</style>
    </div>
  )
}
