import { Check } from 'lucide-react'

import { type PricingPlan, portfolio } from '@/content/portfolio'
import { useRevealOnView } from '@/hooks/useRevealOnView'
import { cn } from '@/utils/cn'

const p = portfolio.pricing

/**
 * 1px gradient stroke around featured plan — matches Most Popular badge ramp.
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
        /* Whole frame + rim scale together — inner scale hides the parent's gradient stripe */
        'relative isolate scale-[1.03] rounded-2xl p-[2px]',
        '[background-image:var(--brand-text-gradient)]',
        '[background-color:transparent]',
        'shadow-[0_12px_40px_-16px_rgb(147_51_234_/_20%)]',
        'dark:bg-none dark:bg-gradient-to-b dark:from-[var(--brand-from)] dark:to-[var(--brand-to)]',
        'dark:shadow-[0_8px_40px_-12px_var(--brand-shadow-glow)]',
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
}: {
  plan: PricingPlan
  delay: string
  inView: boolean
}) {
  const cardGradients: Record<string, string> = {
    'web-dev': 'from-white to-violet-50/80',
    'mobile-app': 'from-white to-purple-50',
    automation: 'from-white to-blue-50/80',
  }

  const lightGradient = cardGradients[plan.id] ?? 'from-white to-slate-50'

  const isPopular = !!plan.isPopular

  return (
    <div
      className={cn(
        'motion-reduce:animate-none',
        inView ? 'animate-stats-support-in' : 'opacity-0',
      )}
      style={{ animationDelay: inView ? delay : undefined }}
    >
      <PopularGradientBorderShell active={isPopular}>
        <div
          className={cn(
            'relative flex flex-col gap-6 p-7 transition-all duration-300',
            isPopular ? 'rounded-[calc(1rem-2px)]' : 'rounded-2xl',
            'hover:-translate-y-1.5 active:scale-[0.98] active:duration-150',
            /* Light mode */
            `bg-gradient-to-b ${lightGradient}`,
            /* Border — transparent inside light gradient shell for popular plan */
            isPopular && 'border-transparent dark:border-white/10',
            /* Dark mode — glass */
            'dark:bg-white/[0.04] dark:backdrop-blur-xl',
            !isPopular && 'border border-border',
          )}
        >
          {/* Dark-mode inner gradient shimmer */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-b from-white/[0.07] to-transparent dark:block hidden"
          />

          {isPopular && (
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <span
                className={cn(
                  'inline-flex whitespace-nowrap rounded-full px-3.5 py-1',
                  'text-[11px] font-bold uppercase tracking-widest text-white',
                  /* Light: headline gradient fills the pill. Dark headline ramp starts near white,
                   * so badge uses vertical brand hues instead — keeps white labels readable. */
                  '[background:var(--brand-text-gradient)] dark:bg-none dark:bg-gradient-to-b dark:from-[var(--brand-from)] dark:to-[var(--brand-to)]',
                  'shadow-[0_2px_12px_-4px_rgb(0_0_0_/0.25)]',
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
  const [sectionRef, isInView] = useRevealOnView<HTMLElement>({
    threshold: 0.14,
    rootMargin: '0px 0px -12% 0px',
  })

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
              isInView ? 'animate-stats-eyebrow-in' : 'opacity-0',
            )}
          >
            {p.eyebrow}
          </p>

          <h2
            className={cn(
              'text-gradient-brand text-[clamp(2.4rem,5vw,3.5rem)] font-extrabold leading-[1.1] tracking-[-0.04em] motion-reduce:animate-none',
              isInView ? 'animate-stats-headline-in' : 'opacity-0',
            )}
            style={{ animationDelay: isInView ? '0.12s' : undefined }}
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
              inView={isInView}
            />
          ))}
        </div>

        <div
          className={cn(
            'mt-14 flex flex-col items-center gap-3 text-center motion-reduce:animate-none',
            isInView ? 'animate-stats-support-in' : 'opacity-0',
          )}
          style={{ animationDelay: isInView ? '0.88s' : undefined }}
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
