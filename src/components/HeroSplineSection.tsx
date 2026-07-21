import { useRef, useState } from 'react'
import { useTheme } from '@/contexts/ThemeContext'

import alterEgoDarkImg from '@/assets/hero/alter-ego-dark.png'
import alterEgoLightImg from '@/assets/hero/alter-ego-light.png'
import profileDarkImg from '@/assets/hero/profile-dark.png'
import profileLightImg from '@/assets/hero/profile-light.png'
import { Button } from '@/components/ui/button'
import Link from '@/components/ui/link'
import { portfolio, type HeroCta } from '@/content/portfolio'
import { useIsPointerFine } from '@/hooks/useIsPointerFine'
import { useSectionReveal } from '@/hooks/useSectionReveal'
import { cn } from '@/utils/cn'

const { hero } = portfolio

/* ── CTA row ─────────────────────────────────────────────────────────────── */

function HeroCtaRow({ actions }: { actions: readonly HeroCta[] }) {
  return (
    <div className="mt-6 flex flex-wrap gap-3">
      {actions.map((action) => {
        switch (action.tone) {
          case 'secondary':
            return (
              <Button key={action.id} asChild variant="secondary" size="default">
                <Link href={action.href} data-analytics-event="hero_cta_click" data-analytics-label={action.label}>{action.label}</Link>
              </Button>
            )
          case 'main':
            return (
              <Button key={action.id} asChild variant="accent" size="default">
                <Link href={action.href} data-analytics-event="hero_cta_click" data-analytics-label={action.label}>{action.label}</Link>
              </Button>
            )
          default: {
            const _exhaustiveTone: never = action.tone
            return _exhaustiveTone
          }
        }
      })}
    </div>
  )
}

/* ── Rolling heading ─────────────────────────────────────────────────────── */

/* ── Hero portrait ─────────────────────────────────────────────────────────── */

/**
 * Profile fills the frame at rest.
 * On hover (fine pointer), profile gets an inverse radial mask (transparent under the cursor)
 * while alter ego is drawn only inside a matching spotlight mask — mirrors the previous stack.
 */
function HeroProfileStage() {
  const { theme } = useTheme()
  const isPointerFine = useIsPointerFine()
  const alterEgoImg = theme === 'dark' ? alterEgoDarkImg : alterEgoLightImg
  const profileImg = theme === 'dark' ? profileDarkImg : profileLightImg

  const containerRef = useRef<HTMLDivElement>(null)
  const [localPos, setLocalPos] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

  const syncPosFromEvent = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isPointerFine) return
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    setLocalPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  /* Opaque centre = alter ego visible here; fades to transparent outward */
  const alterEgoSpotlightMask = `radial-gradient(circle 200px at ${localPos.x}px ${localPos.y}px, rgb(255 255 255) 0%, rgb(255 255 255) 43%, rgb(255 255 255 / 0) 100%)`

  /*
   * Inverse mask on profile while hovering: transparent hole under the light
   * (slightly wider + earlier fade than the spotlight mask) so alter ego paints cleanly inside.
   */
  const profileCutoutMask = `radial-gradient(circle 220px at ${localPos.x}px ${localPos.y}px, rgb(255 255 255 / 0) 0%, rgb(255 255 255 / 0) 38%, rgb(255 255 255) 60%, rgb(255 255 255) 100%)`

  const imgClass =
    'pointer-events-none absolute inset-0 h-full w-full select-none object-contain object-bottom'

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full"
      onMouseMove={syncPosFromEvent}
      onMouseEnter={(e) => {
        if (!isPointerFine) return
        syncPosFromEvent(e)
        setIsHovering(true)
      }}
      onMouseLeave={() => {
        if (!isPointerFine) return
        setIsHovering(false)
      }}
    >
      {/* Profile — always visible, untouched when not hovering */}
      <img
        src={profileImg}
        alt={hero.profileAlt}
        loading="eager"
        decoding="async"
        draggable={false}
        className={cn(imgClass, 'z-[1]')}
        style={
          isHovering && isPointerFine
            ? {
                maskImage: profileCutoutMask,
                maskSize: '100% 100%',
                maskRepeat: 'no-repeat',
                WebkitMaskImage: profileCutoutMask,
                WebkitMaskSize: '100% 100%',
                WebkitMaskRepeat: 'no-repeat',
              }
            : undefined
        }
      />

      {/* Alter ego — only rendered inside spotlight while hovering */}
      {isHovering && isPointerFine && (
        <img
          src={alterEgoImg}
          alt=""
          aria-hidden
          draggable={false}
          className={cn(imgClass, 'z-[2]')}
          style={{
            maskImage: alterEgoSpotlightMask,
            maskSize: '100% 100%',
            maskRepeat: 'no-repeat',
            WebkitMaskImage: alterEgoSpotlightMask,
            WebkitMaskSize: '100% 100%',
            WebkitMaskRepeat: 'no-repeat',
          }}
        />
      )}

      {/* Spotlight glow — soft purple light at cursor */}
      {isHovering && isPointerFine && (
        <div
          aria-hidden
          className="pointer-events-none absolute z-[5]"
          style={{
            left: localPos.x,
            top: localPos.y,
            width: 320,
            height: 320,
            transform: 'translate(-50%, -50%)',
            background:
              'radial-gradient(circle, var(--hero-portrait-spot-inner) 0%, var(--hero-portrait-spot-edge) 48%, transparent 72%)',
            filter: 'blur(20px)',
            mixBlendMode: 'screen',
          }}
        />
      )}

      {/* Ambient bottom glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[3]"
        style={{
          background:
            'radial-gradient(ellipse 55% 35% at 50% 100%, rgb(124 79 226 / 10%) 0%, transparent 70%)',
        }}
      />
    </div>
  )
}

/* ── Section ─────────────────────────────────────────────────────────────── */

export function HeroSplineSection() {
  const {
    ref: heroRef,
    isVisible: heroVisible,
    shouldAnimate: canAnim,
    revealKey: heroPlayKey,
  } = useSectionReveal<HTMLElement>({
    threshold: 0.14,
    rootMargin: '0px 0px -12% 0px',
    resetOnCycle: false,
  })

  const isPointerFine = useIsPointerFine()

  /* Section-level fog: a soft purple mist that follows the cursor */
  const [fogPos, setFogPos] = useState({ x: 0, y: 0 })
  const [fogVisible, setFogVisible] = useState(false)

  const handleSectionMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!isPointerFine) return
    const rect = e.currentTarget.getBoundingClientRect()
    setFogPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    if (!fogVisible) setFogVisible(true)
  }

  return (
    <section
      ref={heroRef}
      aria-label="Hero"
      className="-mt-[var(--navbar-height)] pt-[var(--navbar-height)] relative z-0 m-0 w-full max-w-none scroll-mt-[var(--navbar-height)] overflow-hidden p-0"
      onMouseMove={handleSectionMouseMove}
      onMouseLeave={() => setFogVisible(false)}
    >
      {/* Ambient bg tint */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 65% 50%, rgb(124 79 226 / 7%) 0%, transparent 65%)',
        }}
      />

      {/* Fog glow — CSS transition gives the "lag" that makes it feel like holding fog */}
      <div
        aria-hidden
        className="pointer-events-none absolute z-[1]"
        style={{
          left: fogPos.x,
          top: fogPos.y,
          width: 580,
          height: 580,
          transform: 'translate(-50%, -50%)',
          background:
            'radial-gradient(circle, rgb(124 79 226 / 10%) 0%, rgb(92 59 170 / 5%) 42%, transparent 70%)',
          filter: 'blur(60px)',
          transition: 'left 0.25s ease-out, top 0.25s ease-out, opacity 0.35s ease',
          opacity: fogVisible ? 1 : 0,
          pointerEvents: 'none',
        }}
      />

      <div className="relative z-[2] box-border flex w-full flex-col px-[10%] lg:h-[calc(100dvh-var(--navbar-height))] lg:min-h-[min(480px,calc(100dvh-var(--navbar-height)))] lg:flex-row">
        {/* Left — text; key remounts when hero re-enters view on desktop */}
        <div
          key={heroPlayKey}
          className="relative z-[2] box-border flex w-full min-w-0 flex-col justify-start pb-6 pt-8 lg:flex-1 lg:justify-center lg:py-8"
        >
          <div
            className={cn(
              'motion-reduce:animate-none',
              canAnim ? 'animate-stats-headline-in' : heroVisible ? 'opacity-100' : 'opacity-0',
            )}
          >
            <p className="mb-5 text-[11px] font-bold uppercase tracking-[0.38em] text-accent-foreground sm:text-xs">
              {hero.eyebrow}
            </p>
            <h1 className="text-gradient-brand m-0 max-w-3xl px-px py-px text-[clamp(2rem,4vw,3rem)] font-bold leading-tight tracking-[-0.02em]">
              {hero.headline}
            </h1>
          </div>

          <p
            className={cn(
              'mt-4 max-w-xl text-base leading-relaxed text-muted-foreground motion-reduce:animate-none sm:text-xl',
              canAnim ? 'animate-stats-support-in' : heroVisible ? 'opacity-100' : 'opacity-0',
            )}
            style={{ animationDelay: canAnim ? '0.48s' : undefined }}
          >
            {hero.description}
          </p>

          <div
            className={cn(
              'motion-reduce:animate-none',
              canAnim ? 'animate-stats-support-in' : heroVisible ? 'opacity-100' : 'opacity-0',
            )}
            style={{ animationDelay: canAnim ? '0.72s' : undefined }}
          >
            <HeroCtaRow actions={hero.ctas} />
          </div>
        </div>

        {/* Right — profile stage; hidden on mobile/tablet, shown from lg up */}
        <div className="relative z-[2] box-border hidden w-full min-w-0 lg:flex lg:min-h-0 lg:flex-1">
          <HeroProfileStage />
        </div>
      </div>
    </section>
  )
}
