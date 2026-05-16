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
 * Hide the global paper-plane cursor while the pointer is inside this subtree
 * so only layered UI (e.g. View Work) reads as the cursor.
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
