import {
  ExternalLink,
  Layers,
  type LucideIcon,
  Smartphone,
  Sparkles,
  Trophy,
  Users,
  Zap,
} from 'lucide-react'
import { motion } from 'motion/react'
import type { ReactNode } from 'react'

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
import { cn } from '@/utils/cn'
import { projectTechIcon } from '@/utils/projectTechIcon'

type ProjectBentoGridProps = {
  project: Project
  className?: string
}

const FEATURE_ICONS: LucideIcon[] = [Sparkles, Zap, Trophy, Layers, Users, Smartphone]

const gridClass = 'grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3'

const infoTileClass =
  'flex min-h-[220px] flex-col rounded-2xl border border-primary/20 bg-primary/[0.04] p-8 shadow-[0_24px_70px_-28px_rgb(124_79_226/18%)] dark:border-primary/25 dark:bg-primary/[0.06]'

const resultsTileClass =
  'flex min-h-[140px] flex-col rounded-2xl border border-border bg-card p-8 shadow-[0_20px_50px_-24px_rgb(0_0_0/18%)] dark:border-primary/10'

const caseTileClass =
  'flex min-h-[180px] flex-col rounded-2xl border border-border bg-card p-6 shadow-[0_12px_40px_-20px_rgb(0_0_0/14%)] dark:border-primary/10'

const linksTileClass =
  'flex min-h-0 flex-col rounded-2xl border border-border bg-card p-6 shadow-[0_12px_40px_-20px_rgb(0_0_0/14%)] dark:border-primary/10'

const techTileClass =
  'flex min-h-0 flex-col rounded-2xl border border-border/80 bg-muted/30 p-6 shadow-sm dark:border-primary/10'

const featureTileClass =
  'flex min-h-[140px] flex-col rounded-2xl border border-border bg-card p-5 shadow-[0_8px_30px_-18px_rgb(0_0_0/12%)] dark:border-primary/10'

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

function FeatureTileInner({ feature, icon }: { feature: ProjectFeature; icon: LucideIcon }) {
  const Icon = icon
  return (
    <>
      <div className="mb-3 flex items-center gap-2">
        <span className="flex size-10 items-center justify-center rounded-xl border border-primary/20 bg-muted/60 text-accent-foreground">
          <Icon className="size-5 shrink-0" aria-hidden />
        </span>
        <h3 className="text-gradient-brand px-px py-px text-base font-extrabold tracking-tight sm:text-lg">
          {feature.title}
        </h3>
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
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
              {cat.items.map((item) => {
                const TechIcon = projectTechIcon(item)
                return (
                  <li
                    key={item}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/80 py-0.5 pl-1.5 pr-2.5 text-xs font-medium text-foreground dark:border-primary/15 dark:bg-muted/40"
                  >
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-primary/15 bg-muted/50 text-accent-foreground">
                      <TechIcon className="size-3.5 shrink-0" aria-hidden />
                    </span>
                    {item}
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>
    </>
  )
}

function CaseStudyTileInner({
  heading,
  body,
}: {
  heading: string
  body: string
}) {
  return (
    <>
      <h3 className="text-gradient-brand px-px py-px text-lg font-extrabold tracking-tight sm:text-xl">
        {heading}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{body}</p>
    </>
  )
}

/** Non-uniform bento: hero info + links row, case study + tech, feature row, full-width results, trailing features. */
export function ProjectBentoGrid({ project, className }: ProjectBentoGridProps) {
  const copy = portfolio.projectDetailPage
  const reducedMotion = usePrefersReducedMotion()
  const feats = [...(project.features ?? [])].slice(0, 6)
  const tech = project.techStack ?? []
  const links = project.links ?? []
  const cs: CaseStudy | undefined = project.caseStudy
  let motionIndex = 0
  const next = () => motionIndex++

  return (
    <section
      role="region"
      aria-label={copy.bentoGridAriaLabel}
      className={cn('bg-background px-[10%] py-12 md:py-16 lg:py-20', className)}
    >
      <div className="mx-auto max-w-6xl">
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
            <BentoMotionTile reducedMotion={reducedMotion} index={next()} className={cn(linksTileClass, 'md:col-span-1 lg:col-span-1')}>
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
                    <a href={link.href} target="_blank" rel="noopener noreferrer" aria-label={linkAriaLabel(link, copy)}>
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
          {tech.length > 0 ? (
            <BentoMotionTile reducedMotion={reducedMotion} index={next()} className={techTileClass}>
              <TechStackBlock categories={tech} />
            </BentoMotionTile>
          ) : null}

          {feats[0] ? (
            <BentoMotionTile reducedMotion={reducedMotion} index={next()} className={featureTileClass}>
              <FeatureTileInner feature={feats[0]} icon={FEATURE_ICONS[0] ?? Sparkles} />
            </BentoMotionTile>
          ) : null}
          {feats[1] ? (
            <BentoMotionTile reducedMotion={reducedMotion} index={next()} className={featureTileClass}>
              <FeatureTileInner feature={feats[1]} icon={FEATURE_ICONS[1] ?? Sparkles} />
            </BentoMotionTile>
          ) : null}
          {feats[2] ? (
            <BentoMotionTile reducedMotion={reducedMotion} index={next()} className={featureTileClass}>
              <FeatureTileInner feature={feats[2]} icon={FEATURE_ICONS[2] ?? Layers} />
            </BentoMotionTile>
          ) : null}

          {cs?.results ? (
            <BentoMotionTile
              reducedMotion={reducedMotion}
              index={next()}
              className={cn(resultsTileClass, 'md:col-span-2 lg:col-span-3')}
            >
              <CaseStudyTileInner heading={copy.resultsHeading} body={cs.results} />
            </BentoMotionTile>
          ) : null}

          {feats[3] ? (
            <BentoMotionTile reducedMotion={reducedMotion} index={next()} className={featureTileClass}>
              <FeatureTileInner feature={feats[3]} icon={FEATURE_ICONS[3] ?? Users} />
            </BentoMotionTile>
          ) : null}
          {feats[4] ? (
            <BentoMotionTile reducedMotion={reducedMotion} index={next()} className={featureTileClass}>
              <FeatureTileInner feature={feats[4]} icon={FEATURE_ICONS[4] ?? Smartphone} />
            </BentoMotionTile>
          ) : null}
        </div>
      </div>
    </section>
  )
}
