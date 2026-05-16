import { Check } from 'lucide-react'

import { type PricingPlan, portfolio } from '@/content/portfolio'
import { useRevealOnView } from '@/hooks/useRevealOnView'
import { useSectionAnimState } from '@/hooks/useSectionAnimState'
import { useScrollDirection } from '@/hooks/useScrollDirection'
import { cn } from '@/utils/cn'

const p = portfolio.pricing

/** Same surface as ContactSection method/social tiles (icon rows): experiment on pricing cards. */
const pricingCardSurfaceLikeContact = cn(
  'bg-background',
  'dark:bg-white/[0.04] dark:backdrop-blur-sm',
)

/** Featured outer ring only (dark): strong white→purple ramp — matches main/accent CTA chrome. */
const popularDarkMainButtonBorderGradient =
  'dark:bg-none dark:bg-gradient-to-b dark:from-white dark:via-primary dark:to-[rgb(124_79_226)]'

/** “Most popular” pill: matches main/accent Button fill (dark = vertical accent ramp). */
const popularBadgeMainButtonDark = cn(
  'dark:border dark:border-primary/50 dark:text-white dark:backdrop-blur-md',
  'dark:bg-gradient-to-b dark:from-white/[0.28] dark:via-primary/30 dark:to-primary/[0.45]',
  'dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.42),0_8px_28px_-12px_rgb(124_79_226/42%)]',
)

/**
 * Gradient stroke + glow around featured plan — main/accent Button-style rim (esp. dark).
 */
function PopularGradientBorderShell({
  active,
  children,
}: {
  active: boolean
  children: React.ReactNode
}) {
  if (!active) return <>{children}</>
  return (
    <div
      className={cn(
        /* Gradient-filled pad = stroke; thicker so accent rim reads like main Button chrome */
        'relative isolate scale-[1.03] rounded-2xl p-[3px]',
        '[background-image:var(--brand-text-gradient)]',
        '[background-color:transparent]',
        /* Light — soft purple lift */
        'shadow-[0_12px_40px_-16px_rgb(147_51_234_/_22%),0_0_0_1px_rgb(147_51_234_/_12%)]',
        popularDarkMainButtonBorderGradient,
        /* Dark — main Button-style border glow (primary ring + lavender aura) */
        'dark:shadow-[0_0_0_1px_rgb(167_139_250/45%),0_0_0_2px_rgb(124_79_226/35%),0_16px_52px_-14px_rgb(124_79_226/55%),0_0_36px_-10px_rgb(167_139_250/30%)]',
      )}
    >
      {children}
    </div>
  )
}

/* ── Single pricing card ────────────────────────────────────────────────── */

function PricingCard({
  plan,
  delay,
  inView,
  canAnim,
}: {
  plan: PricingPlan
  delay: string
  inView: boolean
  canAnim: boolean
}) {
  const isPopular = !!plan.isPopular

  return (
    <div
      className={cn(
        'motion-reduce:animate-none',
        canAnim ? 'animate-stats-support-in' : inView ? 'opacity-100' : 'opacity-0',
      )}
      style={{ animationDelay: canAnim ? delay : undefined }}
    >
      <PopularGradientBorderShell active={isPopular}>
        <div
          className={cn(
            'relative flex flex-col gap-6 p-7 transition-all duration-300',
            isPopular ? 'rounded-[calc(1rem-3px)]' : 'rounded-2xl',
            'hover:-translate-y-1.5 active:scale-[0.98] active:duration-150',
            /* Match ContactSection icon tiles — bg + subtle frost in dark */
            pricingCardSurfaceLikeContact,
            isPopular && 'border-transparent dark:border-transparent',
            !isPopular && 'border border-border dark:border-white/10',
          )}
        >
          {isPopular && (
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <span
                className={cn(
                  'inline-flex whitespace-nowrap rounded-full px-3.5 py-1',
                  'text-[11px] font-bold uppercase tracking-widest',
                  /* Light — same surface as accent/main Button */
                  'border border-white/35 text-primary-foreground shadow-[var(--cta-rest-shadow)]',
                  'bg-gradient-to-br from-[var(--cta-main-from)] via-[var(--cta-main-via)] to-[var(--cta-main-to)]',
                  popularBadgeMainButtonDark,
                )}
              >
                {p.popularBadgeLabel}
              </span>
            </div>
          )}

          <h3 className="text-gradient-brand text-2xl font-extrabold leading-tight tracking-tight">
            {plan.title}
          </h3>

          <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold tracking-wide text-foreground/80">
              {p.startingAtLabel}
            </p>
            <span className="text-4xl font-black tabular-nums leading-none tracking-tight text-foreground">
              {plan.startingPrice}
            </span>
            <p className="max-w-[16rem] text-[11px] leading-snug text-muted-foreground sm:max-w-none">
              {p.negotiableNote}
            </p>
          </div>

          <div className="h-px w-full bg-border" />

          <div className="flex flex-col gap-4">
            <p className="text-sm font-semibold text-foreground">{p.includedHeading}</p>
            <ul className="flex flex-col gap-3">
              {plan.inclusions.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <Check
                    size={14}
                    className="mt-0.5 shrink-0 text-primary"
                    strokeWidth={2.5}
                    aria-hidden
                  />
                  <span className="text-sm leading-snug text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </PopularGradientBorderShell>
    </div>
  )
}

/* ── Section ────────────────────────────────────────────────────────────── */

export function PricingSection() {
  const scrollDir = useScrollDirection()
  const suppress = scrollDir === 'up'
  const [sectionRef, isInView] = useRevealOnView<HTMLElement>({
    threshold: 0.14,
    rootMargin: '0px 0px -12% 0px',
    suppress,
  })
  const animState = useSectionAnimState(isInView, scrollDir)
  const canAnim = animState === 'animating'

  const cardDelays = ['0.36s', '0.52s', '0.68s']

  return (
    <section
      ref={sectionRef}
      id="pricing"
      aria-label={p.sectionAriaLabel}
      className="relative box-border flex min-h-[100dvh] flex-col overflow-hidden border-t border-border bg-background scroll-mt-[var(--navbar-height)]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[50%] w-[50%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.06] blur-[160px]"
      />

      <div className="relative z-[1] flex flex-1 flex-col justify-center px-[8%] py-16 md:py-24">
        <div className="mb-16 flex flex-col items-center gap-4 text-center">
          <p
            className={cn(
              'text-[11px] font-bold uppercase tracking-[0.38em] text-accent-foreground motion-reduce:animate-none',
              canAnim ? 'animate-stats-eyebrow-in' : animState !== 'hidden' ? 'opacity-100' : 'opacity-0',
            )}
          >
            {p.eyebrow}
          </p>

          <h2
            className={cn(
              'text-gradient-brand text-[clamp(2.4rem,5vw,3.5rem)] font-extrabold leading-[1.1] tracking-[-0.04em] motion-reduce:animate-none',
              canAnim ? 'animate-stats-headline-in' : animState !== 'hidden' ? 'opacity-100' : 'opacity-0',
            )}
            style={{ animationDelay: canAnim ? '0.12s' : undefined }}
          >
            {p.title}
          </h2>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 lg:grid-cols-3 lg:items-start lg:gap-6">
          {p.plans.map((plan, i) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              delay={cardDelays[i] ?? '0.48s'}
              inView={animState !== 'hidden'}
              canAnim={canAnim}
            />
          ))}
        </div>

        <div
          className={cn(
            'mt-14 flex flex-col items-center gap-3 text-center motion-reduce:animate-none',
            canAnim ? 'animate-stats-support-in' : animState !== 'hidden' ? 'opacity-100' : 'opacity-0',
          )}
          style={{ animationDelay: canAnim ? '0.88s' : undefined }}
        >
          <p className="text-sm text-muted-foreground">{p.disclaimer}</p>
          <a
            href={p.ctaHref}
            className="text-sm font-semibold text-primary underline-offset-4 hover:underline"
          >
            {p.ctaLabel}
          </a>
        </div>
      </div>
    </section>
  )
}
