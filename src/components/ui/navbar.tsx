import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { Menu, Moon, Sun, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import Link from '@/components/ui/link'
import { useTheme } from '@/contexts/ThemeContext'
import { portfolio, type NavbarItem } from '@/content/portfolio'
import { cn } from '@/utils/cn'

/* ─── Concept: Option 1 — frosted glass panel (rounded rect, subtle glass, clean divider) ─── */

const frostedPanelBase =
  'w-full max-w-4xl rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-[12px] backdrop-saturate-150 transition-[background-color,border-color,box-shadow] duration-300 ease-[cubic-bezier(0.33,1,0.68,1)]'

const frostedPanelScrolled =
  'border-[color:var(--glass-divider)] bg-white/[0.85] dark:bg-white/[0.08] shadow-[0_8px_32px_-12px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_-12px_rgba(0,0,0,0.45)]'

const brandClass =
  'text-gradient-brand inline-block rounded-sm px-px py-px text-xl font-bold leading-tight tracking-[-0.03em] no-underline outline-none transition-[filter,opacity] duration-200 ease-out hover:brightness-110 focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent sm:text-2xl'

const navLinkBase =
  'inline-flex items-center justify-center rounded-lg px-3.5 py-2 text-sm font-medium leading-tight text-[var(--glass-text)] no-underline outline-none transition-colors duration-200 hover:text-[var(--glass-text-hover)] focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent sm:px-4 sm:text-[15px]'

const navLinkActiveClass = 'bg-[var(--glass-bg)] text-[var(--glass-text-hover)]'

const navLinkMobileClass = cn(navLinkBase, 'w-full justify-start px-4 py-4 text-lg')

const dividerClass = 'mx-2 h-5 w-px shrink-0 bg-[var(--glass-divider)]'

const navCtaButtonClass = 'rounded-xl px-3.5 font-medium sm:px-4'

export interface NavbarProps {
  brandHref?: string
  brandName?: string
  items?: ReadonlyArray<NavbarItem>
}

function hrefHashMatchesLocation(href: string, locationHash: string): boolean {
  try {
    const u = new URL(href, window.location.origin)
    return u.hash !== '' && locationHash === u.hash
  } catch {
    return false
  }
}

function partitionNavItems(items: ReadonlyArray<NavbarItem>) {
  const links = items.filter((i) => i.kind === 'link')
  const ctas = items.filter((i) => i.kind === 'cta')
  return { links, ctas }
}

type DesktopNavProps = {
  items: ReadonlyArray<NavbarItem>
  locationHash: string
}

/** Section links — centered in the middle column on md+ */
function DesktopNavLinks({ items, locationHash }: DesktopNavProps) {
  const { links } = useMemo(() => partitionNavItems(items), [items])

  return (
    <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-1.5">
      {links.map((item) => {
        const active = hrefHashMatchesLocation(item.href, locationHash)
        return (
          <Link
            key={item.id}
            href={item.href}
            className={cn(navLinkBase, active && navLinkActiveClass)}
            aria-current={active ? 'page' : undefined}
          >
            {item.label}
          </Link>
        )
      })}
    </div>
  )
}

/** Theme toggle + Hire me — right column on md+ */
function DesktopNavTrailing({ items }: { items: ReadonlyArray<NavbarItem> }) {
  const { ctas } = useMemo(() => partitionNavItems(items), [items])

  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      <ThemeToggleDesktop />
      {ctas.length > 0 ? (
        <>
          <span className={dividerClass} aria-hidden />
          <div className="flex items-center gap-1.5">
            {ctas.map((item) => (
              <Button
                key={item.id}
                asChild
                variant="accent"
                size="sm"
                className={navCtaButtonClass}
              >
                <Link href={item.href}>{item.label}</Link>
              </Button>
            ))}
          </div>
        </>
      ) : null}
    </div>
  )
}

function ThemeToggleMobile() {
  const { theme, toggleTheme } = useTheme()
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.35 }}
      className="mt-3 flex items-center justify-between border-t border-[var(--glass-divider)] px-4 pt-4"
    >
      <span className="text-sm font-medium text-[var(--glass-text)]">
        {theme === 'dark' ? 'Dark mode' : 'Light mode'}
      </span>
      <Button
        variant="secondary"
        size="icon"
        type="button"
        onClick={toggleTheme}
        aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {theme === 'dark' ? <Sun className="size-5" /> : <Moon className="size-5" />}
      </Button>
    </motion.div>
  )
}

function ThemeToggleDesktop() {
  const { theme, toggleTheme } = useTheme()
  return (
    <Button
      variant="secondary"
      size="icon"
      type="button"
      onClick={toggleTheme}
      className="shrink-0"
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </Button>
  )
}

type MobileNavProps = {
  items: ReadonlyArray<NavbarItem>
  onNavigate: () => void
  locationHash: string
}

function MobileNav({ items, onNavigate, locationHash }: MobileNavProps) {
  const { links, ctas } = useMemo(() => partitionNavItems(items), [items])

  return (
    <div className="flex flex-col gap-1">
      {links.map((item, i) => {
        const active = hrefHashMatchesLocation(item.href, locationHash)
        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 + 0.05 }}
          >
            <Link
              href={item.href}
              className={cn(navLinkMobileClass, active && navLinkActiveClass)}
              onClick={onNavigate}
              aria-current={active ? 'page' : undefined}
            >
              {item.label}
            </Link>
          </motion.div>
        )
      })}

      <ThemeToggleMobile />

      {ctas.length > 0 && (
        <div className="mt-3 border-t border-[var(--glass-divider)] pt-4">
          {ctas.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: (links.length + i) * 0.1 + 0.05 }}
            >
              <Button
                asChild
                variant="accent"
                size="sm"
                className="w-full rounded-xl py-2.5 text-sm font-semibold leading-tight"
              >
                <Link href={item.href} onClick={onNavigate}>
                  {item.label}
                </Link>
              </Button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function NavBar({
  brandHref = portfolio.navbar.brandHref,
  brandName = portfolio.navbar.brandName,
  items = portfolio.navbar.items,
}: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { hash: locationHash } = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [menuOpen])

  return (
    <header className="sticky top-0 z-40 m-0 w-full bg-transparent pb-4 pt-8 sm:pb-5 sm:pt-10">
      <div className="flex w-full justify-center px-4">
        <motion.div
          initial={{ y: -12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
          className={cn(
            'flex items-center gap-3 py-3.5 pl-6 pr-5 sm:gap-5 sm:py-4 sm:pl-7 sm:pr-6 max-md:justify-between',
            'md:grid md:grid-cols-[auto_minmax(0,1fr)_auto] md:items-center md:gap-x-6 md:justify-normal',
            frostedPanelBase,
            scrolled && frostedPanelScrolled,
          )}
        >
          <motion.div
            initial={{ scale: 0.96 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.28, ease: [0.33, 1, 0.68, 1] }}
            whileHover={{ scale: 1.03 }}
            className="shrink-0 md:justify-self-start"
          >
            <Link href={brandHref} className={brandClass}>
              {brandName}
            </Link>
          </motion.div>

          <nav
            aria-label="Primary"
            className="hidden min-w-0 w-full md:flex md:justify-center md:justify-self-center md:px-2"
          >
            <DesktopNavLinks items={items} locationHash={locationHash} />
          </nav>

          <div className="flex shrink-0 items-center justify-end gap-2 md:justify-self-end">
            <div className="hidden md:flex md:items-center">
              <DesktopNavTrailing items={items} />
            </div>
            <motion.div className="flex md:hidden" whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="icon"
                type="button"
                aria-expanded={menuOpen}
                aria-controls="mobile-nav-overlay"
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                onClick={() => setMenuOpen((o) => !o)}
                className="rounded-lg text-[var(--glass-text-hover)] hover:bg-[var(--glass-bg)] hover:text-foreground"
              >
                <Menu className="size-6" />
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-nav-overlay"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            className="fixed inset-0 z-50 md:hidden"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
          >
            <div className="absolute inset-0 bg-white/80 backdrop-blur-xl dark:bg-black/70" aria-hidden />
            <div className="relative flex h-full flex-col pt-6">
              <motion.button
                type="button"
                className="absolute right-4 top-4 rounded-lg p-2 text-foreground hover:bg-[var(--glass-bg)]"
                onClick={() => setMenuOpen(false)}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.12 }}
                aria-label="Close menu"
              >
                <X className="h-7 w-7" />
              </motion.button>

              <nav className="flex flex-1 flex-col justify-center overflow-y-auto px-6 pb-12 pt-20">
                <MobileNav
                  items={items}
                  locationHash={locationHash}
                  onNavigate={() => setMenuOpen(false)}
                />
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
