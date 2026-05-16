import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'

import { MonitorFrame, PhoneFrame } from '@/components/device/DeviceFrames'
import { portfolio, type ProjectKind, type ProjectPageImage, type ProjectScreens } from '@/content/portfolio'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { cn } from '@/utils/cn'

type ScrollDeviceShowcaseProps = {
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

function screenLabel(slide: ProjectPageImage): string {
  return slide.label ?? slide.alt
}

/** Document Y of element top (stable while element is in layout). */
function elementDocumentTop(el: HTMLElement): number {
  const r = el.getBoundingClientRect()
  return window.scrollY + r.top
}

function readNavbarHeightPx(): number {
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--navbar-height').trim()
  if (raw.endsWith('rem')) return parseFloat(raw) * 16
  if (raw.endsWith('px')) return parseFloat(raw)
  const n = Number.parseFloat(raw)
  return Number.isFinite(n) ? n : 120
}

export function ScrollDeviceShowcase({
  images,
  fallbackScreens,
  kind,
  projectTitle,
  className,
}: ScrollDeviceShowcaseProps) {
  const copy = portfolio.projectDetailPage
  const alts = portfolio.works.devicePreviewAlt
  const scrollRef = useRef<HTMLDivElement>(null)
  const reducedMotion = usePrefersReducedMotion()

  const slides = useMemo(
    () => buildSlides(images, fallbackScreens, kind, projectTitle, alts),
    [images, fallbackScreens, kind, projectTitle, alts],
  )

  const [activeIndex, setActiveIndex] = useState(0)

  /**
   * Progress 0 = top of showcase aligned with viewport top; 1 = bottom aligned with viewport bottom.
   * Same math as scrollToSlide so button jumps and scroll tracking stay in sync.
   */
  const readProgressAndIndex = useCallback(() => {
    const el = scrollRef.current
    const n = slides.length
    if (!el || n <= 1) return { progress: 0, index: 0 }
    const top = elementDocumentTop(el)
    const H = el.offsetHeight
    const V = window.innerHeight
    const range = H - V
    if (range <= 0) {
      return { progress: 0, index: 0 }
    }
    const progress = Math.min(1, Math.max(0, (window.scrollY - top) / range))
    const index = Math.min(n - 1, Math.max(0, Math.floor(progress * n)))
    return { progress, index }
  }, [slides.length])

  const syncIndexFromScroll = useCallback(() => {
    setActiveIndex(readProgressAndIndex().index)
  }, [readProgressAndIndex])

  useEffect(() => {
    syncIndexFromScroll()
    window.addEventListener('scroll', syncIndexFromScroll, { passive: true })
    window.addEventListener('resize', syncIndexFromScroll, { passive: true })
    const el = scrollRef.current
    let ro: ResizeObserver | undefined
    if (el) {
      ro = new ResizeObserver(() => {
        syncIndexFromScroll()
      })
      ro.observe(el)
    }
    return () => {
      window.removeEventListener('scroll', syncIndexFromScroll)
      window.removeEventListener('resize', syncIndexFromScroll)
      ro?.disconnect()
    }
  }, [syncIndexFromScroll])

  useLayoutEffect(() => {
    const el = scrollRef.current
    if (!el || slides.length === 0) return
    const top = elementDocumentTop(el)
    const nav = readNavbarHeightPx()
    window.scrollTo({ top: Math.max(0, top - nav), behavior: 'auto' })
    setActiveIndex(0)
  }, [projectTitle, slides.length])

  const scrollToSlide = useCallback(
    (idx: number) => {
      const el = scrollRef.current
      if (!el || slides.length <= 1) return
      const top = elementDocumentTop(el)
      const H = el.offsetHeight
      const V = window.innerHeight
      const range = H - V
      if (range <= 0) return
      const p = (idx + 0.5) / slides.length
      window.scrollTo({ top: top + p * range, behavior: 'smooth' })
    },
    [slides.length],
  )

  const activeSlide = slides[activeIndex]
  const liveMessage = activeSlide
    ? `${copy.showcaseProgressAriaLabelPrefix} ${screenLabel(activeSlide)}`
    : ''

  if (slides.length === 0) return null

  if (reducedMotion) {
    return (
      <section
        role="region"
        aria-label={copy.screenshotsHeading}
        className={cn(
          'border-b border-border bg-background px-[10%] py-10 md:py-14',
          className,
        )}
      >
        <p className="sr-only">{copy.showcaseReducedMotionHint}</p>
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-10">
          {kind === 'website' ? (
            <MonitorFrame
              src={slides[0]!.src}
              visible
              canAnimate={false}
              flat
              desktopAlt={slides[0]!.alt}
              className="w-full max-w-[min(100%,820px)]"
            />
          ) : (
            <PhoneFrame
              src={slides[0]!.src}
              visible
              canAnimate={false}
              flat
              phoneAlt={slides[0]!.alt}
              className="mx-auto w-full max-w-[min(280px,88vw)]"
            />
          )}
          <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {slides.map((slide, i) => (
              <figure
                key={`${i}-${slide.src}`}
                className="overflow-hidden rounded-2xl border border-border bg-muted/40"
              >
                <img
                  src={slide.src}
                  alt={slide.alt}
                  className={cn(
                    'aspect-[9/19] w-full object-cover object-top',
                    kind === 'website' && 'aspect-video',
                  )}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                />
                <figcaption className="border-t border-border px-2 py-1.5 text-center text-[10px] font-medium text-muted-foreground">
                  {screenLabel(slide)}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    )
  }

  const scrollHeightVh = 1 + slides.length * 0.5

  return (
    <section
      role="region"
      aria-label={copy.screenshotsHeading}
      className={cn('border-b border-border bg-background', className)}
    >
      <div
        ref={scrollRef}
        className="relative w-full"
        style={{ minHeight: `${scrollHeightVh * 100}dvh` }}
      >
        <div aria-live="polite" className="sr-only">
          {liveMessage}
        </div>

        <div className="pointer-events-none absolute left-1/2 top-0 h-[45%] w-[55%] -translate-x-1/2 rounded-full bg-primary/[0.045] blur-[90px]" aria-hidden />

        <div className="sticky top-0 flex min-h-[100dvh] items-center px-[10%] py-10 md:py-14 lg:justify-center lg:gap-16">
          <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-12 xl:gap-16">
            <div className="flex w-full flex-1 flex-col items-center lg:items-start lg:pl-[2%]">
              {kind === 'website' ? (
                <MonitorFrame
                  visible
                  canAnimate={false}
                  flat
                  desktopAlt={slides[activeIndex]?.alt ?? alts.desktop}
                  className="w-full max-w-[min(100%,760px)]"
                >
                  <div className="relative h-full w-full overflow-hidden">
                    <AnimatePresence mode="popLayout" initial={false}>
                      {activeSlide ? (
                        <motion.img
                          key={activeIndex}
                          src={activeSlide.src}
                          alt={activeSlide.alt}
                          initial={{ y: '100%', opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: '-20%', opacity: 0 }}
                          transition={{
                            duration: 0.5,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          className="pointer-events-none absolute inset-0 h-full w-full object-cover object-top"
                          draggable={false}
                          loading={activeIndex === 0 ? 'eager' : 'lazy'}
                          decoding="async"
                        />
                      ) : null}
                    </AnimatePresence>
                  </div>
                </MonitorFrame>
              ) : (
                <PhoneFrame
                  visible
                  canAnimate={false}
                  flat
                  phoneAlt={slides[activeIndex]?.alt ?? alts.phone}
                  className="w-full max-w-[min(280px,88vw)] lg:max-w-[300px]"
                >
                  <div className="relative h-full w-full overflow-hidden">
                    <AnimatePresence mode="popLayout" initial={false}>
                      {activeSlide ? (
                        <motion.img
                          key={activeIndex}
                          src={activeSlide.src}
                          alt={activeSlide.alt}
                          initial={{ y: '100%', opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: '-20%', opacity: 0 }}
                          transition={{
                            duration: 0.5,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          className="pointer-events-none absolute inset-0 h-full w-full object-cover object-top"
                          draggable={false}
                          loading={activeIndex === 0 ? 'eager' : 'lazy'}
                          decoding="async"
                        />
                      ) : null}
                    </AnimatePresence>
                  </div>
                </PhoneFrame>
              )}
            </div>

            <aside
              className="flex w-full shrink-0 flex-row flex-wrap items-center justify-center gap-2 lg:w-auto lg:flex-col lg:items-stretch lg:gap-3 lg:pr-[2%]"
              aria-label={`${copy.screenshotsHeading} progress`}
            >
              {slides.map((slide, i) => (
                <div
                  key={`${i}-${slide.src}`}
                  className="flex items-center gap-2 lg:w-full lg:max-w-[14rem] lg:gap-3"
                >
                  <button
                    type="button"
                    onClick={() => scrollToSlide(i)}
                    aria-current={i === activeIndex ? 'true' : undefined}
                    aria-label={`${copy.showcaseJumpToSlideLabel} ${i + 1}: ${screenLabel(slide)}`}
                    className={cn(
                      'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-[11px] font-bold transition-colors',
                      'outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                      i === activeIndex
                        ? 'border-accent-foreground bg-primary/25 text-accent-foreground'
                        : 'border-border bg-muted/50 text-muted-foreground hover:border-primary/35 hover:bg-muted',
                    )}
                  >
                    {i + 1}
                  </button>
                  <span
                    className={cn(
                      'hidden text-start text-xs leading-snug lg:block',
                      i === activeIndex ? 'font-semibold text-foreground' : 'text-muted-foreground',
                    )}
                  >
                    {screenLabel(slide)}
                  </span>
                </div>
              ))}
            </aside>
          </div>
        </div>
      </div>
    </section>
  )
}
