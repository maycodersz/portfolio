import { CvSectionShell } from '@/components/cv/CvSectionShell'
import { portfolio } from '@/content/portfolio'

export function CvEducationSection({ stretch }: { stretch?: boolean }) {
  const { cv } = portfolio

  return (
    <CvSectionShell title={cv.sectionLabels.education} stretch={stretch}>
      <div className="relative space-y-6 pl-5 sm:pl-6">
        {/* Timeline line */}
        <div
          aria-hidden
          className="absolute bottom-2 left-[7px] top-2 w-px bg-border dark:bg-white/10"
        />

        {cv.education.map((edu, i) => (
          <div key={i} className="relative">
            {/* Timeline dot */}
            <div
              aria-hidden
              className="absolute -left-5 top-1.5 size-2.5 rounded-full border-2 border-primary bg-background sm:-left-6"
            />

            <h3 className="text-sm font-semibold text-foreground sm:text-base">
              {edu.degree}
            </h3>
            <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
              {edu.institution}
            </p>
            <p className="mt-0.5 text-xs font-medium text-muted-foreground/70">
              {edu.period}
            </p>
            {edu.details && (
              <p className="mt-1.5 text-xs text-muted-foreground sm:text-sm">
                {edu.details}
              </p>
            )}
          </div>
        ))}
      </div>
    </CvSectionShell>
  )
}
