import type { LucideIcon } from 'lucide-react'
import {
  Calendar,
  Cloud,
  Database,
  ExternalLink,
  Layers,
  Mail,
  Send,
  Sparkles,
  Table2,
  Workflow,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  automationCategoryLabel,
  portfolio,
  type AutomationProject,
} from '@/content/portfolio'
import { cn } from '@/utils/cn'

/** Lucide-outline icons themed: brand gradient stroke in light mode, accent in dark mode. */
function GradientStrokeIcon({
  icon: Icon,
  className,
  'aria-hidden': ariaHidden = true,
}: {
  icon: LucideIcon
  className?: string
  'aria-hidden'?: boolean
}) {
  return (
    <Icon
      aria-hidden={ariaHidden}
      className={cn(
        'shrink-0 stroke-[url(#automationModalIconStrokeLight)] dark:stroke-accent-foreground',
        className,
      )}
      strokeWidth={2}
      fill="none"
    />
  )
}

/** Match common tags to icons (substring / case insensitive). */
function iconForAutomationTag(tag: string): LucideIcon {
  const t = tag.toLowerCase()
  if (t.includes('n8n')) return Workflow
  if (t.includes('telegram')) return Send
  if (t.includes('gmail') || (t.includes('mail') && t.includes('google'))) return Mail
  if (t.includes('calendar')) return Calendar
  if (t.includes('postgres')) return Database
  if (t.includes('sheet')) return Table2
  if (t.includes('drive')) return Cloud
  if (t.includes('openai') || t.includes('open router')) return Sparkles
  return Layers
}

function iconForDatabaseLine(label: string): LucideIcon {
  const t = label.toLowerCase()
  if (t.includes('postgres')) return Database
  if (t.includes('sheet')) return Table2
  if (t.includes('drive')) return Cloud
  if (t.includes('sqlite')) return Database
  if (t.includes('airtable')) return Table2
  return Database
}

/**
 * Heading row shares one column with stacked chips beneath; chips align with heading text start.
 */
function AutomationDetailBlock({
  sectionIcon: SectionIcon,
  heading,
  items,
  resolveChipIcon,
}: {
  sectionIcon: LucideIcon
  heading: string
  items: readonly string[]
  resolveChipIcon: (label: string) => LucideIcon
}) {
  if (items.length === 0) return null

  return (
    <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-2 gap-y-3">
      <GradientStrokeIcon
        icon={SectionIcon}
        className="col-start-1 row-start-1 size-3 shrink-0 self-center"
      />
      <p className="col-start-2 row-start-1 text-xs font-bold uppercase tracking-widest text-foreground">
        {heading}
      </p>
      <div className="col-start-2 row-start-2 flex min-w-0 flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className={cn(
              'inline-flex items-center gap-2 rounded-full border border-border bg-muted/60 px-3 py-1 text-xs font-medium text-foreground',
              'dark:border-primary/15 dark:bg-muted/40',
            )}
          >
            <GradientStrokeIcon icon={resolveChipIcon(item)} className="size-3.5 shrink-0 sm:size-4" />
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

type AutomationModalProps = {
  project: AutomationProject | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AutomationModal({ project, open, onOpenChange }: AutomationModalProps) {
  const copy = portfolio.automationModal
  const projectOpen = !!(open && project)

  const linkLabel =
    project?.link && project.link.variant === 'mobile'
      ? copy.openLinkLabelMobile
      : copy.openLinkLabelWeb

  return (
    <>
      {/* Gradient defs for outlined icons — top-to-bottom stops aligned with ContactSection */}
      <svg width={0} height={0} className="pointer-events-none fixed" aria-hidden focusable={false}>
        <defs>
          <linearGradient
            id="automationModalIconStrokeLight"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
            gradientUnits="objectBoundingBox"
          >
            <stop offset="0%" stopColor="#fbcfe8" />
            <stop offset="28%" stopColor="#E879F9" />
            <stop offset="58%" stopColor="#B76EF5" />
            <stop offset="100%" stopColor="#5E32C0" />
          </linearGradient>
        </defs>
      </svg>

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl gap-0 overflow-hidden p-0 sm:max-w-2xl">
          {projectOpen ? (
            <>
              <div className="relative aspect-video w-full overflow-hidden border-b border-border bg-muted">
                <img
                  src={project.image}
                  alt={`${project.title} — ${copy.imageAltFallback}`}
                  className="h-full w-full object-cover object-top"
                  loading="lazy"
                  decoding="async"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.06)_0%,rgba(0,0,0,0)_45%,rgba(0,0,0,0.35)_100%)]"
                />
              </div>

              <div className="flex flex-col gap-5 p-6 sm:p-7">
                <DialogHeader className="space-y-3 text-left">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-accent-foreground/90">
                    {copy.eyebrow}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.categories.map((id) => (
                      <span
                        key={id}
                        className="rounded-full border border-primary/25 bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-accent-foreground"
                      >
                        {automationCategoryLabel(portfolio.automation.categoryFilters, id)}
                      </span>
                    ))}
                  </div>
                  <DialogTitle className="text-xl font-bold tracking-tight sm:text-2xl">{project.title}</DialogTitle>
                  <DialogDescription className="text-left text-[15px] leading-relaxed text-muted-foreground">
                    {project.description}
                  </DialogDescription>
                </DialogHeader>

                <AutomationDetailBlock
                  sectionIcon={Layers}
                  heading={copy.techStackHeading}
                  items={project.tags}
                  resolveChipIcon={iconForAutomationTag}
                />

                <AutomationDetailBlock
                  sectionIcon={Database}
                  heading={copy.databaseHeading}
                  items={project.databases}
                  resolveChipIcon={iconForDatabaseLine}
                />

                {project.link ? (
                  <Button variant="accent" className="w-full sm:w-auto" asChild>
                    <a href={project.link.href} target="_blank" rel="noopener noreferrer">
                      <span className="inline-flex items-center gap-2">
                        {linkLabel}
                        <ExternalLink className="size-4" aria-hidden />
                      </span>
                    </a>
                  </Button>
                ) : null}
              </div>
            </>
          ) : (
            <div className="flex min-h-[200px] flex-col items-center justify-center gap-2 p-10">
              <DialogHeader className="text-center">
                <DialogTitle>{copy.fallbackTitle}</DialogTitle>
              </DialogHeader>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
