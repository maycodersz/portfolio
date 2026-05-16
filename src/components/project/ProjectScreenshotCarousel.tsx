import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import {
  portfolio,
  type ProjectKind,
  type ProjectPageImage,
  type ProjectScreens,
} from '@/content/portfolio'
import { cn } from '@/utils/cn'

type ProjectScreenshotCarouselProps = {
  images: readonly ProjectPageImage[]
  fallbackScreens: ProjectScreens
  kind: ProjectKind
  projectTitle: string
  className?: string
}

function buildSlides(
  images: readonly ProjectPageImage[],
  fallbackScreens: ProjectScreens,
  kind: ProjectKind,
  title: string,
  alts: typeof portfolio.works.devicePreviewAlt,
): ProjectPageImage[] {
  if (images.length > 0) return [...images]

  if (kind === 'website') {
    if (fallbackScreens.desktop) {
      return [{ src: fallbackScreens.desktop, alt: `${title} — ${alts.desktop}` }]
    }
    return []
  }
  return [{ src: fallbackScreens.phone, alt: `${title} — ${alts.phone}` }]
}

/** Horizontal scroll-snap screenshot carousel styled like the automation fan cards. */
export function ProjectScreenshotCarousel({
  images,
  fallbackScreens,
  kind,
  projectTitle,
  className,
}: ProjectScreenshotCarouselProps) {
  const copy = portfolio.projectDetailPage
  const alts = portfolio.works.devicePreviewAlt
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)

  const slides = useMemo(
    () => buildSlides(images, fallbackScreens, kind, projectTitle, alts),
    [images, fallbackScreens, kind, projectTitle, alts],
  )

  const total = slides.length

  /* ── Scroll tracking ──────────────────────────────────────── */
  const updateState = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const { scrollLeft, scrollWidth, clientWidth } = el
    const maxScroll = scrollWidth - clientWidth
    setCanPrev(scrollLeft > 4)
    setCanNext(scrollLeft < maxScroll - 4)
    // approximate active index from scroll position
    if (clientWidth > 0) {
      const idx = Math.round(scrollLeft / (scrollWidth / total))
      setActiveIndex(Math.max(0, Math.min(total - 1, idx)))
    }
  }, [total])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    updateState()
    el.addEventListener('scroll', updateState, { passive: true })
    const ro = new ResizeObserver(updateState)
    ro.observe(el)
    return () => {
      el.removeEventListener('scroll', updateState)
      ro.disconnect()
    }
  }, [updateState])

  const scrollToIndex = useCallback((idx: number) => {
    const el = scrollRef.current
    if (!el) return
    const items = el.querySelectorAll<HTMLElement>('[data-slide]')
    const target = items[idx]
    if (!target) return
    const offsetLeft = target.offsetLeft - el.offsetLeft
    el.scrollTo({ left: offsetLeft, behavior: 'smooth' })
  }, [])

  const goPrev = useCallback(() => scrollToIndex(Math.max(0, activeIndex - 1)), [activeIndex, scrollToIndex])
  const goNext = useCallback(() => scrollToIndex(Math.min(total - 1, activeIndex + 1)), [activeIndex, total, scrollToIndex])

  const isLandscape = kind === 'website'
  const slideWidthClass = isLandscape
    ? 'w-[min(86vw,820px)] sm:w-[min(82vw,820px)]'
    : 'w-[min(48vw,240px)] sm:w-[min(38vw,260px)]'
  const aspectClass = isLandscape ? 'aspect-video' : 'aspect-[9/19]'

  if (slides.length === 0) return null

  return (
    <div
      role="region"
      aria-label={copy.screenshotsHeading}
      className={cn(
        'relative w-full border-b border-border bg-background px-[10%] pb-10 pt-8 md:pb-12 md:pt-10',
        className,
      )}
    >
      {/* Decorative glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[55%] w-[60%] -translate-x-1/2 rounded-full bg-primary/[0.055] blur-[90px]"
      />

      <div className="relative mx-auto max-w-6xl">
        {/* Track */}
        <div
          ref={scrollRef}
          className={cn(
            'flex items-start gap-5 overflow-x-auto',
            'snap-x snap-mandatory scroll-smooth',
            '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
          )}
        >
          {slides.map((img, index) => {
            const isActive = index === activeIndex
            return (
              <figure
                key={`${index}-${img.src}`}
                data-slide
                className={cn(
                  'shrink-0 snap-center cursor-pointer transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
                  slideWidthClass,
                  isActive ? 'scale-100 opacity-100' : 'scale-[0.92] opacity-60',
                )}
                onClick={() => scrollToIndex(index)}
              >
                <div
                  className={cn(
                    'overflow-hidden rounded-2xl border bg-card transition-[border-color,box-shadow] duration-300',
                    isActive
                      ? 'border-primary/30 shadow-[0_28px_90px_-24px_rgb(124_79_226/50%),inset_0_1px_0_rgb(255_255_255/15%)] ring-1 ring-primary/10'
                      : 'border-border shadow-[0_12px_40px_-16px_rgb(0_0_0/30%),inset_0_1px_0_rgb(255_255_255/8%)]',
                  )}
                >
                  <div className="relative">
                    <img
                      src={img.src}
                      alt={img.alt}
                      className={cn('w-full object-cover object-top', aspectClass)}
                      loading={index === 0 ? 'eager' : 'lazy'}
                      decoding="async"
                    />
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.12)_0%,rgba(0,0,0,0.08)_50%,rgba(0,0,0,0.28)_100%)]"
                    />
                  </div>
                </div>
              </figure>
            )
          })}
        </div>

        {/* Floating prev arrow */}
        <button
          type="button"
          onClick={goPrev}
          disabled={!canPrev}
          aria-label={copy.carouselPrevLabel}
          className={cn(
            'absolute -left-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center',
            'rounded-full border border-border bg-background/80 text-muted-foreground shadow-md backdrop-blur-sm',
            'transition-colors hover:text-foreground active:scale-90',
            'disabled:pointer-events-none disabled:opacity-30',
          )}
        >
          <ChevronLeft className="size-5" />
        </button>

        {/* Floating next arrow */}
        <button
          type="button"
          onClick={goNext}
          disabled={!canNext}
          aria-label={copy.carouselNextLabel}
          className={cn(
            'absolute -right-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center',
            'rounded-full border border-border bg-background/80 text-muted-foreground shadow-md backdrop-blur-sm',
            'transition-colors hover:text-foreground active:scale-90',
            'disabled:pointer-events-none disabled:opacity-30',
          )}
        >
          <ChevronRight className="size-5" />
        </button>
      </div>

      {/* Pagination dots */}
      {total > 1 ? (
        <nav aria-label="Screenshot pagination" className="mt-6 flex items-center justify-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => scrollToIndex(i)}
              aria-label={`Go to screenshot ${i + 1}`}
              aria-current={i === activeIndex ? 'true' : undefined}
              className={cn(
                'rounded-full transition-all duration-300',
                i === activeIndex
                  ? 'w-5 h-2 bg-primary'
                  : 'h-2 w-2 bg-border hover:bg-muted-foreground/50',
              )}
            />
          ))}
        </nav>
      ) : null}
    </div>
  )
}
