import { useState } from 'react'
import {
  ArrowRight,
  BriefcaseBusiness,
  Copy,
  FileSearch,
  Gauge,
  Layers3,
  Network,
  Plus,
  Workflow,
  type LucideIcon,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import Link from '@/components/ui/link'
import { accountingOpsSystem } from '@/content/automation-system'
import { useSectionReveal } from '@/hooks/useSectionReveal'
import { cn } from '@/utils/cn'

type FeatureCard = {
  title: string
  description: string
  icon: LucideIcon
}

const problems: readonly FeatureCard[] = [
  {
    title: 'Manual follow-up',
    description: 'Leads, clients, and internal tasks depend on someone remembering what happens next.',
    icon: BriefcaseBusiness,
  },
  {
    title: 'Scattered information',
    description: 'Important context lives across inboxes, forms, spreadsheets, folders, and CRM records.',
    icon: Layers3,
  },
  {
    title: 'Repetitive data entry',
    description: 'The same information is copied between tools, creating delays and avoidable mistakes.',
    icon: Copy,
  },
  {
    title: 'Limited visibility',
    description: 'Owners cannot quickly see what is blocked, overdue, waiting for review, or ready to move.',
    icon: Gauge,
  },
]

const solutions: readonly FeatureCard[] = [
  {
    title: 'Client operations systems',
    description: 'Lead capture, qualification, booking, onboarding, follow-up, and client communication in one connected flow.',
    icon: Network,
  },
  {
    title: 'Document and data automation',
    description: 'Collect files, extract structured data with AI, validate results, and route exceptions to a person.',
    icon: FileSearch,
  },
  {
    title: 'Internal workflow automation',
    description: 'Create tasks, notifications, approvals, recurring checks, reports, and clear escalation paths.',
    icon: Workflow,
  },
]

const processSteps = [
  {
    number: '01',
    title: 'Workflow review',
    description: 'We identify repetitive work, bottlenecks, tools, handoffs, and the exceptions that still need judgment.',
  },
  {
    number: '02',
    title: 'System blueprint',
    description: 'I map triggers, data, integrations, ownership, failure paths, and the human checkpoints.',
  },
  {
    number: '03',
    title: 'Build and test',
    description: 'I implement the workflows and test normal, duplicate, missing-data, and failure scenarios.',
  },
  {
    number: '04',
    title: 'Launch and support',
    description: 'You receive documentation, a clear handoff, and an agreed path for monitoring and improvements.',
  },
] as const

const faqItems = [
  {
    question: 'What kinds of businesses do you work with?',
    answer: 'I work best with service businesses that have recurring leads, onboarding, documents, client communication, reporting, or internal operations work. The review focuses on one costly bottleneck first, then determines whether a focused workflow or a broader connected system is the right fit.',
  },
  {
    question: 'Who provides n8n and access to our other platforms?',
    answer: 'The client normally provides access to their own n8n instance and the platforms involved, such as the CRM, email, forms, calendar, or storage. Invite-based or project-level access is preferred so you keep ownership and billing while access can be limited or removed after handoff.',
  },
  {
    question: 'Can you work with our current software?',
    answer: 'Usually, yes. I review your existing stack before recommending new tools. When reliable APIs, webhooks, or native integrations are available, I connect what you already use instead of replacing systems without a clear operational reason.',
  },
  {
    question: 'Do we need to replace our CRM?',
    answer: 'Not by default. I first look for a reliable integration path and a clean source of truth. A replacement is recommended only when the current CRM cannot support the required process, data, permissions, or maintainable integrations.',
  },
  {
    question: 'How long does an implementation take?',
    answer: 'A focused workflow may take several working days, while an end-to-end operations system takes longer. The timeline is confirmed after the review identifies the scope, access requirements, dependencies, exception paths, testing, and approval process.',
  },
  {
    question: 'How are credentials handled?',
    answer: 'Credentials stay inside the client-owned platform, n8n credential store, or approved environment configuration. I prefer the minimum access needed for the build and do not place production secrets in browser code, screenshots, Loom recordings, or public workflow exports.',
  },
  {
    question: 'What do we receive during the project and at handoff?',
    answer: 'The project starts with a clear scope and contract. I provide progress updates and Loom videos for major changes. Handoff includes practical SOPs, workflow and exception documentation, setup or credential notes, testing guidance, and the information your team needs to operate and maintain the system.',
  },
  {
    question: 'What happens during the free review?',
    answer: 'We examine one high-friction process: what triggers it, who owns each step, which tools and data are involved, where delays happen, and which decisions still need a person. You leave with a practical recommendation and a clearer next step, whether or not we work together.',
  },
] as const

function SectionIntro({
  eyebrow,
  title,
  description,
  visible,
  animate,
  className,
}: {
  eyebrow: string
  title: string
  description: string
  visible: boolean
  animate: boolean
  className?: string
}) {
  return (
    <div className={cn('mx-auto w-full max-w-5xl text-center', className)}>
      <p
        className={cn(
          'text-[clamp(0.625rem,0.4rem+0.75vw,0.6875rem)] font-bold uppercase tracking-[0.38em] text-accent-foreground motion-reduce:animate-none',
          animate ? 'animate-stats-eyebrow-in' : visible ? 'opacity-100' : 'opacity-0',
        )}
      >
        {eyebrow}
      </p>
      <h2
        className={cn(
          'text-gradient-brand mx-auto mt-5 max-w-[30ch] px-px py-px text-[clamp(2.5rem,5vw,3.75rem)] font-extrabold leading-[1.1] tracking-[-0.04em] motion-reduce:animate-none',
          animate ? 'animate-stats-headline-in' : visible ? 'opacity-100' : 'opacity-0',
        )}
        style={{ animationDelay: animate ? '0.1s' : undefined }}
      >
        {title}
      </h2>
      <p
        className={cn(
          'mx-auto mt-6 max-w-2xl text-[clamp(0.75rem,0.55rem+0.9vw,0.9375rem)] leading-relaxed text-muted-foreground motion-reduce:animate-none',
          animate ? 'animate-stats-support-in' : visible ? 'opacity-100' : 'opacity-0',
        )}
        style={{ animationDelay: animate ? '0.28s' : undefined }}
      >
        {description}
      </p>
    </div>
  )
}

function FeatureCards({
  items,
  columns,
  visible,
  animate,
}: {
  items: readonly FeatureCard[]
  columns: 3 | 4
  visible: boolean
  animate: boolean
}) {
  return (
    <div className={cn('mt-12 grid gap-4', columns === 4 ? 'md:grid-cols-2 xl:grid-cols-4' : 'md:grid-cols-3')}>
      {items.map((item, index) => {
        const Icon = item.icon
        return (
          <article
            key={item.title}
            className={cn(
              'rounded-2xl border border-border bg-background p-6 shadow-[0_18px_50px_-36px_var(--brand-shadow-glow)] motion-reduce:animate-none sm:p-7',
              animate ? 'animate-stat-pop-in' : visible ? 'opacity-100' : 'opacity-0',
              'dark:border-white/10 dark:bg-white/[0.035] dark:backdrop-blur-sm',
            )}
            style={{ animationDelay: animate ? `${0.38 + index * 0.09}s` : undefined }}
          >
            <span className="mb-6 flex size-11 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
              <Icon className="size-5" aria-hidden />
            </span>
            <h3 className="text-base font-bold tracking-[-0.02em] text-foreground">{item.title}</h3>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">{item.description}</p>
          </article>
        )
      })}
    </div>
  )
}

export function WhereAutomationHelpsSection() {
  const { ref, isVisible, shouldAnimate } = useSectionReveal<HTMLElement>()
  return (
    <section ref={ref} id="automation-helps" className="relative box-border flex min-h-dvh flex-col overflow-hidden border-t border-border bg-muted/20">
      <div className="relative z-[1] flex min-h-0 flex-1 flex-col justify-center px-[10%] py-16">
        <div className="mx-auto w-full max-w-7xl">
          <SectionIntro eyebrow="Where automation helps" title="Your team should not run on memory and copy-paste." description="The most useful automation begins with a visible operational problem, not with a tool looking for somewhere to be used." visible={isVisible} animate={shouldAnimate} />
          <FeatureCards items={problems} columns={4} visible={isVisible} animate={shouldAnimate} />
        </div>
      </div>
    </section>
  )
}

export function SolutionsSection() {
  const { ref, isVisible, shouldAnimate } = useSectionReveal<HTMLElement>()
  return (
    <section ref={ref} id="solutions" className="relative box-border flex min-h-dvh flex-col overflow-hidden border-t border-border bg-background">
      <div aria-hidden className="pointer-events-none absolute -left-24 top-1/3 size-80 rounded-full bg-primary/[0.07] blur-[120px]" />
      <div className="relative z-[1] flex min-h-0 flex-1 flex-col justify-center px-[10%] py-16">
        <div className="mx-auto w-full max-w-7xl">
          <SectionIntro eyebrow="Solutions" title="Connected systems built around the way work actually moves." description="Each system is mapped around ownership, data, failure paths, and the human decisions that should remain visible." visible={isVisible} animate={shouldAnimate} />
          <FeatureCards items={solutions} columns={3} visible={isVisible} animate={shouldAnimate} />
        </div>
      </div>
    </section>
  )
}

export function ProcessSection() {
  const { ref, isVisible, shouldAnimate } = useSectionReveal<HTMLElement>()
  return (
    <section ref={ref} id="process" className="box-border flex min-h-dvh flex-col overflow-hidden border-t border-border bg-muted/20">
      <div className="relative z-[1] flex min-h-0 flex-1 flex-col justify-center px-[10%] py-16">
        <div className="mx-auto w-full max-w-7xl">
          <SectionIntro eyebrow="Process" title="A practical path from bottleneck to reliable workflow." description="Every build starts with the people and the process before tools or AI models are selected." visible={isVisible} animate={shouldAnimate} />
          <ol className="mt-12 grid overflow-hidden rounded-2xl border border-border bg-background md:grid-cols-2 xl:grid-cols-4 dark:border-white/10 dark:bg-white/[0.035]">
            {processSteps.map((step, index) => (
              <li
                key={step.number}
                className={cn(
                  'border-border p-6 motion-reduce:animate-none md:p-7 [&:not(:last-child)]:border-b md:[&:not(:last-child)]:border-r xl:[&:not(:last-child)]:border-b-0',
                  index === 1 && 'md:[&:not(:last-child)]:border-r-0 xl:[&:not(:last-child)]:border-r',
                  shouldAnimate ? 'animate-stat-pop-in' : isVisible ? 'opacity-100' : 'opacity-0',
                )}
                style={{ animationDelay: shouldAnimate ? `${0.38 + index * 0.09}s` : undefined }}
              >
                <span className="text-sm font-bold text-primary">{step.number}</span>
                <h3 className="mt-6 text-base font-bold tracking-[-0.02em]">{step.title}</h3>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

export function AccountingOpsTeaserSection() {
  const { ref, isVisible, shouldAnimate } = useSectionReveal<HTMLElement>()

  return (
    <section
      ref={ref}
      id="case-study"
      aria-labelledby="accountingops-teaser-title"
      className="relative scroll-mt-[var(--navbar-height)] overflow-hidden border-t border-border bg-background px-[10%] py-16 md:py-20"
    >
      <div aria-hidden className="pointer-events-none absolute right-[8%] top-1/2 size-72 -translate-y-1/2 rounded-full bg-primary/[0.07] blur-[120px]" />
      <div className="relative z-[1] mx-auto grid w-full max-w-7xl gap-5 lg:grid-cols-3">
        <article
          className={cn(
            'rounded-2xl border border-primary/20 bg-primary/[0.045] p-7 shadow-[0_24px_70px_-38px_rgb(124_79_226/28%)] motion-reduce:animate-none md:p-8 lg:col-span-2',
            shouldAnimate ? 'animate-stats-headline-in' : isVisible ? 'opacity-100' : 'opacity-0',
          )}
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.34em] text-accent-foreground">{accountingOpsSystem.eyebrow}</p>
          <h2 id="accountingops-teaser-title" className="text-gradient-brand mt-4 max-w-[17ch] px-px py-px text-[clamp(2.2rem,4vw,3.4rem)] font-extrabold leading-[1.08] tracking-[-0.035em]">
            {accountingOpsSystem.title}
          </h2>
          <p className="mt-5 max-w-[68ch] text-base leading-[1.7] text-muted-foreground sm:text-lg">{accountingOpsSystem.summary}</p>
        </article>

        <aside
          className={cn(
            'rounded-2xl border border-border bg-card p-6 motion-reduce:animate-none',
            shouldAnimate ? 'animate-stats-support-in' : isVisible ? 'opacity-100' : 'opacity-0',
          )}
          style={{ animationDelay: shouldAnimate ? '0.18s' : undefined }}
          aria-label="AccountingOps implementation proof"
        >
          <h3 className="text-gradient-brand text-lg font-extrabold">Implementation proof</h3>
          <dl className="mt-5 grid grid-cols-2 gap-3">
            {accountingOpsSystem.metrics.map((metric) => (
              <div key={metric.label} className="rounded-xl border border-border bg-muted/30 p-4">
                <dt className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{metric.label}</dt>
                <dd className="text-gradient-brand mt-2 px-px py-px text-xl font-extrabold tracking-tight">{metric.value}</dd>
              </div>
            ))}
          </dl>
          <Button asChild variant="accent" className="mt-5 min-h-11 w-full">
            <Link
              href="/work/accountingops-automation-system"
              data-analytics-event="case_study_cta_click"
              data-analytics-label="View full AccountingOps case study"
            >
              View the full system <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Button>
        </aside>
      </div>
    </section>
  )
}

export function FaqSection() {
  const { ref, isVisible, shouldAnimate } = useSectionReveal<HTMLElement>()
  const [openItems, setOpenItems] = useState<Set<number>>(() => new Set())

  const toggleItem = (index: number) => {
    setOpenItems((current) => {
      const next = new Set(current)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
  }

  return (
    <section ref={ref} id="faq" className="box-border flex min-h-dvh flex-col overflow-hidden border-t border-border bg-muted/20">
      <div className="relative z-[1] flex min-h-0 flex-1 flex-col justify-center px-[10%] py-16">
        <div className="mx-auto w-full max-w-7xl">
          <SectionIntro eyebrow="FAQ" title="Before you book." description="Clear answers about fit, tools, scope, access, and the initial review." visible={isVisible} animate={shouldAnimate} />
          <div className="mt-12 space-y-3">
              {faqItems.map((item, index) => {
                const open = openItems.has(index)
                const panelId = `faq-panel-${index}`
                return (
                  <article
                    key={item.question}
                    className={cn(
                      'overflow-hidden rounded-2xl border border-border bg-background motion-reduce:animate-none dark:border-white/10 dark:bg-white/[0.035]',
                      shouldAnimate ? 'animate-stat-pop-in' : isVisible ? 'opacity-100' : 'opacity-0',
                    )}
                    style={{ animationDelay: shouldAnimate ? `${0.2 + index * 0.07}s` : undefined }}
                  >
                    <h3>
                      <button
                        type="button"
                        aria-expanded={open}
                        aria-controls={panelId}
                        onClick={() => toggleItem(index)}
                        className="flex min-h-14 w-full items-center justify-between gap-4 px-5 py-5 text-left text-sm font-bold outline-none transition-colors hover:bg-primary/[0.04] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/50 sm:px-6 sm:text-base"
                      >
                        <span>{item.question}</span>
                        <Plus className={cn('size-5 shrink-0 text-primary transition-transform duration-200', open && 'rotate-45')} aria-hidden />
                      </button>
                    </h3>
                    <div id={panelId} hidden={!open} className="px-5 pb-6 text-sm leading-6 text-muted-foreground sm:px-6">
                      {item.answer}
                    </div>
                  </article>
                )
              })}
          </div>
        </div>
      </div>
    </section>
  )
}
