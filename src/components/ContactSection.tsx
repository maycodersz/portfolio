import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react'
import { ArrowLeft, ArrowRight, CalendarDays, Check } from 'lucide-react'
import { FaLinkedin } from 'react-icons/fa'
import type { IconType } from 'react-icons'
import {
  SiFacebook,
  SiGmail,
  SiInstagram,
  SiTiktok,
  SiYoutube,
} from 'react-icons/si'

import { useAnalytics } from '@/analytics/AnalyticsContext'
import { Button } from '@/components/ui/button'
import {
  type ContactMethodPlatform,
  type ContactSocialPlatform,
  portfolio,
} from '@/content/portfolio'
import { useSectionReveal } from '@/hooks/useSectionReveal'
import { cn } from '@/utils/cn'
import {
  checkContactRateLimit,
  formatRateLimitedMessage,
  recordContactSubmission,
} from '@/utils/contactRateLimit'
import { isValidEmail } from '@/utils/isValidEmail'

const c = portfolio.contact
const BOOKING_URL = 'https://calendar.google.com/calendar/appointments/schedules/AcZssZ228-zIMn3k8C9mC1CotADE7c92-jyWi8jPypOtG9DeibIQcvQovsQNQDyUdy1dyhkSKlJ45fOj?gv=true'

const METHOD_ICONS: Record<ContactMethodPlatform, IconType> = {
  gmail: SiGmail,
  linkedin: FaLinkedin,
}

const SOCIAL_ICONS: Record<ContactSocialPlatform, IconType> = {
  facebook: SiFacebook,
  instagram: SiInstagram,
  tiktok: SiTiktok,
  youtube: SiYoutube,
}

function MethodBrandIcon({ platform, className }: { platform: ContactMethodPlatform; className?: string }) {
  const Icon = METHOD_ICONS[platform]
  return <Icon className={cn('fill-[url(#contactIconGradLight)] dark:fill-[url(#contactIconGradDark)] [&_path]:fill-[url(#contactIconGradLight)] dark:[&_path]:fill-[url(#contactIconGradDark)]', className)} aria-hidden />
}

function SocialBrandIcon({ platform, className }: { platform: ContactSocialPlatform; className?: string }) {
  const Icon = SOCIAL_ICONS[platform]
  return <Icon className={cn('fill-[url(#contactIconGradLight)] dark:fill-[url(#contactIconGradDark)] [&_path]:fill-[url(#contactIconGradLight)] dark:[&_path]:fill-[url(#contactIconGradDark)]', className)} aria-hidden />
}

declare global {
  interface Window {
    calendar?: {
      schedulingButton: {
        load: (options: {
          url: string
          color: string
          label: string
          target: HTMLElement
        }) => void
      }
    }
  }
}

type BookingStep = 1 | 2 | 3

type ReviewForm = {
  name: string
  email: string
  companyName: string
  companyWebsite: string
  industry: string
  teamSize: string
  currentTools: string
  processToImprove: string
  timeframe: string
  bottleneck: string
  budget: string
  consent: boolean
}

type ReviewFieldErrors = Partial<Record<keyof ReviewForm, string>>

const initialForm: ReviewForm = {
  name: '',
  email: '',
  companyName: '',
  companyWebsite: '',
  industry: '',
  teamSize: '',
  currentTools: '',
  processToImprove: '',
  timeframe: '',
  bottleneck: '',
  budget: 'Not sure yet',
  consent: false,
}

const inputClass = cn(
  'w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none',
  'placeholder:text-muted-foreground focus:border-primary/40 focus:ring-2 focus:ring-primary/35',
  'aria-invalid:border-destructive/60 aria-invalid:ring-2 aria-invalid:ring-destructive/20',
  'dark:border-white/10 dark:bg-white/[0.04] dark:backdrop-blur-sm',
)

function FieldLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="text-gradient-brand block px-px py-px text-sm font-semibold">
      {children}
    </label>
  )
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return <p id={id} aria-live="polite" className="mt-2 text-sm font-medium leading-5 text-destructive">{message}</p>
}

function useGoogleCalendarButton(enabled: boolean) {
  const targetRef = useRef<HTMLDivElement>(null)
  const [calendarReady, setCalendarReady] = useState(false)

  useEffect(() => {
    if (!enabled) return
    const target = targetRef.current
    if (!target) return

    let disposed = false
    const renderButton = () => {
      if (disposed || !window.calendar?.schedulingButton || !targetRef.current) return
      targetRef.current.replaceChildren()
      window.calendar.schedulingButton.load({
        url: BOOKING_URL,
        color: '#039BE5',
        label: 'Book an appointment',
        target: targetRef.current,
      })
      setCalendarReady(true)
    }

    if (!document.querySelector('link[data-google-calendar-scheduling]')) {
      const stylesheet = document.createElement('link')
      stylesheet.rel = 'stylesheet'
      stylesheet.href = 'https://calendar.google.com/calendar/scheduling-button-script.css'
      stylesheet.dataset.googleCalendarScheduling = 'true'
      document.head.appendChild(stylesheet)
    }

    const existingScript = document.querySelector<HTMLScriptElement>('script[data-google-calendar-scheduling]')
    if (window.calendar?.schedulingButton) {
      renderButton()
    } else if (existingScript) {
      existingScript.addEventListener('load', renderButton, { once: true })
    } else {
      const script = document.createElement('script')
      script.src = 'https://calendar.google.com/calendar/scheduling-button-script.js'
      script.async = true
      script.dataset.googleCalendarScheduling = 'true'
      script.addEventListener('load', renderButton, { once: true })
      document.body.appendChild(script)
    }

    return () => {
      disposed = true
      existingScript?.removeEventListener('load', renderButton)
      target.replaceChildren()
    }
  }, [enabled])

  return { targetRef, calendarReady }
}

function Progress({ step }: { step: BookingStep }) {
  const displayStep = Math.min(step, 2)
  return (
    <div className="flex items-end justify-between gap-6 border-b border-border pb-5">
      <div>
        <p className="text-sm font-semibold text-primary">{step === 3 ? 'Review submitted' : `Step ${displayStep} of 2`}</p>
        <h3 className="mt-1 text-xl font-bold tracking-[-0.03em]">
          {step === 1 ? 'Your business' : step === 2 ? 'The workflow' : 'Choose a time'}
        </h3>
      </div>
      <div className="flex gap-2" aria-label={`${displayStep} of 2 form steps completed`}>
        {[1, 2].map((item) => (
          <span key={item} className={cn('h-2 w-10 rounded-full', item <= displayStep ? 'bg-primary' : 'bg-muted')} />
        ))}
      </div>
    </div>
  )
}

function ContactSidebar({ visible, animate }: { visible: boolean; animate: boolean }) {
  return (
    <aside
      className={cn(
        'flex w-full min-w-0 flex-col gap-8 motion-reduce:animate-none lg:max-w-md',
        animate ? 'animate-stats-support-in' : visible ? 'opacity-100' : 'opacity-0',
      )}
      style={{ animationDelay: animate ? '0.68s' : undefined }}
      aria-label="Direct contact and social links"
    >
      <div>
        <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.38em] text-accent-foreground">
          {c.methodsHeading}
        </p>
        <div className="flex flex-col gap-3">
          {c.methods.map((method) => (
            <a
              key={method.id}
              href={method.href}
              target="_blank"
              rel="noopener noreferrer"
              data-analytics-event="contact_method_click"
              data-analytics-label={method.label}
              className="flex min-h-16 items-center gap-4 rounded-2xl border border-border bg-background p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_28px_-12px_var(--brand-shadow-glow)] active:scale-95 active:duration-150 dark:border-white/10 dark:bg-white/[0.04] dark:backdrop-blur-sm"
            >
              <span className="flex size-11 shrink-0 items-center justify-center">
                <MethodBrandIcon platform={method.platform} className="size-8" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="text-gradient-brand block px-px py-px text-xs font-semibold uppercase tracking-wide">
                  {method.label}
                </span>
                <span className="block break-all text-sm font-medium text-foreground">{method.value}</span>
              </span>
            </a>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.38em] text-accent-foreground">
          {c.socialHeading}
        </p>
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {c.socials.map((social) => (
            <a
              key={social.id}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              data-analytics-event="social_link_click"
              data-analytics-label={social.label}
              className="flex min-h-24 flex-col items-center justify-center gap-2 rounded-2xl border border-border bg-background p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_28px_-12px_var(--brand-shadow-glow)] active:scale-95 active:duration-150 dark:border-white/10 dark:bg-white/[0.04] dark:backdrop-blur-sm"
            >
              <SocialBrandIcon platform={social.platform} className="size-9" />
              <span className="text-gradient-brand px-px py-px text-center text-xs font-semibold">{social.label}</span>
            </a>
          ))}
        </div>
      </div>
    </aside>
  )
}

export function ContactSection() {
  const { trackEvent } = useAnalytics()
  const { ref, isVisible, shouldAnimate } = useSectionReveal<HTMLElement>()
  const [step, setStep] = useState<BookingStep>(1)
  const [form, setForm] = useState<ReviewForm>(initialForm)
  const [sending, setSending] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<ReviewFieldErrors>({})
  const [submissionError, setSubmissionError] = useState<string | null>(null)
  const formCardRef = useRef<HTMLDivElement>(null)
  const { targetRef, calendarReady } = useGoogleCalendarButton(step === 3)

  useEffect(() => {
    if (step === 1) return
    const frame = window.requestAnimationFrame(() => {
      formCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
    return () => window.cancelAnimationFrame(frame)
  }, [step])

  const update = useCallback(<K extends keyof ReviewForm>(key: K, value: ReviewForm[K]) => {
    setForm((current) => ({ ...current, [key]: value }))
    setFieldErrors((current) => {
      if (!current[key]) return current
      const next = { ...current }
      delete next[key]
      return next
    })
    setSubmissionError(null)
  }, [])

  const focusFirstInvalid = (field: keyof ReviewForm) => {
    window.requestAnimationFrame(() => {
      document.querySelector<HTMLElement>(`[name="${field}"]`)?.focus({ preventScroll: true })
      formCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  const continueToWorkflow = () => {
    const nextErrors: ReviewFieldErrors = {}
    if (!form.name.trim()) nextErrors.name = 'Please enter your name.'
    if (!form.email.trim()) nextErrors.email = 'Please enter your work email.'
    else if (!isValidEmail(form.email)) nextErrors.email = 'Please enter a valid work email address.'
    if (!form.companyName.trim()) nextErrors.companyName = 'Please enter your company name.'

    const firstInvalid = (['name', 'email', 'companyName'] as const).find((field) => nextErrors[field])
    if (firstInvalid) {
      setFieldErrors(nextErrors)
      setSubmissionError(null)
      focusFirstInvalid(firstInvalid)
      return
    }

    setFieldErrors({})
    setSubmissionError(null)
    setStep(2)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors: ReviewFieldErrors = {}
    if (!form.industry) nextErrors.industry = 'Please choose your industry.'
    if (!form.teamSize) nextErrors.teamSize = 'Please choose your team size.'
    if (!form.processToImprove) nextErrors.processToImprove = 'Please choose a process to improve.'
    if (!form.timeframe) nextErrors.timeframe = 'Please choose a timeframe.'
    if (!form.bottleneck.trim()) nextErrors.bottleneck = 'Please describe the current bottleneck.'
    if (!form.consent) nextErrors.consent = 'Please confirm that Maycoder may use these details to respond.'

    const firstInvalid = (['industry', 'teamSize', 'processToImprove', 'timeframe', 'bottleneck', 'consent'] as const).find((field) => nextErrors[field])
    if (firstInvalid) {
      setFieldErrors(nextErrors)
      setSubmissionError(null)
      focusFirstInvalid(firstInvalid)
      return
    }

    setFieldErrors({})

    const rateLimit = checkContactRateLimit({
      minIntervalSeconds: c.form.minIntervalSeconds,
      maxSubmissionsPerHour: c.form.maxSubmissionsPerHour,
      rateLimitedMessage: c.form.rateLimitedMessage,
      rateLimitedRetryMessage: c.form.rateLimitedRetryMessage,
    })
    if (!rateLimit.allowed) {
      setSubmissionError(formatRateLimitedMessage(c.form.rateLimitedRetryMessage, rateLimit.retryAfterMs))
      return
    }

    setSending(true)
    setSubmissionError(null)
    try {
      const data = new FormData()
      data.set('access_key', c.splitForms.accessKey)
      data.set('subject', c.splitForms.subject)
      data.set('projectType', 'automation')
      data.set('name', form.name)
      data.set('email', form.email)
      data.set('company_name', form.companyName)
      data.set('company_website', form.companyWebsite)
      data.set('industry', form.industry)
      data.set('team_size', form.teamSize)
      data.set('current_tools', form.currentTools)
      data.set('process_to_improve', form.processToImprove)
      data.set('timeframe', form.timeframe)
      data.set('message', form.bottleneck)
      data.set('budget', form.budget)
      data.set('page_url', window.location.href)
      data.set('referrer', document.referrer || 'Direct')

      const response = await fetch(c.splitForms.submitUrl, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      })
      const result = (await response.json()) as { success?: boolean; message?: string }
      if (!response.ok || !result.success) throw new Error(result.message ?? 'Submission failed')

      recordContactSubmission()
      trackEvent({ eventName: 'contact_form_success', clickLabel: 'Automation review submitted' })
      setStep(3)
    } catch {
      setSubmissionError('The review could not be submitted. Please try again or contact Maycoder directly.')
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      <svg width={0} height={0} className="pointer-events-none absolute" aria-hidden focusable="false">
        <defs>
          <linearGradient id="contactIconGradLight" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
            <stop offset="0%" stopColor="#fbcfe8" />
            <stop offset="28%" stopColor="#E879F9" />
            <stop offset="58%" stopColor="#B76EF5" />
            <stop offset="100%" stopColor="#5E32C0" />
          </linearGradient>
          <linearGradient id="contactIconGradDark" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="32%" stopColor="#e4e4e7" />
            <stop offset="100%" stopColor="#A78BFA" />
          </linearGradient>
        </defs>
      </svg>
      <section ref={ref} id="contact" aria-label="Book a free automation review" className="relative box-border flex min-h-dvh flex-col overflow-hidden border-t border-border bg-background">
        <div aria-hidden className="pointer-events-none absolute right-0 top-1/2 h-[60%] w-[35%] -translate-y-1/2 rounded-full bg-primary/[0.07] blur-[140px]" />
        <div className="relative z-[1] flex min-h-0 flex-1 flex-col justify-center px-[10%] py-16 md:py-24">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
            <div className="flex w-full max-w-xl flex-col gap-6 lg:max-w-[min(34rem,44vw)]">
              <div className={cn('space-y-6 motion-reduce:animate-none', shouldAnimate ? 'animate-stats-headline-in' : isVisible ? 'opacity-100' : 'opacity-0')}>
                <p className="text-[clamp(0.625rem,0.4rem+0.75vw,0.6875rem)] font-bold uppercase tracking-[0.38em] text-accent-foreground">Automation review</p>
                <h2 className="text-gradient-brand max-w-xl px-px py-px text-[clamp(2.5rem,5vw,3.75rem)] font-extrabold leading-[1.1] tracking-[-0.04em]">Book a Free Automation Review</h2>
                <p className="max-w-xl text-[clamp(0.75rem,0.55rem+0.9vw,0.9375rem)] leading-relaxed text-muted-foreground">Bring one process that is costing your team time. Share enough context for a useful conversation, then choose a time through Google Calendar.</p>
              </div>

              <div ref={formCardRef} className={cn('scroll-mt-36 motion-reduce:animate-none', shouldAnimate ? 'animate-stats-support-in' : isVisible ? 'opacity-100' : 'opacity-0')} style={{ animationDelay: shouldAnimate ? '0.28s' : undefined }}>
          <Progress step={step} />

          {submissionError && (
            <div role="alert" className="mt-6 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm leading-6 text-foreground">
              {submissionError}{' '}
              <a href="mailto:nunez.aianmhyco.bernardino@gmail.com" className="font-semibold text-primary underline underline-offset-4">Contact Maycoder directly</a>
            </div>
          )}

          {step === 1 && (
            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <FieldLabel htmlFor="review-name">Name</FieldLabel>
                <input id="review-name" name="name" autoComplete="name" placeholder="Your name" className={cn(inputClass, 'mt-2')} value={form.name} onChange={(event) => update('name', event.target.value)} aria-invalid={Boolean(fieldErrors.name)} aria-describedby={fieldErrors.name ? 'review-name-error' : undefined} />
                <FieldError id="review-name-error" message={fieldErrors.name} />
              </div>
              <div className="sm:col-span-2">
                <FieldLabel htmlFor="review-email">Work email</FieldLabel>
                <input id="review-email" name="email" type="email" autoComplete="email" placeholder="you@company.com" className={cn(inputClass, 'mt-2')} value={form.email} onChange={(event) => update('email', event.target.value)} aria-invalid={Boolean(fieldErrors.email)} aria-describedby={fieldErrors.email ? 'review-email-error' : undefined} />
                <FieldError id="review-email-error" message={fieldErrors.email} />
              </div>
              <div>
                <FieldLabel htmlFor="review-company">Company name</FieldLabel>
                <input id="review-company" name="companyName" autoComplete="organization" placeholder="Company name" className={cn(inputClass, 'mt-2')} value={form.companyName} onChange={(event) => update('companyName', event.target.value)} aria-invalid={Boolean(fieldErrors.companyName)} aria-describedby={fieldErrors.companyName ? 'review-company-error' : undefined} />
                <FieldError id="review-company-error" message={fieldErrors.companyName} />
              </div>
              <div>
                <FieldLabel htmlFor="review-website">Company website <span className="text-muted-foreground">(optional)</span></FieldLabel>
                <input id="review-website" name="companyWebsite" type="url" autoComplete="url" placeholder="https://example.com" className={cn(inputClass, 'mt-2')} value={form.companyWebsite} onChange={(event) => update('companyWebsite', event.target.value)} />
              </div>
              <div className="sm:col-span-2">
                <Button type="button" variant="accent" onClick={continueToWorkflow} className="w-full sm:w-auto">
                  Continue <ArrowRight className="ml-1 size-4" aria-hidden />
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <form className="mt-7 grid gap-5 sm:grid-cols-2" onSubmit={handleSubmit} noValidate>
              <div>
                <FieldLabel htmlFor="review-industry">Industry</FieldLabel>
                <select id="review-industry" name="industry" className={cn(inputClass, 'mt-2')} value={form.industry} onChange={(event) => update('industry', event.target.value)} aria-invalid={Boolean(fieldErrors.industry)} aria-describedby={fieldErrors.industry ? 'review-industry-error' : undefined}>
                  <option value="">Choose one</option>
                  <option>Accounting or bookkeeping</option>
                  <option>Professional services</option>
                  <option>Agency or consultancy</option>
                  <option>Home or field services</option>
                  <option>Other service business</option>
                </select>
                <FieldError id="review-industry-error" message={fieldErrors.industry} />
              </div>
              <div>
                <FieldLabel htmlFor="review-team-size">Team size</FieldLabel>
                <select id="review-team-size" name="teamSize" className={cn(inputClass, 'mt-2')} value={form.teamSize} onChange={(event) => update('teamSize', event.target.value)} aria-invalid={Boolean(fieldErrors.teamSize)} aria-describedby={fieldErrors.teamSize ? 'review-team-size-error' : undefined}>
                  <option value="">Choose one</option>
                  <option>Just me</option>
                  <option>2–5 people</option>
                  <option>6–20 people</option>
                  <option>21–50 people</option>
                  <option>51+ people</option>
                </select>
                <FieldError id="review-team-size-error" message={fieldErrors.teamSize} />
              </div>
              <div className="sm:col-span-2">
                <FieldLabel htmlFor="review-tools">Current tools <span className="text-muted-foreground">(optional)</span></FieldLabel>
                <input id="review-tools" name="currentTools" placeholder="CRM, email, forms, spreadsheets..." className={cn(inputClass, 'mt-2')} value={form.currentTools} onChange={(event) => update('currentTools', event.target.value)} />
              </div>
              <div>
                <FieldLabel htmlFor="review-process">Process to improve</FieldLabel>
                <select id="review-process" name="processToImprove" className={cn(inputClass, 'mt-2')} value={form.processToImprove} onChange={(event) => update('processToImprove', event.target.value)} aria-invalid={Boolean(fieldErrors.processToImprove)} aria-describedby={fieldErrors.processToImprove ? 'review-process-error' : undefined}>
                  <option value="">Choose one</option>
                  <option>Lead capture and follow-up</option>
                  <option>Client onboarding</option>
                  <option>Documents and data entry</option>
                  <option>Internal tasks and approvals</option>
                  <option>Reporting and visibility</option>
                  <option>Other workflow</option>
                </select>
                <FieldError id="review-process-error" message={fieldErrors.processToImprove} />
              </div>
              <div>
                <FieldLabel htmlFor="review-timeframe">Timeframe</FieldLabel>
                <select id="review-timeframe" name="timeframe" className={cn(inputClass, 'mt-2')} value={form.timeframe} onChange={(event) => update('timeframe', event.target.value)} aria-invalid={Boolean(fieldErrors.timeframe)} aria-describedby={fieldErrors.timeframe ? 'review-timeframe-error' : undefined}>
                  <option value="">Choose one</option>
                  <option>As soon as practical</option>
                  <option>Within 1 month</option>
                  <option>Within 1–3 months</option>
                  <option>Researching for later</option>
                </select>
                <FieldError id="review-timeframe-error" message={fieldErrors.timeframe} />
              </div>
              <div className="sm:col-span-2">
                <FieldLabel htmlFor="review-bottleneck">What is the current bottleneck?</FieldLabel>
                <textarea id="review-bottleneck" name="bottleneck" rows={5} placeholder="What happens now, who handles it, and where does it slow down?" className={cn(inputClass, 'mt-2 min-h-36 resize-y')} value={form.bottleneck} onChange={(event) => update('bottleneck', event.target.value)} aria-invalid={Boolean(fieldErrors.bottleneck)} aria-describedby={fieldErrors.bottleneck ? 'review-bottleneck-error' : undefined} />
                <FieldError id="review-bottleneck-error" message={fieldErrors.bottleneck} />
              </div>
              <div className="sm:col-span-2">
                <FieldLabel htmlFor="review-budget">Optional budget range</FieldLabel>
                <select id="review-budget" name="budget" className={cn(inputClass, 'mt-2')} value={form.budget} onChange={(event) => update('budget', event.target.value)}>
                  <option>Not sure yet</option>
                  <option>Under $500</option>
                  <option>$500–$1,500</option>
                  <option>$1,500–$3,000</option>
                  <option>$3,000+</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className={cn('flex min-h-20 items-start gap-3 rounded-xl border border-primary/20 bg-primary/[0.05] p-4 text-sm leading-6', fieldErrors.consent && 'border-destructive/60 ring-2 ring-destructive/20')}>
                  <input type="checkbox" name="consent" checked={form.consent} onChange={(event) => update('consent', event.target.checked)} className="mt-1 size-5 shrink-0 accent-[var(--primary)]" aria-invalid={Boolean(fieldErrors.consent)} aria-describedby={fieldErrors.consent ? 'review-consent-error' : undefined} />
                  <span>I agree that Maycoder may use these details to evaluate and respond to my inquiry. <a href="/privacy" className="font-semibold text-primary underline underline-offset-4">Privacy details</a></span>
                </label>
                <FieldError id="review-consent-error" message={fieldErrors.consent} />
              </div>
              <div className="flex flex-col-reverse justify-between gap-3 sm:col-span-2 sm:flex-row">
                <Button type="button" variant="secondary" onClick={() => { setStep(1); setFieldErrors({}); setSubmissionError(null) }}>
                  <ArrowLeft className="mr-1 size-4" aria-hidden /> Back
                </Button>
                <Button type="submit" variant="accent" disabled={sending}>
                  {sending ? 'Submitting...' : 'Continue to calendar'} <CalendarDays className="ml-1 size-4" aria-hidden />
                </Button>
              </div>
            </form>
          )}

          {step === 3 && (
            <div className="mt-8 text-center">
              <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary"><Check className="size-7" aria-hidden /></span>
              <h4 className="mt-5 text-2xl font-bold tracking-[-0.03em]">Your review details are in.</h4>
              <p className="mx-auto mt-3 max-w-xl text-base leading-7 text-muted-foreground">Choose a convenient time below. Google Calendar will open the booking page in a secure scheduling window.</p>
              <div ref={targetRef} className="calendar-scheduling-host mx-auto mt-8 flex min-h-12 w-full items-center justify-center [&>button]:min-h-11 [&>button]:rounded-xl [&>button]:px-6 [&>button]:font-semibold" aria-live="polite" />
              {!calendarReady && <p className="mt-2 text-sm text-muted-foreground">Loading Google Calendar scheduling...</p>}
            </div>
          )}
              </div>

              <p className="text-right text-[11px] text-muted-foreground/80">
                {c.splitForms.poweredByLabel}{' '}
                <a href={c.splitForms.poweredByHref} target="_blank" rel="noopener noreferrer" className="no-underline transition-colors hover:text-foreground">
                  {c.splitForms.poweredByName}
                </a>
              </p>
            </div>

            <ContactSidebar visible={isVisible} animate={shouldAnimate} />
          </div>
        </div>
      </section>
    </>
  )
}
