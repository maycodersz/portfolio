import { Smartphone } from 'lucide-react'

import { cn } from '@/utils/cn'

type DeviceScreenPlaceholderProps = {
  label: string
  className?: string
}

export function DeviceScreenPlaceholder({ label, className }: DeviceScreenPlaceholderProps) {
  return (
    <div
      className={cn(
        'flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-b from-muted/50 to-muted/25 px-4 text-center',
        className,
      )}
      aria-hidden
    >
      <span className="flex size-10 items-center justify-center rounded-2xl border border-primary/20 bg-background/60 text-accent-foreground shadow-sm">
        <Smartphone className="size-5" strokeWidth={1.75} aria-hidden />
      </span>
      <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">{label}</span>
    </div>
  )
}
