import { useParams } from 'react-router-dom'

import { AppShell } from '@/components/AppShell'
import NavBar from '@/components/ui/navbar'
import { portfolio } from '@/content/portfolio'

export default function ProjectPage() {
  const { id } = useParams<{ id: string }>()
  const { projectDetailPage: pdp } = portfolio
  const displayTitle = id?.trim() ? id : pdp.slugFallbackHeading

  return (
    <AppShell>
      <NavBar />
      <div className="flex min-h-[calc(100dvh-var(--navbar-height))] flex-col items-center justify-center px-[10%]">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-foreground/75">{pdp.eyebrow}</p>
        <h1 className="mt-3 text-3xl font-bold tracking-[-0.02em] text-foreground">{displayTitle}</h1>
        <p className="mt-4 text-muted-foreground" role="status">
          {pdp.caseStudyPendingMessage}
        </p>
      </div>
    </AppShell>
  )
}
