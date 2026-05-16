import * as React from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'

export type LinkProps = {
  href?: string
  children?: React.ReactNode
  className?: string
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>

/** True for same-origin anchors like `/#contact` — React Router's `<Link to={...}>` does not reliably scroll hash targets */
function internalPathFragment(
  href: string,
): { pathname: string; hashFrag: string } | null {
  if (!href.startsWith('/') || !href.includes('#')) return null
  try {
    const u = new URL(href, window.location.origin)
    if (u.origin !== window.location.origin) return null
    const frag = u.hash.startsWith('#') ? u.hash.slice(1) : ''
    if (!frag) return null
    return {
      pathname: u.pathname || '/',
      hashFrag: frag,
    }
  } catch {
    return null
  }
}

/** Unified link: native anchors for externals/hash-only/path#hash (with SPA navigate for hashes); RouterLink for plain in-app routes. */
export default function Link({ href = '#', children, className, onClick, ...rest }: LinkProps) {
  const navigate = useNavigate()

  const isHttpExternal = href.startsWith('http://') || href.startsWith('https://')
  const isMailto = href.startsWith('mailto:')
  const isHashOnly = href.startsWith('#')
  const fragmentPath = React.useMemo(() => internalPathFragment(href), [href])

  const navigateFragmentThenScroll = React.useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      onClick?.(e)
      if (e.defaultPrevented || !fragmentPath) return
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
      e.preventDefault()
      navigate({
        pathname: fragmentPath.pathname,
        hash: fragmentPath.hashFrag,
      })
    },
    [fragmentPath, navigate, onClick],
  )

  if (isHttpExternal) {
    return (
      <a
        href={href}
        className={className}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
        {...rest}
      >
        {children}
      </a>
    )
  }

  if (isMailto) {
    return (
      <a href={href} className={className} onClick={onClick} {...rest}>
        {children}
      </a>
    )
  }

  if (isHashOnly) {
    return (
      <a href={href} className={className} onClick={onClick} {...rest}>
        {children}
      </a>
    )
  }

  if (fragmentPath) {
    return (
      <a href={href} className={className} onClick={navigateFragmentThenScroll} {...rest}>
        {children}
      </a>
    )
  }

  return (
    <RouterLink to={href} className={className} onClick={onClick} {...rest}>
      {children}
    </RouterLink>
  )
}
