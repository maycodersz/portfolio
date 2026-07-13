import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

import {
  viewWorkCursorFrostInset,
  viewWorkCursorGradientRing,
  viewWorkCursorGradientRingEmphasis,
} from '@/components/ui/button'
import { useSiteCursor } from '@/contexts/SiteCursorContext'
import { portfolio } from '@/content/portfolio'
import { useIsPointerFine } from '@/hooks/useIsPointerFine'
import { useCursorFollow } from '@/hooks/useCursorFollow'
import { cn } from '@/utils/cn'

type CursorFollowButtonProps = {
  x: number
  y: number
  visible: boolean
  label?: string
  className?: string
}

export function CursorFollowButton({
  x,
  y,
  visible,
  label = portfolio.works.viewWorkCursorLabel,
  className,
}: CursorFollowButtonProps) {
  const isPointerFine = useIsPointerFine()
  if (!isPointerFine) return null

  return createPortal(
    <div
      aria-hidden
      className={cn(
        'pointer-events-none fixed z-[9999] -translate-x-1/2 -translate-y-1/2',
        'transition-[opacity,transform] duration-200 ease-out',
        visible ? 'scale-100 opacity-100' : 'scale-75 opacity-0',
        className,
      )}
      style={{ left: x, top: y }}
    >
      <span
        className={cn(
          'relative inline-flex overflow-hidden rounded-full',
          viewWorkCursorGradientRing,
          visible && viewWorkCursorGradientRingEmphasis,
        )}
      >
        <span className={cn(viewWorkCursorFrostInset, 'text-sm font-semibold leading-snug tracking-tight')}>
          <span className="text-gradient-brand">{label}</span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            aria-hidden
            className="shrink-0 text-accent-foreground"
          >
            <path
              d="M2.5 7h9M8 3.5 11.5 7 8 10.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </span>
    </div>,
    document.body,
  )
}

type WithCursorFollowProps = {
  children: React.ReactNode
  label?: string
  className?: string
  containerClassName?: string
  onClick?: () => void
  ariaLabel?: string
}

export function WithCursorFollow({
  children,
  label,
  className,
  containerClassName,
  onClick,
  ariaLabel,
}: WithCursorFollowProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isPointerFine = useIsPointerFine()
  const { setPaperPlaneSuppressed } = useSiteCursor()
  const cursor = useCursorFollow(ref as React.RefObject<HTMLElement | null>)

  useEffect(() => {
    if (!isPointerFine) return
    const el = ref.current
    if (!el) return

    const onEnter = () => setPaperPlaneSuppressed(true)
    const onLeave = () => setPaperPlaneSuppressed(false)
    el.addEventListener('mouseenter', onEnter)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mouseenter', onEnter)
      el.removeEventListener('mouseleave', onLeave)
      setPaperPlaneSuppressed(false)
    }
  }, [isPointerFine, setPaperPlaneSuppressed])

  return (
    <div
      ref={ref}
      className={cn(
        'group outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        isPointerFine && 'cursor-none',
        containerClassName,
      )}
      onClick={onClick}
      onKeyDown={(event) => {
        if (!onClick || (event.key !== 'Enter' && event.key !== ' ')) return
        event.preventDefault()
        onClick()
      }}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={onClick ? (ariaLabel ?? label) : undefined}
    >
      {children}
      <CursorFollowButton {...cursor} label={label} className={className} />
    </div>
  )
}
