import { Globe, Mail, MapPin, Phone } from 'lucide-react'
import { FaGithub, FaLinkedinIn } from 'react-icons/fa'

import { CvSectionShell } from '@/components/cv/CvSectionShell'
import Link from '@/components/ui/link'
import { portfolio } from '@/content/portfolio'
import { cn } from '@/utils/cn'

const chipBase = cn(
  'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium',
  'border border-border bg-muted/50 text-muted-foreground',
  'dark:bg-white/[0.06] dark:border-white/10',
  'transition-colors hover:text-foreground hover:border-primary/30',
)

export function CvSummarySection({ stretch }: { stretch?: boolean }) {
  const { cv } = portfolio
  const c = cv.contact

  return (
    <CvSectionShell title={cv.sectionLabels.summary} stretch={stretch}>
      <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
        {cv.professionalSummary}
      </p>

      {/* Contact chips */}
      <div className="mt-5 flex flex-wrap gap-2">
        <Link href={`mailto:${c.email}`} className={chipBase}>
          <Mail className="size-3.5 shrink-0" />
          {c.email}
        </Link>
        <span className={chipBase}>
          <Phone className="size-3.5 shrink-0" />
          {c.phone}
        </span>
        <span className={chipBase}>
          <MapPin className="size-3.5 shrink-0" />
          {c.location}
        </span>
        <Link href={c.linkedin.href} className={chipBase}>
          <FaLinkedinIn className="size-3.5 shrink-0" />
          {c.linkedin.label}
        </Link>
        <Link href={c.github.href} className={chipBase}>
          <FaGithub className="size-3.5 shrink-0" />
          {c.github.label}
        </Link>
        <Link href={c.portfolio.href} className={chipBase}>
          <Globe className="size-3.5 shrink-0" />
          {c.portfolio.label}
        </Link>
      </div>
    </CvSectionShell>
  )
}
