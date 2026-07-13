import { ArrowUpRight } from 'lucide-react'

import { BrandSkillLogo } from '@/components/BrandSkillLogo'
import { CvSectionShell } from '@/components/cv/CvSectionShell'
import { Button } from '@/components/ui/button'
import Link from '@/components/ui/link'
import { portfolio } from '@/content/portfolio'
import { cn } from '@/utils/cn'

const cardClass = cn(
  'rounded-xl border border-border p-4 sm:p-5',
  'bg-muted/30 dark:bg-white/[0.03]',
)

export function CvProjectsSection({ stretch }: { stretch?: boolean }) {
  const { cv } = portfolio

  return (
    <CvSectionShell title={cv.sectionLabels.projects} stretch={stretch}>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {cv.projects.map((project) => (
          <div key={project.id} className={cardClass}>
            {/* Header row */}
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-sm font-semibold text-foreground sm:text-base">
                {project.title}
              </h3>
              <span className="shrink-0 text-xs font-medium text-muted-foreground">
                {project.year}
              </span>
            </div>

            {/* Tech stack */}
            <div className="mt-2 flex flex-wrap gap-1.5">
              {project.techStack.map((technology) => (
                <span
                  key={technology}
                  className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background/60 px-2 py-1 text-[11px] font-medium text-muted-foreground"
                >
                  <BrandSkillLogo label={technology} variant="techPill" />
                  {technology}
                </span>
              ))}
            </div>

            {/* Bullets */}
            <ul className="mt-3 space-y-1.5">
              {project.bullets.map((bullet, i) => (
                <li
                  key={i}
                  className="flex gap-2 text-xs leading-relaxed text-muted-foreground sm:text-sm"
                >
                  <span className="mt-1.5 size-1 shrink-0 rounded-full bg-primary/50" aria-hidden />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>

            {/* View project link */}
            {project.portfolioHref && (
              <div className="mt-3">
                <Button
                  variant="link"
                  size="sm"
                  className="h-auto p-0 text-xs font-medium"
                  asChild
                >
                  <Link href={project.portfolioHref}>
                    View project
                    <ArrowUpRight className="ml-1 size-3" />
                  </Link>
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </CvSectionShell>
  )
}
