import Link from '@/components/ui/link'
import { portfolio } from '@/content/portfolio'

const footerLinks = [
  { label: 'Solutions', href: '/#solutions' },
  { label: 'Process', href: '/#process' },
  { label: 'Work', href: '/#works' },
  { label: 'FAQ', href: '/#faq' },
] as const

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background px-[10%] py-10 sm:py-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <Link href={portfolio.navbar.brandHref} className="text-gradient-brand inline-block px-px py-px text-2xl font-extrabold tracking-[-0.04em]">
              {portfolio.navbar.brandName}
            </Link>
            <p className="mt-4 text-sm leading-6 text-muted-foreground sm:text-base">
              AI automation systems for service businesses, built with n8n, AI, APIs, and practical human review.
            </p>
          </div>
          <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-3">
            {footerLinks.map((item) => (
              <Link key={item.label} href={item.href} className="min-h-11 py-3 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-10 flex flex-col justify-between gap-4 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Maycoder. All rights reserved.</p>
          <Link href="/privacy" className="min-h-11 py-3 font-semibold underline underline-offset-4 transition-colors hover:text-foreground">
            Privacy and analytics
          </Link>
        </div>
      </div>
    </footer>
  )
}
