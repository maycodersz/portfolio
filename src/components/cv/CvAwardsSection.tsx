import { Trophy } from 'lucide-react'

import { CvSectionShell } from '@/components/cv/CvSectionShell'
import { portfolio } from '@/content/portfolio'
import { cn } from '@/utils/cn'

const awardCardClass = cn(
  'flex items-start gap-3 rounded-xl border border-border p-4',
  'bg-muted/30 dark:bg-white/[0.03]',
)

export function CvAwardsSection({ stretch }: { stretch?: boolean }) {
  const { cv } = portfolio

  return (
    <CvSectionShell title={cv.sectionLabels.awards} stretch={stretch}>
      <div className="space-y-3">
        {cv.awards.map((award, i) => (
          <div key={i} className={awardCardClass}>
            <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500 dark:bg-amber-400/10 dark:text-amber-400">
              <Trophy className="size-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-foreground">
                {award.title}
              </h3>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {award.event}
              </p>
              <p className="mt-0.5 text-xs font-medium text-muted-foreground/70">
                {award.date}
              </p>
            </div>
          </div>
        ))}
      </div>
    </CvSectionShell>
  )
}
