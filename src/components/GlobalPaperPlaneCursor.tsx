import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Send } from 'lucide-react'

import { useSiteCursor } from '@/contexts/SiteCursorContext'
import { useIsPointerFine } from '@/hooks/useIsPointerFine'
import { cn } from '@/utils/cn'

/**
 * Site-wide paper-plane cursor (accent fill + glow). Parent shell should use `cursor-none`.
 * Hidden whenever `paperPlaneSuppressed` is true (e.g. over project cards with View Work).
 */
export function GlobalPaperPlaneCursor() {
  const { paperPlaneSuppressed } = useSiteCursor()
  const isPointerFine = useIsPointerFine()
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!isPointerFine) return
    const onMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY })
      setVisible(true)
    }
    const onLeaveDoc = () => setVisible(false)

    window.addEventListener('mousemove', onMove)
    document.documentElement.addEventListener('mouseleave', onLeaveDoc)

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.documentElement.removeEventListener('mouseleave', onLeaveDoc)
    }
  }, [isPointerFine])

  if (!isPointerFine) return null

  const showPlane = visible && !paperPlaneSuppressed

  return createPortal(
    <div
      aria-hidden
      className={cn(
        'pointer-events-none fixed z-[99999] -translate-x-1/2 -translate-y-1/2',
        'transition-[opacity,transform] duration-150 ease-out',
        showPlane ? 'scale-100 opacity-100' : 'scale-75 opacity-0',
      )}
      style={{ left: pos.x, top: pos.y }}
    >
      <Send
        size={30}
        className="text-primary drop-shadow-[0_0_8px_rgb(124_79_226/65%)]"
        fill="currentColor"
        strokeWidth={0}
        style={{ transform: 'rotate(-45deg)' }}
      />
    </div>,
    document.body,
  )
}
