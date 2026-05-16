import { useParams } from 'react-router-dom'

import { AppShell } from '@/components/AppShell'
import {
  ProjectCaseStudyPair,
  ProjectCaseStudySingle,
} from '@/components/project/ProjectCaseStudy'
import { ProjectInfoSection } from '@/components/project/ProjectInfoSection'
import { ProjectScreenshotCarousel } from '@/components/project/ProjectScreenshotCarousel'
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

  const cs = matched.caseStudy
  const pageImages = matched.pageImages ?? []

  return (
    <AppShell>
      <NavBar />
      <article className="pb-20">
        {/* Screenshots carousel — hero visual at top */}
        <ProjectScreenshotCarousel
          images={pageImages}
          fallbackScreens={matched.screens}
          kind={matched.kind}
          projectTitle={matched.title}
        />

        {/* Project details (left) + Tech stack (right) */}
        <ProjectInfoSection project={matched} />

        {/* Problem (left) + Solution (right) */}
        {cs?.problem && cs?.solution ? (
          <ProjectCaseStudyPair
            left={{ title: pdp.problemHeading, body: cs.problem }}
            right={{ title: pdp.solutionHeading, body: cs.solution }}
          />
        ) : cs?.problem ? (
          <ProjectCaseStudySingle title={pdp.problemHeading} body={cs.problem} />
        ) : cs?.solution ? (
          <ProjectCaseStudySingle title={pdp.solutionHeading} body={cs.solution} />
        ) : null}

        {/* Results — full width */}
        {cs?.results ? (
          <ProjectCaseStudySingle title={pdp.resultsHeading} body={cs.results} />
        ) : null}

        <footer className="border-t border-border bg-background px-[10%] pt-14 pb-8">
          <div className="mx-auto max-w-3xl text-center">
            <Button variant="accent" size="sm" asChild className="rounded-xl">
              <Link href={pdp.backHref}>{pdp.backLabel}</Link>
            </Button>
          </div>
        </footer>
      </article>
    </AppShell>
  )
}
