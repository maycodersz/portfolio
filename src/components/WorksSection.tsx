import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { WithCursorFollow } from '@/components/CursorFollowButton'
import { DeviceScreenPlaceholder } from '@/components/device/DeviceScreenPlaceholder'
import {
  MonitorFrame,
  PhoneFrame,
  TabletFrame,
} from '@/components/device/DeviceFrames'
import { type Project, portfolio } from '@/content/portfolio'
import { useSectionReveal } from '@/hooks/useSectionReveal'
import { cn } from '@/utils/cn'

/* ─── Device stage layouts ───────────────────────────────────────────────── */

/** Shared stage sizing — website and mobile projects use the same canvas. */
const DEVICE_STAGE_CLASS =
  'relative z-[1] mx-auto w-full max-w-5xl [perspective:1400px] [perspective-origin:50%_40%]'

/** Vertical space for the absolutely positioned device cluster */
const DEVICE_STAGE_SPACER_CLASS = 'h-[clamp(160px,32vw,380px)]'

function WebsiteDeviceStage({
  screens,
  visible,
  canAnimate,
  alts,
}: {
  screens: Project['screens']
  visible: boolean
  canAnimate: boolean
  alts: typeof portfolio.works.devicePreviewAlt
}) {
  return (
    <div className={DEVICE_STAGE_CLASS}>
      <div className="absolute left-1/2 top-0 z-[1] w-[58%] -translate-x-1/2">
        <MonitorFrame src={screens.desktop!} visible={visible} canAnimate={canAnimate} desktopAlt={alts.desktop} />
      </div>
      <div className="absolute right-[0%] top-[8%] z-[5] w-[34%]">
        <TabletFrame src={screens.tablet} visible={visible} canAnimate={canAnimate} tabletAlt={alts.tablet} />
      </div>
      <div className="absolute left-[1%] top-[18%] z-10 w-[17%]">
        <PhoneFrame src={screens.phone} visible={visible} canAnimate={canAnimate} phoneAlt={alts.phone} />
      </div>
      <div className={DEVICE_STAGE_SPACER_CLASS} aria-hidden />
    </div>
  )
}

function MobileDeviceStage({
  screens,
  screensUsePlaceholder,
  visible,
  canAnimate,
  alts,
}: {
  screens: Project['screens']
  screensUsePlaceholder?: boolean
  visible: boolean
  canAnimate: boolean
  alts: typeof portfolio.works.devicePreviewAlt
}) {
  const placeholderLabel = portfolio.devicePlaceholder.label

  return (
    <div className={DEVICE_STAGE_CLASS}>
      <div className="absolute right-[20%] top-[8%] z-[5] w-[34%]">
        {screensUsePlaceholder ? (
          <TabletFrame visible={visible} canAnimate={canAnimate} tabletAlt={alts.tablet}>
            <DeviceScreenPlaceholder label={placeholderLabel} />
          </TabletFrame>
        ) : (
          <TabletFrame src={screens.tablet} visible={visible} canAnimate={canAnimate} tabletAlt={alts.tablet} />
        )}
      </div>
      <div className="absolute left-[25%] top-[18%] z-10 w-[17%]">
        {screensUsePlaceholder ? (
          <PhoneFrame visible={visible} canAnimate={canAnimate} phoneAlt={alts.phone}>
            <DeviceScreenPlaceholder label={placeholderLabel} />
          </PhoneFrame>
        ) : (
          <PhoneFrame src={screens.phone} visible={visible} canAnimate={canAnimate} phoneAlt={alts.phone} />
        )}
      </div>
      <div className={DEVICE_STAGE_SPACER_CLASS} aria-hidden />
    </div>
  )
}

/* ─── Single project card ────────────────────────────────────────────────── */

function ProjectCard({ project }: { project: Project }) {
  const {
    ref: sectionRef,
    isVisible: visible,
    revealKey,
    shouldAnimate: canAnimate,
  } = useSectionReveal<HTMLElement>({
    threshold: 0.1,
  })
  const navigate = useNavigate()
  const { devicePreviewAlt, metaDurationLabel, metaProjectTypeLabel, viewWorkCursorLabel } =
    portfolio.works

  const isMobile = project.kind === 'mobile'
  const goWork = () => navigate(`/work/${project.id}`)

  return (
    <section
      ref={sectionRef}
      aria-label={project.title}
      className={cn(
        'relative z-0 flex min-h-dvh flex-col',
        'scroll-mt-[var(--navbar-height)] overflow-x-clip border-t border-border bg-background',
        'py-10 md:py-14 lg:py-16',
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-[10%] top-[30%] h-[50%] w-[40%] rounded-full bg-primary/[0.08] blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-[5%] top-[20%] h-[40%] w-[30%] rounded-full bg-primary/[0.055] blur-[100px]"
      />

      <div className="flex min-h-0 flex-1 flex-col px-[10%]">
        <WithCursorFollow
          containerClassName="flex min-h-0 flex-1 flex-col justify-center"
          label={viewWorkCursorLabel}
          onClick={goWork}
          analyticsEvent="project_card_click"
          analyticsLabel={project.title}
        >
          {isMobile ? (
            <MobileDeviceStage
              key={revealKey}
              screens={project.screens}
              screensUsePlaceholder={project.screensUsePlaceholder}
              visible={visible}
              canAnimate={canAnimate}
              alts={devicePreviewAlt}
            />
          ) : (
            <WebsiteDeviceStage
              key={revealKey}
              screens={project.screens}
              visible={visible}
              canAnimate={canAnimate}
              alts={devicePreviewAlt}
            />
          )}
        </WithCursorFollow>

        <div className="w-full shrink-0 space-y-2 py-4 md:pt-10 lg:py-12">
          <div
            role="button"
            data-analytics-event="project_card_click"
            data-analytics-label={project.title}
            tabIndex={0}
            onClick={goWork}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                goWork()
              }
            }}
            className={cn(
              'flex flex-col overflow-hidden rounded-2xl border border-primary/[0.18] outline-none',
              'bg-[var(--works-info-bg)] shadow-[inset_0_1px_0_rgb(124_79_226/8%)]',
              'focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
              'md:flex-row md:divide-x md:divide-primary/15',
              'divide-y divide-primary/15 md:divide-y-0',
            )}
          >
            <div className="flex shrink-0 items-center justify-center px-6 py-6 md:w-[min(28%,200px)] md:px-5">
              <span className="text-center text-[11px] font-bold uppercase leading-tight tracking-widest text-foreground">
                {project.title}
              </span>
            </div>

            <div className="min-w-0 flex-1 px-6 py-6 md:px-8">
              {project.highlight && (
                <p className="text-gradient-brand px-px py-px text-sm font-medium leading-snug sm:text-[15px]">
                  {project.highlight}
                </p>
              )}
              <p
                className={cn(
                  'mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base',
                  !project.highlight && 'mt-0',
                )}
              >
                {project.description}
              </p>
            </div>

            <div className="flex shrink-0 flex-col justify-center gap-5 px-6 py-6 md:w-[min(32%,260px)] md:px-6">
              <div>
                <p className="text-gradient-brand px-px py-px text-sm font-bold">{metaProjectTypeLabel}</p>
                <p className="mt-1 text-sm text-foreground">{project.projectType}</p>
              </div>
              <div>
                <p className="text-gradient-brand px-px py-px text-sm font-bold">{metaDurationLabel}</p>
                <p className="mt-1 text-sm text-foreground">{project.duration}</p>
              </div>
            </div>
          </div>

          {/* Mobile-only View Work button */}
          <div className="flex justify-center pt-2 lg:hidden">
            <Button variant="accent" size="sm" onClick={goWork}>
              {viewWorkCursorLabel} →
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Section ────────────────────────────────────────────────────────────── */

export function WorksSection() {
  const visibleProjects = portfolio.projects.filter((project) => project.showInWorks !== false)

  return (
    <>
      {visibleProjects.map((project) => (
        <ProjectCard key={project.id} project={project as Project} />
      ))}
    </>
  )
}
