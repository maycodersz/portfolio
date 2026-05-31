import { Award } from 'lucide-react'

import { CvSectionShell } from '@/components/cv/CvSectionShell'
import { portfolio } from '@/content/portfolio'
import { cn } from '@/utils/cn'

const certCardClass = cn(
  'flex items-start gap-3 rounded-xl border border-border p-4',
  'bg-muted/30 dark:bg-white/[0.03]',
)

export function CvCertificationsSection({ stretch }: { stretch?: boolean }) {
  const { cv } = portfolio

  return (
    <CvSectionShell title={cv.sectionLabels.certifications} stretch={stretch}>
      <div className="space-y-3">
        {cv.certifications.map((cert, i) => (
          <div key={i} className={certCardClass}>
            <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Award className="size-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-foreground">
                {cert.title}
              </h3>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {cert.issuer}
              </p>
              <p className="mt-0.5 text-xs font-medium text-muted-foreground/70">
                {cert.date}
              </p>
            </div>
          </div>
        ))}
      </div>
    </CvSectionShell>
  )
}
