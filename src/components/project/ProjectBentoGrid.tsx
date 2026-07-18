import {
  ClipboardList,
  ExternalLink,
  Layers,
  type LucideIcon,
  Medal,
  MessagesSquare,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Trophy,
  Upload,
  Users,
  Zap,
} from 'lucide-react'
import { motion } from 'motion/react'
import type { ReactNode } from 'react'

import { BrandSkillLogo } from '@/components/BrandSkillLogo'
import { GithubMark } from '@/components/icons/GithubMark'
import { Button } from '@/components/ui/button'
import {
  portfolio,
  type CaseStudy,
  type Project,
  type ProjectFeature,
  type ProjectLink,
  type TechStackCategory,
} from '@/content/portfolio'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { useRevealCycle } from '@/contexts/RevealCycleContext'
import { cn } from '@/utils/cn'

type ProjectBentoGridProps = {
  project: Project
  className?: string
}

const LEGACY_FEATURE_ICONS: LucideIcon[] = [Sparkles, Zap, Trophy, Layers, Users, Smartphone]

/** Order matches Academic Hub bento grid: upload → search → leaderboard → chatroom → moderation → request. */
const BENTO_FEATURE_ICONS: LucideIcon[] = [Upload, Search, Medal, MessagesSquare, ShieldCheck, ClipboardList]

const gridClass = 'grid grid-cols-1 items-stretch gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3'

const infoTileClass =
  'flex min-h-[220px] flex-col rounded-2xl border border-primary/20 bg-primary/[0.04] p-8 shadow-[0_24px_70px_-28px_rgb(124_79_226/18%)] dark:border-primary/25 dark:bg-primary/[0.06]'

const resultsTileClass =
  'flex min-h-[140px] flex-col rounded-2xl border border-border bg-card p-8 shadow-[0_20px_50px_-24px_rgb(0_0_0/18%)] dark:border-primary/10'

const caseTileClass =
  'flex h-full min-h-0 flex-col rounded-2xl border border-border bg-card p-6 shadow-[0_12px_40px_-20px_rgb(0_0_0/14%)] dark:border-primary/10'

const inventoryTechShellClass =
  'flex flex-col rounded-2xl border border-border bg-card p-5 shadow-[0_12px_40px_-20px_rgb(0_0_0/14%)] dark:border-primary/10 sm:p-6'

const inventoryGridWrapperClass =
  'rounded-2xl border border-border bg-muted/15 p-4 dark:border-primary/10 dark:bg-muted/25 sm:p-5'

const linksTileClass =
  'flex min-h-0 flex-col rounded-2xl border border-border bg-card p-6 shadow-[0_12px_40px_-20px_rgb(0_0_0/14%)] dark:border-primary/10'

const techTileClass =
  'flex h-full min-h-0 flex-col rounded-2xl border border-border/80 bg-muted/30 p-6 shadow-sm dark:border-primary/10'

const featureTileClass =
  'flex min-h-[140px] flex-col rounded-2xl border border-border bg-card p-5 shadow-[0_8px_30px_-18px_rgb(0_0_0/12%)] dark:border-primary/10'

const bentoFeatureCellClass =
  'flex h-full min-h-[140px] flex-col rounded-2xl border border-border bg-card p-4 shadow-[0_8px_30px_-18px_rgb(0_0_0/12%)] dark:border-primary/10 sm:min-h-[150px] sm:p-5'

function linkAriaLabel(link: ProjectLink, copy: typeof portfolio.projectDetailPage): string {
  if (link.variant === 'live') return `${copy.visitLiveLabel}: ${link.label}`
  if (link.variant === 'github') return `${copy.visitGithubLabel}: ${link.label}`
  return `${copy.visitAppstoreLabel}: ${link.label}`
}

function BentoMotionTile({
  children,
  className,
  index,
  reducedMotion,
}: {
  children: ReactNode
  className?: string
  index: number
  reducedMotion: boolean
}) {
  if (reducedMotion) {
    return <div className={className}>{children}</div>
  }
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

function FeatureGridBesideTechInner({
  features,
  heading,
}: {
  features: readonly ProjectFeature[]
  heading: string
}) {
  const slice = features.slice(0, 6)
  return (
    <>
      <h2 className="text-[10px] font-semibold uppercase tracking-[0.3em] text-accent-foreground/90">{heading}</h2>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-4">
        {slice.map((feature, i) => (
          <div key={feature.title} className={bentoFeatureCellClass}>
            <FeatureTileInner
              feature={feature}
              icon={BENTO_FEATURE_ICONS[i % BENTO_FEATURE_ICONS.length] ?? Sparkles}
              compact
            />
          </div>
        ))}
      </div>
    </>
  )
}

function FeatureTileInner({
  feature,
  icon,
  compact = false,
}: {
  feature: ProjectFeature
  icon: LucideIcon
  compact?: boolean
}) {
  const Icon = icon
  return (
    <>
      <div className={cn('mb-2 flex items-start gap-2 sm:mb-3', compact && 'items-center')}>
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-muted/60 text-accent-foreground sm:size-10">
          <Icon className={cn('size-4 shrink-0 sm:size-5')} aria-hidden />
        </span>
        <h3
          className={cn(
            'text-gradient-brand px-px py-px font-extrabold tracking-tight',
            compact ? 'text-sm sm:text-base' : 'text-base sm:text-lg',
          )}
        >
          {feature.title}
        </h3>
      </div>
      <p className={cn('leading-relaxed text-muted-foreground', compact ? 'text-xs sm:text-sm' : 'text-sm')}>
        {feature.description}
      </p>
    </>
  )
}

/** Flat category list — no nested card inside the tech tile. */
function TechStackBlock({ categories }: { categories: readonly TechStackCategory[] }) {
  const copy = portfolio.projectDetailPage
  return (
    <>
      <h2 className="text-[10px] font-semibold uppercase tracking-[0.3em] text-accent-foreground/90">
        {copy.techStackHeading}
      </h2>
      <div className="mt-5 space-y-5">
        {categories.map((cat) => (
          <div key={cat.heading} className="border-b border-border pb-5 last:border-0 last:pb-0">
            <h3 className="mb-2.5 text-[10px] font-bold uppercase tracking-[0.28em] text-gradient-brand px-px py-px">
              {cat.heading}
            </h3>
            <ul className="flex flex-wrap gap-1.5">
              {cat.items.map((item) => (
                <li
                  key={item}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/80 py-0.5 pl-1.5 pr-2.5 text-xs font-medium text-foreground dark:border-primary/15 dark:bg-muted/40"
                >
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-primary/15 bg-muted/50 text-accent-foreground">
                    <BrandSkillLogo label={item} variant="techPill" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  )
}

function CaseStudyTileInner({ heading, body }: { heading: string; body: string }) {
  return (
    <>
      <h3 className="text-gradient-brand px-px py-px text-lg font-extrabold tracking-tight sm:text-xl">{heading}</h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{body}</p>
    </>
  )
}

function ResultsTileInner({
  heading,
  metrics,
  body,
}: {
  heading: string
  metrics?: readonly { value: string; label: string }[]
  body: string
}) {
  return (
    <>
      <h3 className="text-gradient-brand px-px py-px text-lg font-extrabold tracking-tight sm:text-xl">
        {heading}
      </h3>
      {metrics?.length ? (
        <dl
          className={cn(
            'mt-6 grid grid-cols-1 gap-3 sm:gap-4',
            metrics.length >= 4 ? 'grid-cols-2 sm:grid-cols-4' : 'sm:grid-cols-3',
          )}
        >
          {metrics.map((m) => (
            <div
              key={`${m.value}-${m.label}`}
              className="flex flex-col rounded-xl border border-border bg-muted/25 px-4 py-4 dark:border-primary/10"
            >
              <dt className="order-2 mt-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                {m.label}
              </dt>
              <dd className="order-1 text-3xl font-extrabold tabular-nums tracking-tight text-gradient-brand px-px py-px sm:text-4xl">
                {m.value}
              </dd>
            </div>
          ))}
        </dl>
      ) : null}
      <p className={cn('text-sm leading-relaxed text-muted-foreground', metrics?.length ? 'mt-6' : 'mt-3')}>
        {body}
      </p>
    </>
  )
}

/** 2×3 feature blocks + tech stack → problem / solution (full-width pair) → results. */
export function ProjectBentoGrid({ project, className }: ProjectBentoGridProps) {
  const copy = portfolio.projectDetailPage
  const reducedMotion = usePrefersReducedMotion()
  const { cycleId } = useRevealCycle()
  const feats = [...(project.features ?? [])].slice(0, 6)
  const tech = project.techStack ?? []
  const links = project.links ?? []
  const bentoFeatures = (project.bentoFeatureQuadrant ?? []).slice(0, 6)
  const useBentoFeatureGridLayout = bentoFeatures.length >= 6 && tech.length > 0
  const cs: CaseStudy | undefined = project.caseStudy
  let motionIndex = 0
  const next = () => motionIndex++

  return (
    <section
      role="region"
      aria-label={copy.bentoGridAriaLabel}
      className={cn('bg-background px-[10%] py-12 md:py-16 lg:py-20', className)}
    >
      <div key={cycleId} className="mx-auto max-w-6xl">
        <h2 className="sr-only">{copy.featuresHeading}</h2>

        <div className={gridClass}>
          <BentoMotionTile
            reducedMotion={reducedMotion}
            index={next()}
            className={cn(infoTileClass, 'md:col-span-2 lg:col-span-2')}
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-accent-foreground/90">{copy.eyebrow}</p>
            <h2 className="mt-2 text-gradient-brand px-px py-px text-3xl font-extrabold tracking-[-0.03em] sm:text-4xl">
              {project.title}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">{project.description}</p>
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-accent-foreground">
                {project.projectType}
              </span>
              <span className="rounded-full border border-border bg-muted/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-foreground">
                {project.duration}
              </span>
            </div>
            {project.highlight ? (
              <p className="mt-4 text-gradient-brand px-px py-px text-sm font-semibold">{project.highlight}</p>
            ) : null}
          </BentoMotionTile>

          {links.length > 0 ? (
            <BentoMotionTile
              reducedMotion={reducedMotion}
              index={next()}
              className={cn(linksTileClass, 'self-start md:col-span-1 lg:col-span-1')}
            >
              <h3 className="text-gradient-brand px-px py-px text-lg font-extrabold tracking-tight">{copy.linksHeading}</h3>
              <div className="mt-4 flex flex-col gap-3">
                {links.map((link) => (
                  <Button
                    key={`${link.href}-${link.label}`}
                    variant={link.variant === 'live' ? 'accent' : 'secondary'}
                    size="default"
                    className="rounded-xl"
                    asChild
                  >
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={linkAriaLabel(link, copy)}
                      data-analytics-event="project_link_click"
                      data-analytics-label={`${project.title}: ${link.label}`}
                    >
                      <span className="inline-flex items-center gap-2">
                        {link.variant === 'github' ? <GithubMark className="size-4 shrink-0" aria-hidden /> : null}
                        {link.label}
                        {link.variant !== 'github' ? <ExternalLink className="size-4 shrink-0" aria-hidden /> : null}
                      </span>
                    </a>
                  </Button>
                ))}
              </div>
            </BentoMotionTile>
          ) : null}

          {useBentoFeatureGridLayout ? (
            <BentoMotionTile
              reducedMotion={reducedMotion}
              index={next()}
              className={cn(inventoryTechShellClass, 'md:col-span-2 lg:col-span-3')}
            >
              <div className="grid gap-6 lg:grid-cols-3 lg:gap-6">
                <div className={cn(inventoryGridWrapperClass, 'min-w-0 lg:col-span-2')}>
                  <FeatureGridBesideTechInner features={bentoFeatures} heading={copy.featureGridHeading} />
                </div>
                <div className="flex min-h-0 min-w-0 lg:col-span-1">
                  <div className={cn(techTileClass, 'w-full flex-1')}>
                    <TechStackBlock categories={tech} />
                  </div>
                </div>
              </div>
            </BentoMotionTile>
          ) : tech.length > 0 ? (
            <BentoMotionTile reducedMotion={reducedMotion} index={next()} className={techTileClass}>
              <TechStackBlock categories={tech} />
            </BentoMotionTile>
          ) : null}

          {!useBentoFeatureGridLayout && feats[0] ? (
            <BentoMotionTile reducedMotion={reducedMotion} index={next()} className={featureTileClass}>
              <FeatureTileInner feature={feats[0]} icon={LEGACY_FEATURE_ICONS[0] ?? Sparkles} />
            </BentoMotionTile>
          ) : null}
          {!useBentoFeatureGridLayout && feats[1] ? (
            <BentoMotionTile reducedMotion={reducedMotion} index={next()} className={featureTileClass}>
              <FeatureTileInner feature={feats[1]} icon={LEGACY_FEATURE_ICONS[1] ?? Sparkles} />
            </BentoMotionTile>
          ) : null}
          {!useBentoFeatureGridLayout && feats[2] ? (
            <BentoMotionTile reducedMotion={reducedMotion} index={next()} className={featureTileClass}>
              <FeatureTileInner feature={feats[2]} icon={LEGACY_FEATURE_ICONS[2] ?? Layers} />
            </BentoMotionTile>
          ) : null}
          {!useBentoFeatureGridLayout && feats[3] ? (
            <BentoMotionTile reducedMotion={reducedMotion} index={next()} className={featureTileClass}>
              <FeatureTileInner feature={feats[3]} icon={LEGACY_FEATURE_ICONS[3] ?? Users} />
            </BentoMotionTile>
          ) : null}
          {!useBentoFeatureGridLayout && feats[4] ? (
            <BentoMotionTile reducedMotion={reducedMotion} index={next()} className={featureTileClass}>
              <FeatureTileInner feature={feats[4]} icon={LEGACY_FEATURE_ICONS[4] ?? Smartphone} />
            </BentoMotionTile>
          ) : null}

          {cs?.problem || cs?.solution ? (
            <div className="grid grid-cols-1 gap-5 md:col-span-2 md:grid-cols-2 md:gap-6 lg:col-span-3">
              {cs?.problem ? (
                <BentoMotionTile reducedMotion={reducedMotion} index={next()} className={caseTileClass}>
                  <CaseStudyTileInner heading={copy.problemHeading} body={cs.problem} />
                </BentoMotionTile>
              ) : null}
              {cs?.solution ? (
                <BentoMotionTile reducedMotion={reducedMotion} index={next()} className={caseTileClass}>
                  <CaseStudyTileInner heading={copy.solutionHeading} body={cs.solution} />
                </BentoMotionTile>
              ) : null}
            </div>
          ) : null}

          {cs?.results ? (
            <BentoMotionTile
              reducedMotion={reducedMotion}
              index={next()}
              className={cn(resultsTileClass, 'md:col-span-2 lg:col-span-3')}
            >
              <ResultsTileInner heading={copy.resultsHeading} metrics={cs.resultMetrics} body={cs.results} />
            </BentoMotionTile>
          ) : null}
        </div>
      </div>
    </section>
  )
}
