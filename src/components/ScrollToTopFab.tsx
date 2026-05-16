import { ChevronUp } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { portfolio } from '@/content/portfolio'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { cn } from '@/utils/cn'

/** Past this offset the FAB appears (avoids flash on initial project scroll-lock). */
const SHOW_AFTER_SCROLL_Y = 280

export function ScrollToTopFab() {
  const copy = portfolio.scrollToTopFab
  const prefersReducedMotion = usePrefersReducedMotion()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const sync = () => setVisible(window.scrollY > SHOW_AFTER_SCROLL_Y)
    sync()
    window.addEventListener('scroll', sync, { passive: true })
    return () => window.removeEventListener('scroll', sync)
  }, [])

  if (!visible) return null

  return (
    <div
      className={cn(
        'fixed z-[31]',
        'bottom-[max(1rem,calc(env(safe-area-inset-bottom,0px)+4px))]',
        'right-[max(1rem,calc(10%+env(safe-area-inset-right,0px)))]',
      )}
    >
      <Button
        type="button"
        variant="accentSecondary"
        size="icon"
        aria-label={copy.ariaLabel}
        className={cn('rounded-xl border border-border bg-background/90 shadow-md backdrop-blur-sm')}
        onClick={() =>
          window.scrollTo({
            top: 0,
            behavior: prefersReducedMotion ? 'auto' : 'smooth',
          })
        }
      >
        <ChevronUp className="size-5 shrink-0" aria-hidden />
      </Button>
    </div>
  )
}
