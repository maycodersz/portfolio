import { useState } from 'react'
import { portfolio, type StatItem } from '@/content/portfolio'
import { useCountUp } from '@/hooks/useCountUp'
import { useInView } from '@/hooks/useInView'
import { useSectionAnimState } from '@/hooks/useSectionAnimState'
import { useScrollDirection } from '@/hooks/useScrollDirection'
import { useScrollRevealGate } from '@/hooks/useScrollRevealGate'
import { CARD_DECK_STAGE_STYLE } from '@/utils/cardDeckStage'
import { cn } from '@/utils/cn'

/* ── Individual stat card ──────────────────────────────────────────────── */

interface StatCardProps {
  item: StatItem
  position: number
  total: number
  isFrontHovered: boolean
  onClick: () => void
  sectionInView: boolean
  /** True only briefly when the section first scrolls into view — runs shell/rise entrances, not on card clicks */
  scrollReveal: boolean
}

/** Back cards peek from top-left — gentle rotations (reduced tilt). */
const STACK = [
  { x: 0,   y: 0,   rotate: 0,    scale: 1,     opacity: 1   },
  { x: -28, y: -16, rotate: -2.5, scale: 0.97,  opacity: 0.88 },
  { x: -52, y: -30, rotate: -5,   scale: 0.94,  opacity: 0.72 },
]

function StatCard({
  item,
  position,
  total,
  isFrontHovered,
  onClick,
  sectionInView,
  scrollReveal,
}: StatCardProps) {
  const isFront = position === 0
  const countDurationMs = isFront ? (scrollReveal ? 560 : 340) : 820
  const count = useCountUp(item.value, isFront && sectionInView, {
    durationMs: countDurationMs,
    minBasis: 5,
  }) 
  const displayValue = isFront ? count : item.value

  const t = STACK[Math.min(position, STACK.length - 1)]
  const baseTransform = `translateX(${t.x}px) translateY(${t.y}px) rotate(${t.rotate}deg) scale(${t.scale})`
  /* Subtle hover tilt (reduced vs before) */
  const hoverTransform =
    isFront && isFrontHovered
      ? `perspective(900px) rotateX(-3deg) rotateY(4deg) translateX(${t.x}px) translateY(${t.y - 4}px) scale(${t.scale * 1.012})`
      : baseTransform

  /* Rear cards animate in first; front card pops last */
  const shellPopDelayMs = scrollReveal && sectionInView ? (total - 1 - position) * 100 : 0
  const contentRiseDelayMs =
    scrollReveal && sectionInView && isFront ? 130 + shellPopDelayMs : 0

  return (
    <div
      className={cn('absolute inset-0', !isFront && 'pointer-events-none')}
      style={{
        zIndex: total - position,
        opacity: sectionInView ? t.opacity : 0,
        transform: hoverTransform,
        transformOrigin: '85% 92%',
        transition:
          'transform 420ms cubic-bezier(0.22, 1, 0.36, 1), opacity 380ms ease-out',
      }}
      onClick={isFront ? onClick : undefined}
    >
      <div
        className={cn(
          'stat-card-shell relative h-full w-full overflow-hidden rounded-2xl',
          'shadow-[0_28px_90px_-24px_rgb(124_79_226/55%),inset_0_1px_0_rgb(255_255_255/22%)]',
          'ring-1 ring-black/10 dark:ring-white/30',
          sectionInView ? (scrollReveal ? 'animate-stat-pop-in' : 'opacity-100') : 'opacity-0',
        )}
        style={{
          animationDelay: scrollReveal && sectionInView ? `${shellPopDelayMs}ms` : undefined,
          background: 'var(--stat-card-surface-gradient)',
        }}
      >
        {/* Depth + readability */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/[0.38] via-black/[0.08] to-white/[0.12]"
        />

        <span aria-hidden className="pointer-events-none absolute -right-8 -top-8 h-[120px] w-[120px] rounded-full border border-white/25 sm:-right-14 sm:-top-14 sm:h-[220px] sm:w-[220px]" />
        <span aria-hidden className="pointer-events-none absolute -right-12 -top-12 h-[180px] w-[180px] rounded-full border border-white/15 sm:-right-20 sm:-top-20 sm:h-[320px] sm:w-[320px]" />
        <span aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-[240px] w-[240px] rounded-full border border-white/[0.09] sm:-right-28 sm:-top-28 sm:h-[420px] sm:w-[420px]" />

        <div
          className={cn(
            'relative flex h-full flex-col justify-end px-4 pb-4 pt-8 sm:px-7 sm:pb-8 sm:pt-12',
            isFront && sectionInView && scrollReveal && 'animate-stat-content-rise',
          )}
          style={{
            animationDelay: contentRiseDelayMs > 0 ? `${contentRiseDelayMs}ms` : undefined,
          }}
        >
          <div className="flex items-end gap-1 leading-none">
            <span
              className={cn(
                'font-black tracking-[-0.04em] text-white tabular-nums',
                'drop-shadow-[0_4px_24px_rgb(0_0_0/35%),0_0_40px_rgb(124_79_226/35%)]',
                isFront
                  ? 'text-[clamp(2rem,min(16vw,12vh),4.75rem)]'
                  : 'text-[clamp(1.5rem,min(10vw,8vh),3.25rem)]',
              )}
            >
              {displayValue}
            </span>
            {item.suffix ? (
              <span
                className={cn(
                  'font-black text-white drop-shadow-[0_2px_12px_rgb(0_0_0/30%)]',
                  isFront
                    ? 'mb-1 text-[clamp(1.25rem,min(7vw,5vh),2.75rem)] sm:mb-2'
                    : 'mb-1 text-[clamp(1rem,min(5vw,4vh),2rem)] sm:mb-2',
                )}
              >
                {item.suffix}
              </span>
            ) : null}
          </div>
          <p
            className={cn(
              'font-semibold leading-snug tracking-tight text-white drop-shadow-[0_2px_8px_rgb(0_0_0/45%)]',
              isFront ? 'mt-2 text-sm sm:mt-3 sm:text-lg' : 'mt-1.5 text-xs sm:mt-2 sm:text-sm',
            )}
          >
            {item.label}
          </p>
        </div>
      </div>
    </div>
  )
}

/* ── Card deck — aspect height:width = 5:4 ─────────────────────────────── */

function CardDeck({
  items,
  sectionInView,
  scrollReveal,
}: {
  items: readonly StatItem[]
  sectionInView: boolean
  scrollReveal: boolean
}) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isFrontHovered, setIsFrontHovered] = useState(false)

  const handleNext = () => {
    setActiveIndex((i) => (i + 1) % items.length)
    setIsFrontHovered(false)
  }

  return (
    <div className="flex w-full max-w-[80vw] flex-col items-center gap-4 sm:max-w-[70vw] lg:max-w-none">
      <div
        className="relative aspect-[4/5] w-full"
        style={CARD_DECK_STAGE_STYLE}
        onMouseEnter={() => setIsFrontHovered(true)}
        onMouseLeave={() => setIsFrontHovered(false)}
      >
        <div className="absolute inset-0 ml-6 mt-6 sm:ml-12 sm:mt-12">
          {[...items].map((item, i) => {
            const position = (i - activeIndex + items.length) % items.length
            return (
              <StatCard
                key={item.id}
                item={item}
                position={position}
                total={items.length}
                isFrontHovered={isFrontHovered && position === 0}
                onClick={handleNext}
                sectionInView={sectionInView}
                scrollReveal={scrollReveal}
              />
            )
          })}
        </div>
      </div>

      <nav
        aria-label={`${portfolio.stats.sectionAriaLabel} pagination`}
        className="flex justify-center gap-2"
      >
        {items.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => {
              setActiveIndex(i)
              setIsFrontHovered(false)
            }}
            aria-label={`${portfolio.stats.paginationGoToCardPrefix} ${i + 1}`}
            aria-current={i === activeIndex ? 'step' : undefined}
            className="flex min-h-11 min-w-11 items-center justify-center"
          >
            <span
              className={cn(
                'rounded-full transition-all duration-300',
                i === activeIndex
                  ? 'h-2 w-6 bg-primary'
                  : 'h-2 w-2 bg-muted-foreground/40 hover:bg-accent-foreground/50',
              )}
            />
          </button>
        ))}
      </nav>
    </div>
  )
}

/* ── Section — exactly 100vh ───────────────────────────────────────────── */

export function StatsSection() {
  const { stats } = portfolio
  const scrollDir = useScrollDirection()
  const suppress = scrollDir === 'up'

  const [sectionRef, isInView] = useInView<HTMLElement>({
    threshold: 0.14,
    rootMargin: '0px 0px -12% 0px',
  })
  const scrollReveal = useScrollRevealGate(isInView, 1820, suppress)
  const animState = useSectionAnimState(isInView, scrollDir)
  const canAnim = animState === 'animating'

  return (
    <section
      ref={sectionRef}
      id="cv"
      aria-label={stats.sectionAriaLabel}
      className="box-border flex min-h-[auto] scroll-mt-[var(--navbar-height)] flex-col overflow-hidden border-t border-border lg:min-h-dvh"
    >
      <div className="flex min-h-0 flex-1 items-center px-[6%] py-8 sm:px-[10%]">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-16">
          {/* Left — text */}
          <div className="flex flex-col justify-center">
            <p
              className={cn(
                'text-[11px] font-bold uppercase tracking-[0.38em] text-accent-foreground motion-reduce:animate-none',
                canAnim ? 'animate-stats-eyebrow-in' : animState !== 'hidden' ? 'opacity-100' : 'opacity-0',
              )}
            >
              {stats.eyebrow}
            </p>
            <h2
              className={cn(
                'mt-5 text-gradient-brand px-px py-px text-[clamp(1.75rem,4vw,2.65rem)] font-extrabold leading-[1.12] tracking-[-0.035em] motion-reduce:animate-none sm:text-[clamp(2rem,4.2vw,3rem)]',
                canAnim ? 'animate-stats-headline-in' : animState !== 'hidden' ? 'opacity-100' : 'opacity-0',
              )}
              style={{ animationDelay: canAnim ? '0.11s' : undefined }}
            >
              {stats.sectionQuestion}
            </h2>
          </div>

          {/* Right — cards */}
          <div className="flex items-center justify-center lg:justify-end">
            <CardDeck items={stats.items} sectionInView={isInView} scrollReveal={scrollReveal} />
          </div>
        </div>
      </div>
    </section>
  )
}
