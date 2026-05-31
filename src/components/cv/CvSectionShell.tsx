import type { ReactNode } from 'react'

import { useInView } from '@/hooks/useInView'
import { useScrollDirection } from '@/hooks/useScrollDirection'
import { useSectionAnimState } from '@/hooks/useSectionAnimState'
import { cn } from '@/utils/cn'

type CvSectionShellProps = {
  title: string
  children: ReactNode
  className?: string
  /** When true the glass card stretches to fill available height (used in bento grid cells). */
  stretch?: boolean
}

export function CvSectionShell({ title, children, className, stretch }: CvSectionShellProps) {
  const scrollDir = useScrollDirection()
  const [ref, isInView] = useInView<HTMLDivElement>({
    threshold: 0.08,
    rootMargin: '0px 0px -8% 0px',
  })
  const animState = useSectionAnimState(isInView, scrollDir)
  const canAnim = animState === 'animating'

  return (
    <div ref={ref} className={cn('flex flex-col gap-4', stretch && 'h-full', className)}>
      {/* Section heading */}
      <h2
        className={cn(
          'text-[11px] font-bold uppercase tracking-[0.38em] text-accent-foreground motion-reduce:animate-none',
          canAnim ? 'animate-stats-eyebrow-in' : animState !== 'hidden' ? 'opacity-100' : 'opacity-0',
        )}
      >
        {title}
      </h2>

      {/* Glass card body */}
      <div
        className={cn(
          'rounded-2xl border border-border p-5 sm:p-6 motion-reduce:animate-none',
          'bg-background dark:bg-white/[0.04] dark:backdrop-blur-sm',
          stretch && 'flex-1',
          canAnim ? 'animate-stats-support-in' : animState !== 'hidden' ? 'opacity-100' : 'opacity-0',
        )}
        style={{ animationDelay: canAnim ? '0.12s' : undefined }}
      >
        {children}
      </div>
    </div>
  )
}
