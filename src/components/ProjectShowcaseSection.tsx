import {
  MonitorFrame,
  PhoneFrame,
  TabletFrame,
} from '@/components/device/DeviceFrames'
import { portfolio } from '@/content/portfolio'
import { useRevealOnView } from '@/hooks/useRevealOnView'
import { cn } from '@/utils/cn'

const DEVICE_STAGE_SPACER_FEATURED = 'h-[clamp(300px,60vw,700px)]'

export function ProjectShowcaseSection() {
  const [sectionRef, visible, revealKey] = useRevealOnView<HTMLElement>({
    threshold: 0.14,
    rootMargin: '0px 0px -12% 0px',
  })
  const { devicePreviewAlt } = portfolio.works

  return (
    <section
      ref={sectionRef}
      aria-label={portfolio.projectShowcase.sectionAriaLabel}
      className="relative z-0 scroll-mt-[var(--navbar-height)] overflow-x-clip border-t border-border bg-background px-[10%] pb-32 pt-24"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-[10%] top-[30%] h-[50%] w-[40%] rounded-full bg-primary/[0.08] blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-[5%] top-[20%] h-[40%] w-[30%] rounded-full bg-primary/[0.055] blur-[100px]"
      />

      <div
        key={revealKey}
        className={cn(
          'relative z-[1] mx-auto w-full max-w-5xl',
          '[perspective:1400px] [perspective-origin:50%_40%]',
        )}
      >
        <div className="absolute left-1/2 top-0 z-[1] w-[58%] -translate-x-1/2">
          <MonitorFrame visible={visible} desktopAlt={devicePreviewAlt.desktop} />
        </div>

        <div className="absolute right-[0%] top-[8%] z-[5] w-[34%]">
          <TabletFrame visible={visible} tabletAlt={devicePreviewAlt.tablet} />
        </div>

        <div className="absolute left-[1%] top-[18%] z-10 w-[17%]">
          <PhoneFrame visible={visible} phoneAlt={devicePreviewAlt.phone} />
        </div>

        <div className={DEVICE_STAGE_SPACER_FEATURED} aria-hidden />
      </div>
    </section>
  )
}
