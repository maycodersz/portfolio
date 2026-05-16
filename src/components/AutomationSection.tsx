import { ChevronLeft, ChevronRight } from 'lucide-react'
import { type CSSProperties, useState } from 'react'

import { AutomationModal } from '@/components/AutomationModal'
import { Button } from '@/components/ui/button'
import { WithCursorFollow } from '@/components/CursorFollowButton'
import {
  automationCategoryLabel,
  type AutomationCategory,
  type AutomationProject,
  portfolio,
} from '@/content/portfolio'
import { useInView } from '@/hooks/useInView'
import { useSectionAnimState } from '@/hooks/useSectionAnimState'
import { useScrollDirection } from '@/hooks/useScrollDirection'
import { useScrollRevealGate } from '@/hooks/useScrollRevealGate'
import { CARD_DECK_STAGE_STYLE } from '@/utils/cardDeckStage'
import { cn } from '@/utils/cn'

const auto = portfolio.automation

/* ── Category filter pills ──────────────────────────────────────────────── */

function categoryCount(cat: AutomationCategory) {
  if (cat === 'all') return portfolio.automationProjects.length
  return portfolio.automationProjects.filter((p) => p.categories.includes(cat)).length
}

function CategoryPills({
  active,
  onChange,
}: {
  active: AutomationCategory
  onChange: (c: AutomationCategory) => void
}) {
  return (
    <nav
      aria-label={auto.categoryFilterAriaLabel}
      className="flex flex-wrap gap-2"
    >
      {auto.categoryFilters.map(({ id, label }) => {
        const count = categoryCount(id)
        const isActive = active === id
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={cn(
              'flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors duration-150',
              isActive
                ? 'border-primary/30 bg-primary/15 text-accent-foreground'
                : 'border-border bg-muted text-muted-foreground hover:border-primary/20 hover:bg-accent/60 hover:text-accent-foreground',
            )}
          >
            {label}
            <span
              className={cn(
                'min-w-[1.25rem] rounded-full px-1 text-center text-[10px] font-bold tabular-nums transition-colors',
                isActive
                  ? 'bg-primary/20 text-accent-foreground'
                  : 'bg-muted-foreground/15 text-muted-foreground',
              )}
            >
              {count}
            </span>
          </button>
        )
      })}
    </nav>
  )
}

/* ── Fan carousel card ──────────────────────────────────────────────────── */

type FanSlot = 'center' | 'left' | 'right' | 'hidden'

function fanSlot(index: number, active: number, total: number): FanSlot {
  if (index === active) return 'center'
  if (index === (active - 1 + total) % total) return 'left'
  if (index === (active + 1) % total) return 'right'
  return 'hidden'
}

const FAN_STYLE: Record<FanSlot, CSSProperties> = {
  center: { transform: 'translateX(0) scale(1)',       opacity: 1,    pointerEvents: 'auto' },
  left:   { transform: 'translateX(-14%) scale(0.88)', opacity: 0.72, pointerEvents: 'auto' },
  right:  { transform: 'translateX(14%) scale(0.88)',  opacity: 0.72, pointerEvents: 'auto' },
  hidden: { transform: 'translateX(0) scale(0.75)',    opacity: 0,    pointerEvents: 'none' },
}

/** Matches Stats staggering (100ms steps): front tier pops last. */
function fanRevealShellDelayMs(slot: FanSlot): number | undefined {
  if (slot === 'hidden') return undefined
  const tier = slot === 'center' ? 0 : slot === 'left' ? 1 : 2
  return (2 - tier) * 100
}

function automationCardEyebrow(project: AutomationProject): string {
  return project.categories
    .map((c) => automationCategoryLabel(portfolio.automation.categoryFilters, c))
    .join(' · ')
}

type FanCardProps = {
  project: AutomationProject
  slot: FanSlot
  total: number
  onClickCenter: () => void
  onClickSide: () => void
  sectionInView: boolean
  scrollReveal: boolean
}

function FanCard({
  project,
  slot,
  total,
  onClickCenter,
  onClickSide,
  sectionInView,
  scrollReveal,
}: FanCardProps) {
  const isCenter = slot === 'center'

  const zIndex = slot === 'center' ? total + 1 : slot === 'hidden' ? 0 : total

  const shellDelayMs = scrollReveal && sectionInView ? fanRevealShellDelayMs(slot) : undefined
  const contentRiseDelayMs =
    scrollReveal && sectionInView && isCenter ? 130 + (shellDelayMs ?? 0) : 0

  const opacityOnStage = slot === 'hidden' ? 0 : sectionInView ? (FAN_STYLE[slot].opacity as number) : 0

  const cardInner = (
    <div
      className={cn(
        'flex h-full flex-col overflow-hidden rounded-2xl border bg-card transition-[border-color,box-shadow] duration-300',
        isCenter
          ? 'border-primary/30 shadow-[0_28px_90px_-24px_rgb(124_79_226/50%),inset_0_1px_0_rgb(255_255_255/15%)] ring-1 ring-primary/10'
          : 'border-border shadow-[0_12px_40px_-16px_rgb(0_0_0/30%),inset_0_1px_0_rgb(255_255_255/8%)]',
        slot !== 'hidden' && sectionInView
          ? scrollReveal
            ? 'animate-stat-pop-in'
            : 'opacity-100'
          : slot === 'hidden'
            ? ''
            : 'opacity-0',
      )}
      style={{
        animationDelay: shellDelayMs !== undefined ? `${shellDelayMs}ms` : undefined,
      }}
    >
      {/* ── Image / placeholder ─────────────────────────────────── */}
      <div className="relative w-full flex-[0_0_58%] overflow-hidden">
        {project.image ? (
          <img
            src={project.image}
            alt={project.title}
            className="h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div
            aria-hidden
            className="h-full w-full"
            style={{ background: 'var(--stat-card-surface-gradient)' }}
          />
        )}
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.12)_0%,rgba(0,0,0,0.08)_50%,rgba(0,0,0,0.38)_100%)]" />
      </div>

      {/* ── Metadata ────────────────────────────────────────────── */}
      <div
        className={cn(
          'flex min-h-0 flex-1 flex-col justify-start gap-3 px-4 pt-4 pb-3 sm:px-5 sm:pt-5 sm:pb-4',
          scrollReveal && sectionInView && isCenter && 'animate-stat-content-rise',
        )}
        style={{
          animationDelay: contentRiseDelayMs > 0 ? `${contentRiseDelayMs}ms` : undefined,
        }}
      >
        <span className="text-[11px] font-semibold uppercase tracking-wide text-accent-foreground">
          {automationCardEyebrow(project)}
        </span>
        <h3 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">{project.title}</h3>
        <p className="text-[15px] leading-relaxed text-muted-foreground">{project.description}</p>
      </div>
    </div>
  )

  return (
    <div
      className={cn('absolute inset-0', !isCenter && 'cursor-pointer')}
      style={{
        zIndex,
        opacity: opacityOnStage,
        transform: FAN_STYLE[slot].transform,
        pointerEvents: FAN_STYLE[slot].pointerEvents,
        transition: 'transform 420ms cubic-bezier(0.22,1,0.36,1), opacity 380ms ease-out',
      }}
      onClick={isCenter ? undefined : onClickSide}
    >
      {isCenter ? (
        <WithCursorFollow
          label={auto.viewWorkCursorLabel}
          onClick={onClickCenter}
          containerClassName="h-full"
        >
          {cardInner}
        </WithCursorFollow>
      ) : (
        cardInner
      )}
    </div>
  )
}

/* ── Card fan carousel ──────────────────────────────────────────────────── */

function CardDeckCarousel({
  projects,
  onOpen,
  sectionInView,
  scrollReveal,
}: {
  projects: readonly AutomationProject[]
  onOpen: (p: AutomationProject) => void
  sectionInView: boolean
  scrollReveal: boolean
}) {
  const [active, setActive] = useState(0)
  const total = projects.length
  const { carouselAria } = auto

  const goPrev = () => setActive((active - 1 + total) % total)
  const goNext = () => setActive((active + 1) % total)

  if (total === 0) {
    return (
      <div className="flex items-center justify-center py-24 text-muted-foreground" role="status">
        {auto.emptyCategoryMessage}
      </div>
    )
  }

  return (
    <div className="flex w-full max-w-[80vw] flex-col items-center gap-6 sm:max-w-[70vw] lg:max-w-none">
      {/* Fan stage with mobile arrows */}
      <div className="relative w-full">
        {/* Left arrow — mobile only */}
        <button
          type="button"
          onClick={goPrev}
          aria-label="Previous project"
          className="absolute -left-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/80 text-muted-foreground shadow-md backdrop-blur-sm transition-colors hover:text-foreground active:scale-90 sm:-left-5 lg:hidden"
        >
          <ChevronLeft className="size-5" />
        </button>

        {/* Right arrow — mobile only */}
        <button
          type="button"
          onClick={goNext}
          aria-label="Next project"
          className="absolute -right-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/80 text-muted-foreground shadow-md backdrop-blur-sm transition-colors hover:text-foreground active:scale-90 sm:-right-5 lg:hidden"
        >
          <ChevronRight className="size-5" />
        </button>

        <div
          className="relative aspect-[4/5] w-full"
          style={CARD_DECK_STAGE_STYLE}
        >
          {[...projects].map((project, i) => {
            const slot = fanSlot(i, active, total)
            return (
              <FanCard
                key={project.id}
                project={project}
                slot={slot}
                total={total}
                onClickCenter={() => onOpen(project)}
                onClickSide={() =>
                  slot === 'left'
                    ? goPrev()
                    : goNext()
                }
                sectionInView={sectionInView}
                scrollReveal={scrollReveal}
              />
            )
          })}
        </div>
      </div>

      {/* Pagination dots + mobile View Work */}
      <div className="flex flex-col items-center gap-3">
        <nav
          aria-label={`${auto.sectionAriaLabel} pagination`}
          className="flex items-center justify-center gap-2"
        >
          {projects.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`${carouselAria.goToCardPrefix} ${i + 1}`}
              aria-current={i === active ? 'step' : undefined}
              className="flex min-h-11 min-w-11 items-center justify-center"
            >
              <span
                className={cn(
                  'rounded-full transition-all duration-300',
                  i === active
                    ? 'h-2 w-6 bg-primary'
                    : 'h-2 w-2 bg-muted-foreground/40 hover:bg-accent-foreground/50',
                )}
              />
            </button>
          ))}
        </nav>

        {/* View Work — mobile only */}
        <Button
          variant="accent"
          size="sm"
          className="lg:hidden"
          onClick={() => {
            const current = projects[active]
            if (current) onOpen(current)
          }}
        >
          {auto.viewWorkCursorLabel} →
        </Button>
      </div>
    </div>
  )
}

/* ── Section ────────────────────────────────────────────────────────────── */

export function AutomationSection() {
  const [activeCategory, setActiveCategory] = useState<AutomationCategory>('all')
  const [modalProject, setModalProject] = useState<AutomationProject | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const scrollDir = useScrollDirection()
  const suppress = scrollDir === 'up'

  const [sectionRef, isInView] = useInView<HTMLElement>({
    threshold: 0.14,
    rootMargin: '0px 0px -12% 0px',
  })
  const scrollReveal = useScrollRevealGate(isInView, 1820, suppress)
  const animState = useSectionAnimState(isInView, scrollDir)
  const canAnim = animState === 'animating'

  const filteredProjects =
    activeCategory === 'all'
      ? portfolio.automationProjects
      : portfolio.automationProjects.filter((p) => p.categories.includes(activeCategory))

  const handleOpen = (project: AutomationProject) => {
    setModalProject(project)
    setModalOpen(true)
  }

  return (
    <section
      ref={sectionRef}
      id="automation"
      aria-label={auto.sectionAriaLabel}
      className="box-border flex min-h-[auto] flex-col overflow-hidden border-t border-border bg-background lg:min-h-dvh scroll-mt-[var(--navbar-height)]"
    >
      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 top-1/2 h-[60%] w-[30%] -translate-y-1/2 rounded-full bg-primary/[0.07] blur-[140px]"
      />

      <div className="relative z-[1] flex min-h-0 flex-1 items-center px-[6%] py-16 sm:px-[10%]">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-16">

          {/* ── Left column ───────────────── */}
          <div className="flex max-w-xl flex-col gap-6">
            <p
              className={cn(
                'text-[11px] font-bold uppercase tracking-[0.38em] text-accent-foreground motion-reduce:animate-none',
                canAnim ? 'animate-stats-eyebrow-in' : animState !== 'hidden' ? 'opacity-100' : 'opacity-0',
              )}
            >
              {auto.eyebrow}
            </p>

            <h2
              className={cn(
                'text-gradient-brand px-px py-px text-[clamp(2.5rem,5vw,3.75rem)] font-extrabold leading-[1.1] tracking-[-0.04em] motion-reduce:animate-none',
                canAnim ? 'animate-stats-headline-in' : animState !== 'hidden' ? 'opacity-100' : 'opacity-0',
              )}
              style={{ animationDelay: canAnim ? '0.12s' : undefined }}
            >
              {auto.title}
            </h2>

            <div>
              <p
                className={cn(
                  'text-sm leading-relaxed text-muted-foreground motion-reduce:animate-none sm:text-[15px]',
                  canAnim ? 'animate-stats-support-in' : animState !== 'hidden' ? 'opacity-100' : 'opacity-0',
                )}
                style={{ animationDelay: canAnim ? '0.48s' : undefined }}
              >
                {auto.description}
              </p>

              <div className="mt-2">
                <div
                  className={cn(
                    'motion-reduce:animate-none',
                    canAnim ? 'animate-stats-support-in' : animState !== 'hidden' ? 'opacity-100' : 'opacity-0',
                  )}
                  style={{ animationDelay: canAnim ? '0.72s' : undefined }}
                >
                  <CategoryPills active={activeCategory} onChange={setActiveCategory} />
                </div>
              </div>
            </div>
          </div>

          {/* ── Right column — cards ─────────────────── */}
          <div className="flex items-center justify-center lg:justify-end">
            <CardDeckCarousel
              key={activeCategory}
              projects={filteredProjects as readonly AutomationProject[]}
              onOpen={handleOpen}
              sectionInView={isInView}
              scrollReveal={scrollReveal}
            />
          </div>

        </div>
      </div>

      <AutomationModal project={modalProject} open={modalOpen} onOpenChange={setModalOpen} />
    </section>
  )
}


