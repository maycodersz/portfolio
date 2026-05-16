import * as React from 'react'
import { Link as RouterLink } from 'react-router-dom'

export type LinkProps = {
  href?: string
  children?: React.ReactNode
  className?: string
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>

/** Unified link — uses React Router for internal paths, native <a> for external/hash-only. */
export default function Link({ href = '#', children, className, ...rest }: LinkProps) {
  const isExternal =
    href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:')
  const isHashOnly = href.startsWith('#')

  if (isExternal || isHashOnly) {
    return (
      <a
        href={href}
        className={className}
        {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...rest}
      >
        {children}
      </a>
    )
  }

  return (
    <RouterLink to={href} className={className}>
      {children}
    </RouterLink>
  )
}
