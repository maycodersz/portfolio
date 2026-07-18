import { useVisitorPresence } from '@/realtime/VisitorPresenceContext'

export function LiveVisitorCounter() {
  const { count, status } = useVisitorPresence()
  const label = status === 'checking'
    ? 'Checking live activity…'
    : status === 'unavailable' || count === null
      ? 'Live count unavailable'
      : `${count} ${count === 1 ? 'visitor' : 'visitors'} online`

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={label}
      className="pointer-events-auto inline-flex min-h-11 max-w-[min(18rem,calc(100vw-2rem))] items-center gap-2 rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] px-3.5 text-xs font-semibold text-foreground shadow-md backdrop-blur-xl"
    >
      <span className="relative flex size-2.5 shrink-0" aria-hidden>
        {status === 'live' ? <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60 motion-reduce:animate-none" /> : null}
        <span className={`relative inline-flex size-2.5 rounded-full ${status === 'live' ? 'bg-emerald-500' : 'bg-muted-foreground/50'}`} />
      </span>
      <span className="max-[359px]:sr-only">{label}</span>
      {status === 'live' && count !== null ? <span className="hidden tabular-nums max-[359px]:inline">{count}</span> : null}
    </div>
  )
}
