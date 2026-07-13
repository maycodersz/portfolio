import { createElement, useMemo, useState } from 'react'

import { HighLevelMark } from '@/components/icons/HighLevelMark'
import { skillIconUrl } from '@/lib/skillLogos'
import { cn } from '@/utils/cn'
import { projectTechIcon } from '@/utils/projectTechIcon'

export type BrandSkillLogoVariant = 'marqueeChip' | 'techPill'

type BrandSkillLogoProps = {
  label: string
  variant: BrandSkillLogoVariant
  className?: string
}

/**
 * Brand logo from Simple Icons when available, otherwise `projectTechIcon` Lucide fallback.
 * `marqueeChip` uses `.skill-chip-icon` / `.skill-chip-fallback` (hover sync with pill button).
 * `techPill` uses `.tech-pill-simpleicon` for project tech stack chips (no gradient hover).
 */
export function BrandSkillLogo({ label, variant, className }: BrandSkillLogoProps) {
  const isHighLevel = /(?:go\s*)?high\s*level/i.test(label)
  const url = useMemo(() => skillIconUrl(label), [label])
  const [broken, setBroken] = useState(url === null)
  const showImg = Boolean(url && !broken)
  const Lucide = useMemo(() => projectTechIcon(label), [label])

  const isMarquee = variant === 'marqueeChip'

  if (isHighLevel) {
    return (
      <HighLevelMark
        className={cn(
          isMarquee ? 'skill-chip-icon h-9 w-11 shrink-0' : 'h-3.5 w-4 shrink-0',
          className,
        )}
      />
    )
  }

  if (showImg) {
    return (
      <img
        src={url!}
        alt=""
        width={isMarquee ? 36 : 14}
        height={isMarquee ? 36 : 14}
        className={cn(
          isMarquee
            ? 'skill-chip-icon size-9 shrink-0 object-contain'
            : 'tech-pill-simpleicon size-3.5 shrink-0 object-contain',
          className,
        )}
        loading="lazy"
        decoding="async"
        onError={() => setBroken(true)}
      />
    )
  }

  return createElement(Lucide, {
    className: cn(
      isMarquee
        ? 'skill-chip-fallback size-9 shrink-0'
        : 'size-3.5 shrink-0 text-muted-foreground',
      className,
    ),
    strokeWidth: isMarquee ? 1.75 : 2,
    'aria-hidden': true,
  })
}
