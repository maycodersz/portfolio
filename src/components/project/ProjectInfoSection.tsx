import { ExternalLink } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { portfolio, type Project, type ProjectLink, type TechStackCategory } from '@/content/portfolio'
import { cn } from '@/utils/cn'

function linkAriaLabel(link: ProjectLink, copy: typeof portfolio.projectDetailPage): string {
  if (link.variant === 'live') return `${copy.visitLiveLabel}: ${link.label}`
  if (link.variant === 'github') return `${copy.visitGithubLabel}: ${link.label}`
  return `${copy.visitAppstoreLabel}: ${link.label}`
}

function TechStackColumn({ categories }: { categories: readonly TechStackCategory[] }) {
  const heading = portfolio.projectDetailPage.techStackHeading

  return (
    <div className="min-w-0">
      {/* Section label */}
      <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-accent-foreground/90">
        {heading}
      </p>

      {/* Category cards */}
      <div className="mt-5 flex flex-col divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card shadow-sm dark:border-primary/10">
        {categories.map((cat) => (
          <div key={cat.heading} className="px-4 py-4">
            <h3 className="mb-2.5 text-[10px] font-bold uppercase tracking-[0.28em] text-gradient-brand px-px py-px">
              {cat.heading}
            </h3>
            <ul className="flex flex-wrap gap-1.5">
              {cat.items.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-border bg-muted/60 px-2.5 py-0.5 text-xs font-medium text-foreground dark:border-primary/15 dark:bg-muted/40"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

type ProjectInfoSectionProps = {
  project: Project
  className?: string
}

/** Project title, description, meta, links (left) + tech stack (right) in one section. */
export function ProjectInfoSection({ project, className }: ProjectInfoSectionProps) {
  const copy = portfolio.projectDetailPage
  const links = project.links ?? []
  const tech = project.techStack ?? []
  const hasTech = tech.length > 0

  return (
    <section
      className={cn(
        'bg-background px-[10%] py-10 md:py-12 lg:py-14',
        className,
      )}
    >
      <div className="mx-auto max-w-6xl">
        <div
          className={cn(
            'grid grid-cols-1 gap-10 lg:grid-cols-[3fr_2fr] lg:gap-10 xl:gap-12',
            !hasTech && 'lg:grid-cols-1',
          )}
        >
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-accent-foreground/90">
              {copy.eyebrow}
            </p>
            <h1 className="mt-2 text-gradient-brand px-px py-px text-3xl font-extrabold tracking-[-0.03em] sm:text-4xl">
              {project.title}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">{project.description}</p>

            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-accent-foreground">
                {project.projectType}
              </span>
              <span className="rounded-full border border-border bg-muted/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-foreground">
                {project.duration}
              </span>
            </div>

            {links.length > 0 ? (
              <div className="mt-8 flex flex-wrap gap-3">
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
                    >
                      <span className="inline-flex items-center gap-2">
                        {link.label}
                        <ExternalLink className="size-4 shrink-0" aria-hidden />
                      </span>
                    </a>
                  </Button>
                ))}
              </div>
            ) : null}
          </div>

          {hasTech ? <TechStackColumn categories={tech} /> : null}
        </div>
      </div>
    </section>
  )
}
