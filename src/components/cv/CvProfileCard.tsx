import { Download } from 'lucide-react'

import cvProfile from '@/assets/cv/profile.png'
import { Button } from '@/components/ui/button'
import { useSectionReveal } from '@/hooks/useSectionReveal'
import { portfolio } from '@/content/portfolio'
import { cn } from '@/utils/cn'

export function CvProfileCard() {
  const { cv } = portfolio
  const { ref, isVisible, shouldAnimate: canAnim } = useSectionReveal<HTMLDivElement>({
    threshold: 0.08,
    rootMargin: '0px 0px -8% 0px',
  })

  return (
    <div
      ref={ref}
      className={cn(
        'flex h-full flex-col items-center justify-center gap-5 rounded-2xl border border-border p-6 text-center motion-reduce:animate-none sm:p-8',
        'bg-background dark:bg-white/[0.04] dark:backdrop-blur-sm',
        canAnim ? 'animate-stats-support-in' : isVisible ? 'opacity-100' : 'opacity-0',
      )}
    >
      {/* Profile photo */}
      <div className="relative">
        <div className="size-28 overflow-hidden rounded-full ring-2 ring-primary/20 ring-offset-2 ring-offset-background sm:size-32 lg:size-36">
          <img
            src={cvProfile}
            alt={cv.pageTitle}
            className="size-full object-cover"
          />
        </div>
        {/* Glow behind photo */}
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-4 -z-10 rounded-full bg-primary/[0.08] blur-2xl"
        />
      </div>

      {/* Name & subtitle */}
      <div>
        <h1 className="text-gradient-brand text-xl font-extrabold leading-tight tracking-[-0.02em] sm:text-2xl lg:text-[1.65rem]">
          {cv.pageTitle}
        </h1>
        <p className="mt-1.5 text-xs text-muted-foreground sm:text-sm">
          {cv.subtitle}
        </p>
      </div>

      {/* Download CV */}
      <Button variant="accent" size="sm" className="min-h-11 rounded-xl" asChild>
        <a
          href={cv.downloadHref}
          download
          data-analytics-event="resume_download"
          data-analytics-label="Download CV"
        >
          <span className="inline-flex items-center gap-2">
            <Download className="size-4 shrink-0" aria-hidden />
            {cv.downloadLabel}
          </span>
        </a>
      </Button>
    </div>
  )
}
