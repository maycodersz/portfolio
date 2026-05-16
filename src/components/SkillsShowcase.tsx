import {
  type CSSProperties,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import { BrandSkillLogo } from '@/components/BrandSkillLogo'
import { portfolio } from '@/content/portfolio'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/utils/cn'

function chunkPairs<T>(arr: readonly T[]): T[][] {
  const rows: T[][] = []
  for (let i = 0; i < arr.length; i += 2) {
    rows.push(arr.slice(i, i + 2) as T[])
  }
  return rows
}

/* Filter & color logic lives in index.css (.skill-chip-btn / .skill-chip-icon / .skill-chip-fallback)
   to avoid Tailwind v4 dark:group-hover specificity conflicts. */
const chipClass =
  'skill-chip-btn flex shrink-0 items-center rounded-md px-3 py-2 outline-none transition-[background,background-image] duration-200 ease-[cubic-bezier(0.33,_1,_0.68,_1)] hover:[background:var(--skill-chip-hover-gradient)] focus-visible:[background:var(--skill-chip-hover-gradient)] active:[background:var(--skill-chip-hover-gradient)] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none'

function SkillLogoChip({
  name,
  isSelected,
  onSelect,
}: {
  name: string
  isSelected: boolean
  onSelect: () => void
}) {
  return (
    <Tooltip delayDuration={120}>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label={name}
          aria-pressed={isSelected}
          onClick={onSelect}
          className={cn(chipClass, isSelected && 'skill-chip-btn--active')}
        >
          <BrandSkillLogo label={name} variant="marqueeChip" />
        </button>
      </TooltipTrigger>
      <TooltipContent>{name}</TooltipContent>
    </Tooltip>
  )
}

/** Wider fades; opaque enough at edges so loop joins stay hidden */
const fadeLeftClass =
  'pointer-events-none absolute inset-y-0 left-0 z-[3] w-[clamp(3rem,min(38%,13rem),_15rem)] max-sm:w-[32%] bg-gradient-to-r from-background via-background/90 to-transparent sm:via-background/82'
const fadeRightClass =
  'pointer-events-none absolute inset-y-0 right-0 z-[3] w-[clamp(3rem,min(38%,13rem),_15rem)] max-sm:w-[32%] bg-gradient-to-l from-background via-background/90 to-transparent sm:via-background/82'

/** Estimated width per logo chip incl. gap â€” repeat sequence until strip â‰¥ viewport */
const APPROX_CHIP_PX = 96

/** Repeat full `items` groups per half so the track is wider than the window; halves match for seamless -50% loop */
function SkillGroupMarquee({ items }: { items: readonly string[] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const [loopsInHalf, setLoopsInHalf] = useState(2)
  /** Index of the currently selected (locked-hover) chip, or null for none */
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null)

  const handleChipSelect = useCallback((idx: number) => {
    setSelectedIdx((prev) => (prev === idx ? null : idx))
  }, [])

  /** Tap/click outside this marquee block clears the selection */
  useEffect(() => {
    const onOutsidePointerDown = (e: PointerEvent) => {
      const el = containerRef.current
      if (!el || !(e.target instanceof Node)) return
      if (!el.contains(e.target)) setSelectedIdx(null)
    }
    document.addEventListener('pointerdown', onOutsidePointerDown)
    return () => document.removeEventListener('pointerdown', onOutsidePointerDown)
  }, [])

  useLayoutEffect(() => {
    const el = viewportRef.current
    if (!el || items.length === 0) return

    const run = () => {
      const cw = el.getBoundingClientRect().width
      if (cw <= 0) return
      const unitW = Math.max(items.length * APPROX_CHIP_PX, 140)
      const need = Math.max(2, Math.ceil((cw * 1.75) / unitW))
      setLoopsInHalf((p) => (p === need ? p : need))
    }

    run()
    const ro = new ResizeObserver(run)
    ro.observe(el)
    return () => ro.disconnect()
  }, [items])

  const half = useMemo(() => Array.from({ length: loopsInHalf }, () => [...items]).flat(), [items, loopsInHalf])
  const tracks = useMemo(() => [...half, ...half], [half])

  const durationSec = Math.max(10, Math.round(half.length * 1.4))
  const isPaused = selectedIdx !== null

  return (
    <div ref={containerRef} className="relative isolate min-h-[3.75rem] min-w-0 w-full select-none rounded-md bg-background">
      <div aria-hidden className={fadeLeftClass} />
      <div aria-hidden className={fadeRightClass} />

      <div
        ref={viewportRef}
        role="presentation"
        className={cn(
          'skills-marquee-row relative z-[1] w-full max-w-full overflow-hidden rounded-md sm:min-w-0',
          isPaused && 'skills-marquee-row--interaction-pause',
        )}
        style={{ '--skill-marquee-duration': `${durationSec}s` } as CSSProperties}
      >
        <div className="skill-marquee-track flex items-center gap-6 px-4 py-2 sm:gap-7 sm:px-5 sm:py-3">
          {tracks.map((skill, i) => (
            <SkillLogoChip
              key={`${skill}-${i}`}
              name={skill}
              isSelected={selectedIdx === i}
              onSelect={() => handleChipSelect(i)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function SkillCarouselBlock({ title, items }: { title: string; items: readonly string[] }) {
  return (
    <div className="flex w-full min-w-0 flex-col gap-3 text-left sm:gap-3.5">
      <h3 className="text-gradient-brand px-px py-px text-lg font-bold leading-tight tracking-[-0.03em] sm:text-xl">
        {title}
      </h3>
      <SkillGroupMarquee items={items} />
    </div>
  )
}

export function SkillsShowcase() {
  const { skillGroups, skillsNote } = portfolio

  const rows = useMemo(() => chunkPairs(skillGroups), [skillGroups])

  return (
    <TooltipProvider delayDuration={140} skipDelayDuration={0} disableHoverableContent>
      <section
        aria-label={portfolio.skillShowcase.sectionAriaLabel}
        className="relative z-0 scroll-mt-[var(--navbar-height)] bg-background"
      >
        <div className="divide-y divide-border">
          {rows.map((rowGroups, rowIndex) => (
            <div
              key={`row-${rowGroups.map((g) => g.name).join('|')}-${rowIndex}`}
              className={cn(
                'box-border px-[10%]',
                rowIndex === 0 ? 'pb-14 pt-[clamp(3.5rem,8vw,6rem)] md:pb-16 md:pt-24' : 'py-12 md:py-14',
              )}
            >
              <div className="grid min-w-0 grid-cols-1 items-start gap-x-12 gap-y-14 md:grid-cols-2 md:justify-items-stretch lg:gap-x-16 lg:gap-y-16">
                {rowGroups.map((group) => (
                  <div key={group.name} className="min-w-0 w-full text-left">
                    <SkillCarouselBlock title={group.name} items={group.items} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="border-t border-primary/15 px-[10%] py-10 text-center text-sm leading-relaxed text-muted-foreground">
          {skillsNote}
        </p>
      </section>
    </TooltipProvider>
  )
}

