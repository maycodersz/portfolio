import { useCallback, useEffect, useState, type RefObject } from 'react'

type CursorState = { x: number; y: number; visible: boolean }

/**
 * Tracks the cursor position relative to the viewport while the mouse is
 * inside the given container ref. Returns viewport-absolute coordinates so
 * the floating button can be portaled to `document.body` without offset math.
 */
export function useCursorFollow(containerRef: RefObject<HTMLElement | null>) {
  const [state, setState] = useState<CursorState>({ x: 0, y: 0, visible: false })
  const hide = useCallback(() => setState((current) => ({ ...current, visible: false })), [])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const onMove = (e: MouseEvent) => {
      setState({ x: e.clientX, y: e.clientY, visible: true })
    }
    const onEnter = (e: MouseEvent) => {
      setState({ x: e.clientX, y: e.clientY, visible: true })
    }
    const onLeave = () => {
      setState((s) => ({ ...s, visible: false }))
    }

    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseenter', onEnter)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseenter', onEnter)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [containerRef])

  return { ...state, hide }
}
