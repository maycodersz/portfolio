import type { ReactNode } from 'react'

import { FloatingUiStack } from '@/components/FloatingUiStack'
import { GlobalPaperPlaneCursor } from '@/components/GlobalPaperPlaneCursor'
import { RevealCycleProvider } from '@/contexts/RevealCycleContext'
import { cn } from '@/utils/cn'

type AppShellProps = {
  children: ReactNode
  className?: string
}

export function AppShell({ children, className }: AppShellProps) {
  return (
    <RevealCycleProvider>
      <div
        className={cn(
          'flex min-h-dvh w-full flex-col bg-[color:var(--color-page-background)] text-[color:var(--color-page-foreground)]',
          className,
        )}
      >
        {/* overflow-x-clip trims horizontal bleed without creating a scroll container,
            so position:sticky inside child sections continues to work correctly */}
        <main className="relative flex-1 overflow-x-clip">{children}</main>
        <FloatingUiStack />
        <GlobalPaperPlaneCursor />
      </div>
    </RevealCycleProvider>
  )
}
