import desktopImg from '@/assets/desktop.png'
import phoneImg from '@/assets/phone.png'
import tabletImg from '@/assets/tablet.png'
import { cn } from '@/utils/cn'

const TILT_TRANSITION =
  'transition-[transform] duration-500 [transition-timing-function:cubic-bezier(0.33,1,0.68,1)]'

export type DeviceFrameAltText = {
  desktop: string
  tablet: string
  phone: string
}

export function MonitorFrame({
  src,
  visible,
  desktopAlt,
}: {
  src?: string
  visible: boolean
  desktopAlt: string
}) {
  return (
    <div
      className={cn(
        'device-animated will-change-transform',
        visible ? 'animate-device-rise [animation-delay:320ms]' : 'opacity-0',
      )}
    >
      <div
        className={cn(
          '[transform:rotateY(-3deg)]',
          TILT_TRANSITION,
          'hover:[transform:rotateY(-6deg)_rotateZ(1.5deg)_scale(1.02)]',
        )}
      >
        <div className="overflow-hidden rounded-[10px] border border-primary/22 bg-[var(--device-frame-bg)] p-[6px] shadow-[0_0_0_1px_rgb(124_79_226/32%),0_32px_80px_-12px_rgba(0,0,0,0.85),inset_0_1px_0_rgb(124_79_226/10%)]">
          <div className="overflow-hidden rounded-[6px]">
            <img
              src={src ?? desktopImg}
              alt={desktopAlt}
              className="block w-full object-cover object-top"
              draggable={false}
            />
          </div>
        </div>
        <div className="mx-auto h-[clamp(18px,2.2vw,28px)] w-[8%] bg-gradient-to-b from-[var(--device-frame-stand-from)] to-[var(--device-frame-stand-to)]" />
        <div className="mx-auto h-[clamp(8px,1vw,12px)] w-[42%] rounded-full bg-gradient-to-b from-[var(--device-frame-base-from)] to-[var(--device-frame-base-to)] shadow-[0_2px_12px_rgba(0,0,0,0.6)]" />
      </div>
    </div>
  )
}

export function TabletFrame({
  src,
  visible,
  tabletAlt,
}: {
  src?: string
  visible: boolean
  tabletAlt: string
}) {
  return (
    <div
      className={cn(
        'device-animated will-change-transform',
        visible ? 'animate-device-enter-right [animation-delay:460ms]' : 'opacity-0',
      )}
    >
      <div
        className={cn(
          '[transform:rotateY(-10deg)_rotateZ(1.5deg)]',
          TILT_TRANSITION,
          'hover:[transform:rotateY(-14deg)_rotateZ(3.5deg)_scale(1.03)]',
        )}
      >
        <div className="relative overflow-hidden rounded-[12px] border border-primary/20 bg-[var(--device-frame-bg)] p-[7px] shadow-[0_0_0_1px_rgb(124_79_226/28%),0_24px_60px_-10px_rgba(0,0,0,0.9),inset_0_1px_0_rgb(124_79_226/8%)]">
          <div className="absolute left-1/2 top-[3px] h-[5px] w-[5px] -translate-x-1/2 rounded-full bg-[var(--device-frame-dot)] shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]" />
          <div className="overflow-hidden rounded-[6px]">
            <img
              src={src ?? tabletImg}
              alt={tabletAlt}
              className="block w-full object-cover object-top"
              draggable={false}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export function PhoneFrame({
  src,
  visible,
  phoneAlt,
}: {
  src?: string
  visible: boolean
  phoneAlt: string
}) {
  return (
    <div
      className={cn(
        'device-animated relative will-change-transform',
        visible ? 'animate-device-enter-left [animation-delay:120ms]' : 'opacity-0',
      )}
    >
      <div className="pointer-events-none absolute -right-[3px] top-[22%] h-[14%] w-[3px] rounded-r-sm bg-[var(--device-frame-button)]" />
      <div className="pointer-events-none absolute -left-[3px] top-[18%] h-[8%] w-[3px] rounded-l-sm bg-[var(--device-frame-button)]" />
      <div className="pointer-events-none absolute -left-[3px] top-[30%] h-[12%] w-[3px] rounded-l-sm bg-[var(--device-frame-button)]" />
      <div
        className={cn(
          '[transform:rotateY(5deg)_rotateZ(-1deg)]',
          TILT_TRANSITION,
          'hover:[transform:rotateY(2deg)_rotateZ(-3deg)_scale(1.03)]',
        )}
      >
        <div className="relative overflow-hidden rounded-[clamp(20px,3vw,32px)] border border-primary/20 bg-[var(--device-frame-bg)] p-[5px] shadow-[0_0_0_1px_rgb(124_79_226/28%),0_20px_50px_-8px_rgba(0,0,0,0.9),inset_0_1px_0_rgb(124_79_226/8%)]">
          <div className="absolute left-1/2 top-[6px] z-[1] h-[8px] w-[28%] -translate-x-1/2 rounded-full bg-[var(--device-frame-notch)] shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]" />
          <div className="overflow-hidden rounded-[clamp(16px,2.5vw,26px)]">
            <img
              src={src ?? phoneImg}
              alt={phoneAlt}
              className="block w-full object-cover object-top"
              draggable={false}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
