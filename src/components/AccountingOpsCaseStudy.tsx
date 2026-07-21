import { ArrowLeft, CheckCircle2, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'
import { useEffect, useState } from 'react'

import { AutomationCardDeckCarousel, AutomationCategoryPills } from '@/components/AutomationSection'
import { AUTOMATION_DIALOG_CONTENT_CLASS } from '@/components/AutomationModal'
import { BrandSkillLogo } from '@/components/BrandSkillLogo'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import Link from '@/components/ui/link'
import { accountingOpsSystem, accountingOpsWorkflows } from '@/content/automation-system'
import { automationCategoryLabel, portfolio, type AutomationCategory } from '@/content/portfolio'
import { useSectionReveal } from '@/hooks/useSectionReveal'
import { cn } from '@/utils/cn'

type Workflow = (typeof accountingOpsWorkflows)[number]

function TechnologyPills({ items }: { items: readonly string[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((item) => (
        <li key={item} className="inline-flex min-h-8 items-center gap-2 rounded-full border border-border bg-background px-2.5 py-1 text-xs font-medium text-foreground">
          <span className="flex size-5 items-center justify-center"><BrandSkillLogo label={item} variant="techPill" /></span>
          {item}
        </li>
      ))}
    </ul>
  )
}

function WorkflowGallery({ workflow, open, onOpenChange }: { workflow: Workflow | null; open: boolean; onOpenChange: (open: boolean) => void }) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (!open || !workflow) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') setIndex((current) => (current - 1 + workflow.images.length) % workflow.images.length)
      if (event.key === 'ArrowRight') setIndex((current) => (current + 1) % workflow.images.length)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, workflow])

  if (!workflow) return null
  const currentImage = workflow.images[index]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={AUTOMATION_DIALOG_CONTENT_CLASS}>
        <figure className="relative aspect-video w-full overflow-hidden border-b border-border bg-muted">
          <div className="flex h-full w-full items-center justify-center p-2 sm:p-4">
            <img
              src={currentImage}
              alt={`${workflow.title} evidence ${index + 1} of ${workflow.images.length}`}
              className="h-full w-full object-contain"
              decoding="async"
            />
          </div>
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.04)_0%,rgba(0,0,0,0)_55%,rgba(0,0,0,0.32)_100%)]" />
          <figcaption className="absolute bottom-3 left-3 rounded-full border border-border bg-background/90 px-3 py-1.5 text-xs font-semibold text-foreground shadow-sm backdrop-blur-sm">
            Workflow evidence {index + 1} of {workflow.images.length}
          </figcaption>
          {workflow.images.length > 1 ? (
            <>
              <Button type="button" variant="secondary" size="icon" className="absolute left-2 top-1/2 z-20 size-11 -translate-y-1/2 rounded-full bg-background/90 shadow-md backdrop-blur-sm sm:left-3" aria-label="Previous workflow image" onClick={() => setIndex((current) => (current - 1 + workflow.images.length) % workflow.images.length)}><ChevronLeft className="size-5" /></Button>
              <Button type="button" variant="secondary" size="icon" className="absolute right-2 top-1/2 z-20 size-11 -translate-y-1/2 rounded-full bg-background/90 shadow-md backdrop-blur-sm sm:right-3" aria-label="Next workflow image" onClick={() => setIndex((current) => (current + 1) % workflow.images.length)}><ChevronRight className="size-5" /></Button>
            </>
          ) : null}
        </figure>

        <div className="flex flex-col gap-5 p-4 sm:p-7">
          <DialogHeader className="space-y-3 pr-8 text-left">
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-accent-foreground/90">Workflow evidence</p>
            <div className="flex flex-wrap gap-2">
              {workflow.categories.map((category) => (
                <span key={category} className="rounded-full border border-primary/25 bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-accent-foreground">
                  {automationCategoryLabel(portfolio.automation.categoryFilters, category)}
                </span>
              ))}
            </div>
            <DialogTitle className="text-[clamp(1.125rem,0.75rem+1.5vw,1.5rem)] font-bold leading-snug tracking-tight">{workflow.title}</DialogTitle>
            <DialogDescription className="text-left text-[clamp(0.8125rem,0.6rem+0.95vw,0.9375rem)] leading-relaxed text-muted-foreground">{workflow.outcome}</DialogDescription>
          </DialogHeader>

          <section aria-label="Workflow details" className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-muted/20 p-4 sm:p-5">
              <h3 className="text-xs font-bold uppercase tracking-widest text-foreground">Trigger</h3>
              <p className="mt-3 text-sm leading-[1.7] text-muted-foreground">{workflow.trigger}</p>
              <h3 className="mt-6 text-xs font-bold uppercase tracking-widest text-foreground">Human checkpoint</h3>
              <p className="mt-3 text-sm leading-[1.7] text-muted-foreground">{workflow.humanCheckpoint}</p>
            </div>
            <div className="rounded-xl border border-border bg-muted/20 p-4 sm:p-5">
              <h3 className="text-xs font-bold uppercase tracking-widest text-foreground">Important actions</h3>
              <ul className="mt-3 space-y-3">
                {workflow.actions.map((action) => (
                  <li key={action} className="flex gap-2.5 text-sm leading-[1.6] text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                    {action}
                  </li>
                ))}
              </ul>
              <h3 className="mt-6 text-xs font-bold uppercase tracking-widest text-foreground">Demonstrated output</h3>
              <p className="mt-3 text-sm leading-[1.7] text-muted-foreground">{workflow.outcome}</p>
            </div>
          </section>

          <section aria-labelledby={`${workflow.id}-tech-stack`} className="rounded-xl border border-border bg-muted/20 p-4 sm:p-5">
            <h3 id={`${workflow.id}-tech-stack`} className="text-xs font-bold uppercase tracking-widest text-foreground">Tech stack</h3>
            <div className="mt-3">
              <TechnologyPills items={workflow.systems.slice(0, 8)} />
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function AccountingOpsCaseStudy() {
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null)
  const [activeWorkflowCategory, setActiveWorkflowCategory] = useState<AutomationCategory>('all')
  const [workflowInteracted, setWorkflowInteracted] = useState(false)
  const { ref: workflowRef, isVisible: workflowVisible, shouldAnimate: workflowShouldAnimate } = useSectionReveal<HTMLElement>({ threshold: 0.12 })
  const stack = ['Go High Level', 'n8n', 'OpenAI', 'Google Drive', 'Telegram', 'Webhooks', 'Google Calendar']
  const filteredWorkflows = activeWorkflowCategory === 'all'
    ? accountingOpsWorkflows
    : accountingOpsWorkflows.filter((workflow) => workflow.categories.some((category) => category === activeWorkflowCategory))

  return (
    <>
      <article className="px-[10%] pb-20 pt-10 md:pb-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-5 lg:grid-cols-3">
            <section aria-labelledby="accountingops-page-title" className="rounded-2xl border border-primary/20 bg-primary/[0.045] p-7 shadow-[0_24px_70px_-38px_rgb(124_79_226/28%)] md:p-8 lg:col-span-2">
              <p className="text-[10px] font-bold uppercase tracking-[0.34em] text-accent-foreground">Project</p>
              <h1 id="accountingops-page-title" className="text-gradient-brand mt-3 px-px py-px text-[clamp(2.3rem,4vw,3.5rem)] font-extrabold leading-[1.08] tracking-[-0.035em]">{accountingOpsSystem.title}</h1>
              <p className="mt-5 max-w-[68ch] text-base leading-[1.7] text-muted-foreground sm:text-lg">{accountingOpsSystem.summary}</p>
              <div className="mt-5 flex flex-wrap gap-2"><span className="rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-accent-foreground">AI automation, CRM</span><span className="rounded-full border border-border bg-muted/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-foreground">Portfolio demo</span></div>
            </section>

            <aside className="self-start rounded-2xl border border-border bg-card p-6">
              <h2 className="text-gradient-brand text-lg font-extrabold">Links</h2>
              <Button asChild variant="accent" className="mt-4 min-h-11 w-full"><Link href="/#contact">Book a similar system <ExternalLink className="size-4" aria-hidden /></Link></Button>
              <Button asChild variant="secondary" className="mt-3 min-h-11 w-full"><Link href="/#case-study"><ArrowLeft className="size-4" aria-hidden /> Back to overview</Link></Button>
            </aside>
          </div>

          <section aria-labelledby="system-map-title" className="mt-6 rounded-2xl border border-border bg-card p-5 sm:p-6">
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="rounded-2xl border border-border bg-muted/15 p-4 sm:p-5 lg:col-span-2">
                <h2 id="system-map-title" className="text-[10px] font-semibold uppercase tracking-[0.3em] text-accent-foreground">Client operations lifecycle</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {accountingOpsSystem.lifecycle.map((item, index) => (
                    <article key={item.short} className="rounded-2xl border border-border bg-card p-5">
                      <div className="flex items-center gap-3"><span className="flex size-9 items-center justify-center rounded-xl border border-primary/20 bg-muted/60 text-xs font-extrabold text-primary">{String(index + 1).padStart(2, '0')}</span><h3 className="text-gradient-brand px-px py-px font-extrabold">{item.title}</h3></div>
                      <p className="mt-3 text-sm leading-[1.65] text-muted-foreground">{item.description}</p>
                    </article>
                  ))}
                </div>
              </div>
              <aside className="rounded-2xl border border-border bg-muted/25 p-6">
                <h2 className="text-[10px] font-semibold uppercase tracking-[0.3em] text-accent-foreground">Tech stack</h2>
                <div className="mt-5"><TechnologyPills items={stack} /></div>
              </aside>
            </div>
          </section>

          <section aria-label="Case study explanation" className="mt-6 grid gap-5 md:grid-cols-2">
            <article className="rounded-2xl border border-border bg-card p-6"><h2 className="text-gradient-brand text-xl font-extrabold">Problem</h2><p className="mt-3 text-sm leading-[1.7] text-muted-foreground">{accountingOpsSystem.problem}</p></article>
            <article className="rounded-2xl border border-border bg-card p-6"><h2 className="text-gradient-brand text-xl font-extrabold">Solution</h2><p className="mt-3 text-sm leading-[1.7] text-muted-foreground">{accountingOpsSystem.solution}</p></article>
          </section>

          <section aria-labelledby="demonstrated-results-title" className="mt-6 rounded-2xl border border-border bg-card p-6 sm:p-8">
            <h2 id="demonstrated-results-title" className="text-gradient-brand text-xl font-extrabold">Demonstrated results</h2>
            <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {accountingOpsSystem.metrics.map((metric) => <div key={metric.label} className="rounded-xl border border-border bg-muted/25 p-4"><dt className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{metric.label}</dt><dd className="text-gradient-brand mt-2 px-px py-px text-2xl font-extrabold">{metric.value}</dd></div>)}
            </dl>
            <p className="mt-6 max-w-[75ch] text-sm leading-[1.7] text-muted-foreground">{accountingOpsSystem.result}</p>
          </section>
        </div>

        <section
          ref={workflowRef}
          aria-labelledby="workflow-evidence-title"
          className="mx-auto mt-20 flex min-h-dvh w-full max-w-7xl items-center py-10 md:py-16"
        >
          <div className="grid w-full grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-16">
            <div className="flex max-w-xl flex-col gap-6">
              <p
                className={cn(
                  'text-[clamp(0.625rem,0.4rem+0.75vw,0.6875rem)] font-bold uppercase tracking-[0.38em] text-accent-foreground motion-reduce:animate-none',
                  workflowShouldAnimate ? 'animate-stats-eyebrow-in' : workflowVisible ? 'opacity-100' : 'opacity-0',
                )}
              >
                Workflow evidence
              </p>
              <h2
                id="workflow-evidence-title"
                className={cn(
                  'text-gradient-brand px-px py-px text-[clamp(2.5rem,5vw,3.75rem)] font-extrabold leading-[1.1] tracking-[-0.04em] motion-reduce:animate-none',
                  workflowShouldAnimate ? 'animate-stats-headline-in' : workflowVisible ? 'opacity-100' : 'opacity-0',
                )}
                style={{ animationDelay: workflowShouldAnimate ? '0.12s' : undefined }}
              >
                Eight connected workflows, with the complete supporting evidence.
              </h2>
              <p
                className={cn(
                  'text-[clamp(0.75rem,0.55rem+0.9vw,0.9375rem)] leading-relaxed text-muted-foreground motion-reduce:animate-none',
                  workflowShouldAnimate ? 'animate-stats-support-in' : workflowVisible ? 'opacity-100' : 'opacity-0',
                )}
                style={{ animationDelay: workflowShouldAnimate ? '0.48s' : undefined }}
              >
                Each workflow explains its trigger, automated actions, human checkpoint, and demonstrated output. Open the active card to inspect every related screenshot and workflow detail.
              </p>
              <div
                className={cn(
                  'motion-reduce:animate-none',
                  workflowShouldAnimate ? 'animate-stats-support-in' : workflowVisible ? 'opacity-100' : 'opacity-0',
                )}
                style={{ animationDelay: workflowShouldAnimate ? '0.68s' : undefined }}
              >
                <AutomationCategoryPills
                  active={activeWorkflowCategory}
                  onChange={(category) => {
                    setWorkflowInteracted(true)
                    setActiveWorkflowCategory(category)
                  }}
                  projects={accountingOpsWorkflows}
                  ariaLabel="Filter AccountingOps workflows by category"
                />
              </div>
            </div>

            <div className="flex items-center justify-center lg:justify-end">
              <AutomationCardDeckCarousel
                key={activeWorkflowCategory}
                projects={filteredWorkflows}
                onOpen={(project) => setSelectedWorkflow(accountingOpsWorkflows.find((workflow) => workflow.id === project.id) ?? null)}
                sectionInView={workflowVisible}
                scrollReveal={workflowShouldAnimate && !workflowInteracted}
                onInteraction={() => setWorkflowInteracted(true)}
                previousLabel="Previous workflow"
                nextLabel="Next workflow"
                paginationLabel="AccountingOps workflows"
                viewLabel="View workflow evidence"
                viewAriaLabelPrefix="View workflow evidence"
              />
            </div>
          </div>
        </section>
      </article>

      <WorkflowGallery key={selectedWorkflow?.id ?? 'closed'} workflow={selectedWorkflow} open={Boolean(selectedWorkflow)} onOpenChange={(open) => { if (!open) setSelectedWorkflow(null) }} />
    </>
  )
}
