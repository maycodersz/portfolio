import { BrandSkillLogo } from '@/components/BrandSkillLogo'
import { CvSectionShell } from '@/components/cv/CvSectionShell'
import { portfolio } from '@/content/portfolio'
import { cn } from '@/utils/cn'

const pillClass = cn(
  'inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium',
  'border border-border bg-muted/50 text-muted-foreground',
  'dark:bg-white/[0.06] dark:border-white/10',
)

export function CvSkillsSection({ stretch }: { stretch?: boolean }) {
  const { cv } = portfolio

  return (
    <CvSectionShell title={cv.sectionLabels.skills} stretch={stretch}>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {cv.skills.map((group) => (
          <div key={group.category}>
            <h3 className="mb-2.5 text-sm font-semibold text-foreground">
              {group.category}
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {group.items.map((item) => (
                <span key={item} className={pillClass}>
                  <BrandSkillLogo label={item} variant="techPill" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </CvSectionShell>
  )
}
