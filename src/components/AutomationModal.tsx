import type { LucideIcon } from 'lucide-react'
import {
  Bot,
  Calculator,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Database,
  ExternalLink,
  FileSearch,
  FolderOpen,
  GitFork,
  Layers,
  MailCheck,
  MapPinned,
  MessageCircle,
  ReceiptText,
  ScanText,
  ShieldCheck,
  TableProperties,
  Workflow,
} from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { createElement, useCallback, useEffect, useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { BrandSkillLogo } from '@/components/BrandSkillLogo'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  automationCategoryLabel,
  portfolio,
  type AutomationProject,
} from '@/content/portfolio'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { cn } from '@/utils/cn'

const SLIDE_TRANSITION = {
  duration: 0.5,
  ease: [0.22, 1, 0.36, 1] as const,
}

export const AUTOMATION_DIALOG_CONTENT_CLASS =
  'max-h-[calc(100dvh-1rem)] w-[calc(100vw-1rem)] max-w-2xl gap-0 overflow-y-auto overscroll-contain p-0 sm:max-h-[calc(100dvh-2rem)] sm:w-[calc(100vw-2rem)] sm:max-w-2xl'

/** 1 = next (right arrow), -1 = previous (left arrow) */
type SlideDirection = 1 | -1

const slideVariants = {
  enter: (direction: SlideDirection) => ({
    x: direction === 1 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: SlideDirection) => ({
    x: direction === 1 ? '-100%' : '100%',
    opacity: 0,
  }),
}

/** Lucide-outline icons themed: brand gradient stroke in light mode, accent in dark mode. */
function GradientStrokeIcon({
  icon: Icon,
  className,
  'aria-hidden': ariaHidden = true,
}: {
  icon: LucideIcon
  className?: string
  'aria-hidden'?: boolean
}) {
  return (
    <Icon
      aria-hidden={ariaHidden}
      className={cn(
        'shrink-0 stroke-[url(#automationModalIconStrokeLight)] dark:stroke-accent-foreground',
        className,
      )}
      strokeWidth={2}
      fill="none"
    />
  )
}

type AutomationSlide = {
  src: string
  label: string
}

function buildSlides(project: AutomationProject): readonly AutomationSlide[] {
  return [project.image, ...(project.galleryImages ?? [])].map((src, index) => ({
    src,
    label: project.imageLabels[index] ?? project.title,
  }))
}

function slideLabelIcon(label: string): LucideIcon {
  const normalized = label.toLowerCase()
  if (normalized.includes('map') || normalized.includes('scrap')) return MapPinned
  if (normalized.includes('telegram') || normalized.includes('notification')) return MessageCircle
  if (normalized.includes('mail') || normalized.includes('outreach')) return MailCheck
  if (normalized.includes('spam') || normalized.includes('cleanup')) return ShieldCheck
  if (normalized.includes('receipt')) return ReceiptText
  if (normalized.includes('form') || normalized.includes('review request')) return ClipboardList
  if (normalized.includes('calendar') || normalized.includes('monthly close')) return CalendarDays
  if (
    normalized.includes('result') ||
    normalized.includes('sheet') ||
    normalized.includes('report') ||
    normalized.includes('sales tracker')
  ) return TableProperties
  if (normalized.includes('pipeline') || normalized.includes('routing')) return GitFork
  if (normalized.includes('folder') || normalized.includes('drive')) return FolderOpen
  if (normalized.includes('transaction')) return Calculator
  if (normalized.includes('extract')) return ScanText
  if (normalized.includes('document') || normalized.includes('processing')) return FileSearch
  if (normalized.includes('agent') || normalized.includes('ai ')) return Bot
  return Workflow
}

export function AutomationImageCaption({
  label,
  index,
  total,
  className,
}: {
  label: string
  index: number
  total: number
  className?: string
}) {
  return (
    <figcaption
      aria-atomic="true"
      aria-live="polite"
      className={cn(
        'pointer-events-none absolute bottom-3 left-1/2 z-10 flex max-w-[calc(100%-6.5rem)] -translate-x-1/2 items-center gap-2 rounded-full border border-border/80 bg-background/90 px-3 py-1.5 text-foreground shadow-lg backdrop-blur-md',
        className,
      )}
    >
      {createElement(slideLabelIcon(label), {
        className: 'size-3.5 shrink-0 text-accent-foreground',
        strokeWidth: 2,
        'aria-hidden': true,
      })}
      <span className="truncate text-[11px] font-semibold sm:text-xs">{label}</span>
      <span
        className="shrink-0 text-[10px] font-medium tabular-nums text-muted-foreground"
        aria-label={`Image ${index + 1} of ${total}`}
      >
        {index + 1}/{total}
      </span>
    </figcaption>
  )
}

/**
 * Heading row shares one column with stacked chips beneath; chips align with heading text start.
 */
function AutomationDetailBlock({
  sectionIcon: SectionIcon,
  heading,
  items,
}: {
  sectionIcon: LucideIcon
  heading: string
  items: readonly string[]
}) {
  if (items.length === 0) return null

  return (
    <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-2 gap-y-3">
      <GradientStrokeIcon
        icon={SectionIcon}
        className="col-start-1 row-start-1 size-3 shrink-0 self-center"
      />
      <p className="col-start-2 row-start-1 text-xs font-bold uppercase tracking-widest text-foreground">
        {heading}
      </p>
      <div className="col-start-2 row-start-2 flex min-w-0 flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className={cn(
              'inline-flex items-center gap-2 rounded-full border border-border bg-muted/60 px-3 py-1 text-xs font-medium text-foreground',
              'dark:border-primary/15 dark:bg-muted/40',
            )}
          >
            <BrandSkillLogo label={item} variant="techPill" className="size-4" />
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

type AutomationModalImageHeroProps = {
  project: AutomationProject
  previousImageLabel: string
  nextImageLabel: string
}

function AutomationModalImageHero({
  project,
  previousImageLabel,
  nextImageLabel,
}: AutomationModalImageHeroProps) {
  const slides = useMemo(() => buildSlides(project), [project])
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState<SlideDirection>(1)
  const reducedMotion = usePrefersReducedMotion()
  const total = slides.length
  const hasCarousel = total > 1
  const useSlideAnimation = hasCarousel && !reducedMotion

  const goPrev = useCallback(() => {
    setDirection(-1)
    setActiveIndex((i) => (i - 1 + total) % total)
  }, [total])

  const goNext = useCallback(() => {
    setDirection(1)
    setActiveIndex((i) => (i + 1) % total)
  }, [total])

  useEffect(() => {
    if (!hasCarousel) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        goPrev()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        goNext()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [hasCarousel, goPrev, goNext])

  const activeSlide = slides[activeIndex] ?? { src: project.image, label: project.title }
  const activeLabel = activeSlide.label
  const imageAlt = `${project.title} — ${activeLabel}`

  return (
    <figure className="relative aspect-video w-full overflow-hidden border-b border-border bg-muted">
      <div className="relative h-full w-full overflow-hidden">
        {useSlideAnimation ? (
          <AnimatePresence mode="popLayout" initial={false} custom={direction}>
            <motion.img
              key={activeIndex}
              src={activeSlide.src}
              alt={imageAlt}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={SLIDE_TRANSITION}
              className="pointer-events-none absolute inset-0 h-full w-full object-cover object-top"
              draggable={false}
              loading={activeIndex === 0 ? 'eager' : 'lazy'}
              decoding="async"
            />
          </AnimatePresence>
        ) : (
          <img
            key={activeSlide.src}
            src={activeSlide.src}
            alt={imageAlt}
            className="h-full w-full object-cover object-top"
            loading={activeIndex === 0 ? 'eager' : 'lazy'}
            decoding="async"
          />
        )}
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.06)_0%,rgba(0,0,0,0)_45%,rgba(0,0,0,0.35)_100%)]"
      />

      <AutomationImageCaption label={activeLabel} index={activeIndex} total={total} />

      {hasCarousel ? (
        <>
          <button
            type="button"
            onClick={goPrev}
            aria-label={previousImageLabel}
            className="absolute left-2 top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/85 text-muted-foreground shadow-md backdrop-blur-sm transition-colors hover:text-foreground active:scale-95 sm:left-3"
          >
            <ChevronLeft className="size-5" aria-hidden />
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label={nextImageLabel}
            className="absolute right-2 top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/85 text-muted-foreground shadow-md backdrop-blur-sm transition-colors hover:text-foreground active:scale-95 sm:right-3"
          >
            <ChevronRight className="size-5" aria-hidden />
          </button>
        </>
      ) : null}
    </figure>
  )
}

type AutomationModalProps = {
  project: AutomationProject | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AutomationModal({ project, open, onOpenChange }: AutomationModalProps) {
  const copy = portfolio.automationModal
  const projectOpen = !!(open && project)

  const linkLabel =
    project?.link && project.link.variant === 'mobile'
      ? copy.openLinkLabelMobile
      : copy.openLinkLabelWeb

  return (
    <>
      {/* Gradient defs for outlined icons — top-to-bottom stops aligned with ContactSection */}
      <svg width={0} height={0} className="pointer-events-none fixed" aria-hidden focusable={false}>
        <defs>
          <linearGradient
            id="automationModalIconStrokeLight"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
            gradientUnits="objectBoundingBox"
          >
            <stop offset="0%" stopColor="#fbcfe8" />
            <stop offset="28%" stopColor="#E879F9" />
            <stop offset="58%" stopColor="#B76EF5" />
            <stop offset="100%" stopColor="#5E32C0" />
          </linearGradient>
        </defs>
      </svg>

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className={AUTOMATION_DIALOG_CONTENT_CLASS}>
          {projectOpen ? (
            <>
              <AutomationModalImageHero
                key={project.id}
                project={project}
                previousImageLabel={copy.previousImage}
                nextImageLabel={copy.nextImage}
              />

              <div className="flex flex-col gap-4 p-4 sm:gap-5 sm:p-7">
                <DialogHeader className="space-y-3 text-left">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-accent-foreground/90">
                    {copy.eyebrow}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.categories.map((id) => (
                      <span
                        key={id}
                        className="rounded-full border border-primary/25 bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-accent-foreground"
                      >
                        {automationCategoryLabel(portfolio.automation.categoryFilters, id)}
                      </span>
                    ))}
                  </div>
                  <DialogTitle className="text-[clamp(1.125rem,0.75rem+1.5vw,1.5rem)] font-bold leading-snug tracking-tight">
                    {project.title}
                  </DialogTitle>
                  <DialogDescription className="text-left text-[clamp(0.8125rem,0.6rem+0.95vw,0.9375rem)] leading-relaxed text-muted-foreground">
                    {project.description}
                  </DialogDescription>
                </DialogHeader>

                <AutomationDetailBlock
                  sectionIcon={Layers}
                  heading={copy.techStackHeading}
                  items={project.tags}
                />

                <AutomationDetailBlock
                  sectionIcon={Database}
                  heading={copy.databaseHeading}
                  items={project.databases}
                />

                {project.link ? (
                  <Button variant="accent" className="w-full sm:w-auto" asChild>
                    <a href={project.link.href} target="_blank" rel="noopener noreferrer">
                      <span className="inline-flex items-center gap-2">
                        {linkLabel}
                        <ExternalLink className="size-4" aria-hidden />
                      </span>
                    </a>
                  </Button>
                ) : null}
              </div>
            </>
          ) : (
            <div className="flex min-h-[200px] flex-col items-center justify-center gap-2 p-10">
              <DialogHeader className="text-center">
                <DialogTitle>{copy.fallbackTitle}</DialogTitle>
              </DialogHeader>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
