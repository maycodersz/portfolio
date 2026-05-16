import { ArrowLeft } from 'lucide-react'
import { useParams } from 'react-router-dom'

import { AppShell } from '@/components/AppShell'
import { ProjectBentoGrid } from '@/components/project/ProjectBentoGrid'
import { ScrollDeviceShowcase } from '@/components/project/ScrollDeviceShowcase'
import { Button } from '@/components/ui/button'
import Link from '@/components/ui/link'
import NavBar from '@/components/ui/navbar'
import { portfolio } from '@/content/portfolio'

export default function ProjectPage() {
  const { id } = useParams<{ id: string }>()
  const pdp = portfolio.projectDetailPage
  const matched = id ? portfolio.projects.find((p) => p.id === id) : undefined

  if (!matched) {
    return (
      <AppShell>
        <NavBar />
        <div className="flex min-h-[calc(100dvh-var(--navbar-height))] flex-col items-center justify-center gap-6 px-[10%] pb-16 pt-12 text-center">
          <h1 className="text-2xl font-bold text-foreground">{pdp.notFoundHeading}</h1>
          <p className="max-w-md text-muted-foreground">{pdp.notFoundMessage}</p>
          <Button variant="accent" size="sm" asChild className="rounded-xl">
            <Link href={pdp.backHref}>{pdp.backLabel}</Link>
          </Button>
        </div>
      </AppShell>
    )
  }

  const pageImages = matched.pageImages ?? []

  return (
    <AppShell>
      <NavBar />
      <div className="relative">
        {/* Fixed bottom-center on all viewport sizes */}
        <div
          className="pointer-events-none fixed z-30 max-w-[calc(100%-2rem)] bottom-[max(1.25rem,calc(env(safe-area-inset-bottom,0px)+0.5rem))] left-1/2 -translate-x-1/2"
        >
          <div className="pointer-events-auto">
            <Button variant="accentSecondary" size="sm" className="rounded-xl border border-border bg-background/90 shadow-md backdrop-blur-sm" asChild>
              <Link href={pdp.backHref}>
                <span className="inline-flex items-center gap-2">
                  <ArrowLeft className="size-4 shrink-0 opacity-90" aria-hidden />
                  {pdp.backLabel}
                </span>
              </Link>
            </Button>
          </div>
        </div>

        <article className="pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] md:pb-20">
          <ScrollDeviceShowcase
            key={matched.id}
            images={pageImages}
            fallbackScreens={matched.screens}
            kind={matched.kind}
            projectTitle={matched.title}
          />

          <ProjectBentoGrid project={matched} />
        </article>
      </div>
    </AppShell>
  )
}
