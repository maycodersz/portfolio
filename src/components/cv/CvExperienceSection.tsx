import { Briefcase } from 'lucide-react'

import { CvSectionShell } from '@/components/cv/CvSectionShell'
import { Button } from '@/components/ui/button'
import Link from '@/components/ui/link'
import { portfolio } from '@/content/portfolio'

export function CvExperienceSection({ stretch }: { stretch?: boolean }) {
  const { cv } = portfolio

  return (
    <CvSectionShell title={cv.sectionLabels.experience} stretch={stretch}>
      <div className="flex h-full flex-col items-center justify-center gap-4 py-4 text-center sm:py-6">
        <div className="flex size-12 items-center justify-center rounded-full border border-dashed border-primary/40 text-primary/60">
          <Briefcase className="size-5" />
        </div>
        <p className="max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
          {cv.experiencePlaceholder}
        </p>
        <Button variant="accentSecondary" size="sm" className="rounded-xl" asChild>
          <Link href="/#contact">Get in touch</Link>
        </Button>
      </div>
    </CvSectionShell>
  )
}
