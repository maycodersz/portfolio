import {
  AlertCircle,
  CheckCircle,
} from 'lucide-react'
import { type FormEvent, useCallback, useState } from 'react'
import { FaLinkedin } from 'react-icons/fa'
import type { IconType } from 'react-icons'
import {
  SiFacebook,
  SiGmail,
  SiInstagram,
  SiTiktok,
  SiYoutube,
} from 'react-icons/si'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  type ContactMethodPlatform,
  type ContactProjectTypeId,
  type ContactSocialPlatform,
  portfolio,
} from '@/content/portfolio'
import { useRevealOnView } from '@/hooks/useRevealOnView'
import { useSectionAnimState } from '@/hooks/useSectionAnimState'
import { useScrollDirection } from '@/hooks/useScrollDirection'
import { cn } from '@/utils/cn'

const c = portfolio.contact

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

function MethodBrandIcon({
  platform,
  className,
}: {
  platform: ContactMethodPlatform
  className?: string
}) {
  const Ico = METHOD_ICONS[platform]
  return (
    <Ico
      className={cn(
        'fill-[url(#contactIconGradLight)] dark:fill-[url(#contactIconGradDark)]',
        '[&_path]:fill-[url(#contactIconGradLight)] dark:[&_path]:fill-[url(#contactIconGradDark)]',
        className,
      )}
      aria-hidden
    />
  )
}

function SocialBrandIcon({
  platform,
  className,
}: {
  platform: ContactSocialPlatform
  className?: string
}) {
  const Ico = SOCIAL_ICONS[platform]
  return (
    <Ico
      className={cn(
        'fill-[url(#contactIconGradLight)] dark:fill-[url(#contactIconGradDark)]',
        '[&_path]:fill-[url(#contactIconGradLight)] dark:[&_path]:fill-[url(#contactIconGradDark)]',
        className,
      )}
      aria-hidden
    />
  )
}

const inputClass =
  'w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground ' +
  'focus:outline-none focus:ring-2 focus:ring-primary/50 ' +
  'dark:border-white/10 dark:bg-white/[0.04] dark:backdrop-blur-sm'

type FormState = {
  name: string
  email: string
  projectType: ContactProjectTypeId | ''
  message: string
}

const initialForm: FormState = {
  name: '',
  email: '',
  projectType: 'automation',
  message: '',
}

export function ContactSection() {
  const scrollDir = useScrollDirection()
  const suppress = scrollDir === 'up'
  const [sectionRef, isInView] = useRevealOnView<HTMLElement>({
    threshold: 0.14,
    rootMargin: '0px 0px -12% 0px',
    suppress,
  })
  const animState = useSectionAnimState(isInView, scrollDir)
  const canAnim = animState === 'animating'

  const [form, setForm] = useState<FormState>(initialForm)
  const [sending, setSending] = useState(false)
  const [successOpen, setSuccessOpen] = useState(false)
  const [errorOpen, setErrorOpen] = useState(false)
  const [errorDetail, setErrorDetail] = useState<string | null>(null)

  const update = useCallback(<K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }, [])

  const handleSuccessOpenChange = useCallback((open: boolean) => {
    setSuccessOpen(open)
    if (!open) {
      setForm(initialForm)
    }
  }, [])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const { name, email, projectType, message } = form
    if (!name.trim() || !email.trim() || !message.trim() || !projectType) {
      setErrorDetail(c.form.validationMessage)
      setErrorOpen(true)
      return
    }

    setSending(true)
    setErrorDetail(null)
    try {
      const res = await fetch(c.webhookUrls[projectType], {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, projectType, message }),
      })
      if (!res.ok) throw new Error('Webhook responded with an error')
      setSuccessOpen(true)
    } catch {
      setErrorDetail(null)
      setErrorOpen(true)
    } finally {
      setSending(false)
    }
  }

  const f = c.form
  const projectOptions = c.form.projectTypeOptions

  return (
    <>
      {/* Gradient fills for platform SVGs — matches brand-text-gradient (top → bottom, light / dark) */}
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
      <section
        ref={sectionRef}
        id="contact"
        aria-label={c.sectionAriaLabel}
        className="relative box-border flex min-h-[100dvh] flex-col overflow-hidden border-t border-border bg-background scroll-mt-[var(--navbar-height)]"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute right-0 top-1/2 h-[60%] w-[35%] -translate-y-1/2 rounded-full bg-primary/[0.07] blur-[140px]"
        />

        <div className="relative z-[1] flex flex-1 flex-col justify-center px-[10%] py-16 md:py-24">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
            <div className="flex w-full max-w-xl flex-col gap-6 lg:max-w-[min(34rem,44vw)]">
              <p
                className={cn(
                  'text-[11px] font-bold uppercase tracking-[0.38em] text-accent-foreground motion-reduce:animate-none',
                  canAnim ? 'animate-stats-eyebrow-in' : animState !== 'hidden' ? 'opacity-100' : 'opacity-0',
                )}
              >
                {c.eyebrow}
              </p>

              <h2
                className={cn(
                  'text-gradient-brand px-px py-px text-[clamp(2.5rem,5vw,3.75rem)] font-extrabold leading-[1.1] tracking-[-0.04em] motion-reduce:animate-none',
                  canAnim ? 'animate-stats-headline-in' : animState !== 'hidden' ? 'opacity-100' : 'opacity-0',
                )}
                style={{ animationDelay: canAnim ? '0.12s' : undefined }}
              >
                {c.title}
              </h2>

              <p
                className={cn(
                  'text-sm leading-relaxed text-muted-foreground motion-reduce:animate-none sm:text-[15px]',
                  canAnim ? 'animate-stats-support-in' : animState !== 'hidden' ? 'opacity-100' : 'opacity-0',
                )}
                style={{ animationDelay: canAnim ? '0.36s' : undefined }}
              >
                {c.description}
              </p>

              <form
                className={cn(
                  'flex flex-col gap-4 motion-reduce:animate-none',
                  canAnim ? 'animate-stats-support-in' : animState !== 'hidden' ? 'opacity-100' : 'opacity-0',
                )}
                style={{ animationDelay: canAnim ? '0.52s' : undefined }}
                onSubmit={handleSubmit}
                noValidate
              >
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="contact-name" className="text-gradient-brand block px-px py-px text-sm font-semibold">
                    {f.nameLabel}
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    className={inputClass}
                    placeholder={f.namePlaceholder}
                    value={form.name}
                    onChange={(e) => update('name', e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="contact-email" className="text-gradient-brand block px-px py-px text-sm font-semibold">
                    {f.emailLabel}
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    className={inputClass}
                    placeholder={f.emailPlaceholder}
                    value={form.email}
                    onChange={(e) => update('email', e.target.value)}
                  />
                </div>

                <fieldset className="min-w-0">
                  <legend className="text-gradient-brand mb-2 block px-px py-px text-sm font-semibold">
                    {f.projectTypeLabel}
                  </legend>
                  <div className="flex flex-wrap gap-2">
                    {projectOptions.map((opt) => {
                      const active = form.projectType === opt.id
                      return (
                        <label
                          key={opt.id}
                          className={cn(
                            'flex cursor-pointer items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors duration-150',
                            active
                              ? 'border-primary/30 bg-primary/15 text-accent-foreground'
                              : 'border-border bg-muted text-muted-foreground hover:border-primary/20 hover:bg-accent/60 hover:text-accent-foreground',
                          )}
                        >
                          <input
                            type="radio"
                            name="projectType"
                            value={opt.id}
                            checked={active}
                            onChange={() => update('projectType', opt.id)}
                            className="sr-only"
                          />
                          {opt.label}
                        </label>
                      )
                    })}
                  </div>
                </fieldset>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="contact-message" className="text-gradient-brand block px-px py-px text-sm font-semibold">
                    {f.messageLabel}
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={4}
                    className={cn(inputClass, 'min-h-[7.5rem] resize-y')}
                    placeholder={f.messagePlaceholderDefault}
                    value={form.message}
                    onChange={(e) => update('message', e.target.value)}
                  />
                </div>

                <Button type="submit" variant="accent" disabled={sending} className="mt-1 w-full sm:w-auto">
                  {sending ? f.submittingLabel : f.submitLabel}
                </Button>
              </form>
            </div>

            <div
              className={cn(
                'flex w-full min-w-0 flex-col gap-8 lg:max-w-md motion-reduce:animate-none',
                canAnim ? 'animate-stats-support-in' : animState !== 'hidden' ? 'opacity-100' : 'opacity-0',
              )}
              style={{ animationDelay: canAnim ? '0.68s' : undefined }}
            >
              <div>
                <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.38em] text-accent-foreground">
                  {c.methodsHeading}
                </p>
                <div className="flex flex-col gap-3">
                  {c.methods.map((m) => (
                    <a
                      key={m.id}
                      href={m.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        'flex items-center gap-4 rounded-2xl border border-border bg-background p-4 transition-all duration-300',
                        'hover:-translate-y-1 hover:shadow-[0_8px_28px_-12px_var(--brand-shadow-glow)]',
                        'active:scale-95 active:duration-150',
                        'dark:border-white/10 dark:bg-white/[0.04] dark:backdrop-blur-sm',
                      )}
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center">
                        <MethodBrandIcon platform={m.platform} className="h-8 w-8" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-gradient-brand px-px py-px text-xs font-semibold uppercase tracking-wide">
                          {m.label}
                        </p>
                        <p className="break-all text-sm font-medium text-foreground">{m.value}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.38em] text-accent-foreground">
                  {c.socialHeading}
                </p>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {c.socials.map((s) => (
                    <a
                      key={s.id}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        'flex flex-col items-center gap-2 rounded-2xl border border-border bg-background p-4 transition-all duration-300',
                        'hover:-translate-y-1 hover:shadow-[0_8px_28px_-12px_var(--brand-shadow-glow)]',
                        'active:scale-95 active:duration-150',
                        'dark:border-white/10 dark:bg-white/[0.04] dark:backdrop-blur-sm',
                      )}
                    >
                      <SocialBrandIcon platform={s.platform} className="h-9 w-9" />
                      <span className="text-gradient-brand px-px py-px text-center text-xs font-semibold">{s.label}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Dialog open={successOpen} onOpenChange={handleSuccessOpenChange}>
        <DialogContent className="max-w-sm">
          <DialogHeader className="items-center text-center sm:text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle className="h-8 w-8 text-primary" strokeWidth={2} aria-hidden />
            </div>
            <DialogTitle>{f.successTitle}</DialogTitle>
            <DialogDescription className="text-center">{f.successMessage}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center">
            <Button type="button" variant="accent" className="w-full sm:w-auto" onClick={() => handleSuccessOpenChange(false)}>
              {f.modalCloseLabel}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={errorOpen}
        onOpenChange={(open) => {
          setErrorOpen(open)
          if (!open) setErrorDetail(null)
        }}
      >
        <DialogContent className="max-w-sm flex-col items-center justify-center space-y-4">
          <DialogHeader className="items-center text-center sm:text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
              <AlertCircle className="h-8 w-8 text-destructive" strokeWidth={2} aria-hidden />
            </div>
            <DialogTitle>{f.errorTitle}</DialogTitle>
            <DialogDescription className="text-center">
              {errorDetail ?? f.errorMessage}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center">
            <Button type="button" className="w-full sm:w-auto" onClick={() => setErrorOpen(false)}>
              {f.modalCloseLabel}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
