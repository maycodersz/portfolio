import { useParams } from 'react-router-dom'

import { AppShell } from '@/components/AppShell'
import { Button } from '@/components/ui/button'
import Link from '@/components/ui/link'
import NavBar from '@/components/ui/navbar'
import { portfolio } from '@/content/portfolio'

export default function ProjectPage() {
  const { id } = useParams<{ id: string }>()
  const { projectDetailPage: pdp, projects } = portfolio
  const matched = id ? projects.find((p) => p.id === id) : undefined
  const displayTitle = matched?.title ?? (id?.trim() ? id : pdp.slugFallbackHeading)

  return (
    <AppShell>
      <NavBar />
      <div className="flex min-h-[calc(100dvh-var(--navbar-height))] flex-col items-center justify-center gap-8 px-[10%] pb-16 pt-12">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-foreground/75">{pdp.eyebrow}</p>
        <h1 className="text-center text-3xl font-bold tracking-[-0.02em] text-foreground">{displayTitle}</h1>
        <p className="max-w-md text-center text-muted-foreground" role="status">
          {pdp.caseStudyPendingMessage}
        </p>
        <Button variant="accent" size="sm" asChild className="mt-2">
          <Link href={pdp.backHref}>{pdp.backLabel}</Link>
        </Button>
      </div>
    </AppShell>
  )
}
