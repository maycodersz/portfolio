/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

type SiteCursorContextValue = {
  paperPlaneSuppressed: boolean
  setPaperPlaneSuppressed: (v: boolean) => void
}

const SiteCursorContext = createContext<SiteCursorContextValue | null>(null)

export function SiteCursorProvider({ children }: { children: ReactNode }) {
  const [paperPlaneSuppressed, setPaperPlaneSuppressed] = useState(false)
  const value = useMemo(
    () => ({ paperPlaneSuppressed, setPaperPlaneSuppressed }),
    [paperPlaneSuppressed],
  )
  return <SiteCursorContext.Provider value={value}>{children}</SiteCursorContext.Provider>
}

export function useSiteCursor() {
  const ctx = useContext(SiteCursorContext)
  if (!ctx) {
    throw new Error('useSiteCursor must be used within SiteCursorProvider')
  }
  return ctx
}

/**
 * Optional wrapper: hide the paper-plane cursor for a subtree without using `WithCursorFollow`.
 * Prefer `WithCursorFollow` for View Work zones — it scopes suppression to that element only.
 */
export function WorksPaperPlaneSuppressor({
  children,
  id,
  className,
}: {
  children: ReactNode
  id?: string
  className?: string
}) {
  const { setPaperPlaneSuppressed } = useSiteCursor()
  return (
    <div
      id={id}
      role="presentation"
      className={className}
      onMouseEnter={() => setPaperPlaneSuppressed(true)}
      onMouseLeave={() => setPaperPlaneSuppressed(false)}
    >
      {children}
    </div>
  )
}
