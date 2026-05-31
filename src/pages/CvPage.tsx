import { useLayoutEffect } from 'react'
import { ArrowLeft } from 'lucide-react'

import { AppShell } from '@/components/AppShell'
import { CvAwardsSection } from '@/components/cv/CvAwardsSection'
import { CvCertificationsSection } from '@/components/cv/CvCertificationsSection'
import { CvEducationSection } from '@/components/cv/CvEducationSection'
import { CvExperienceSection } from '@/components/cv/CvExperienceSection'
import { CvProfileCard } from '@/components/cv/CvProfileCard'
import { CvProjectsSection } from '@/components/cv/CvProjectsSection'
import { CvSkillsSection } from '@/components/cv/CvSkillsSection'
import { CvSummarySection } from '@/components/cv/CvSummarySection'
import { Button } from '@/components/ui/button'
import Link from '@/components/ui/link'
import NavBar from '@/components/ui/navbar'
import { portfolio } from '@/content/portfolio'

export default function CvPage() {
  const { cv } = portfolio

  // Scroll to top on mount — prevents inheriting the scroll offset from the homepage
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [])

  return (
    <AppShell>
      <NavBar />
      <div className="relative">
        {/* Floating back button — same pattern as ProjectPage */}
        <div className="pointer-events-none fixed bottom-[max(1.25rem,calc(env(safe-area-inset-bottom,0px)+0.5rem))] left-1/2 z-30 max-w-[calc(100%-2rem)] -translate-x-1/2">
          <div className="pointer-events-auto">
            <Button
              variant="accentSecondary"
              size="sm"
              className="rounded-xl border border-border bg-background/90 shadow-md backdrop-blur-sm"
              asChild
            >
              <Link href={cv.backHref}>
                <span className="inline-flex items-center gap-2">
                  <ArrowLeft className="size-4 shrink-0 opacity-90" aria-hidden />
                  {cv.backLabel}
                </span>
              </Link>
            </Button>
          </div>
        </div>

        {/* ─── Mobile / Tablet: stacked scroll layout ─────────────── */}
        <div className="lg:hidden">
          <div className="px-[10%] pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] pt-8">
            <div className="mx-auto max-w-6xl space-y-10">
              <CvProfileCard />
              <CvSummarySection />
              <CvExperienceSection />
              <CvSkillsSection />
              <CvProjectsSection />
              <CvEducationSection />
              <CvCertificationsSection />
              <CvAwardsSection />
            </div>
          </div>
        </div>

        {/* ─── Desktop: Apple-style bento grid ────────────────────── */}
        {/*
          Grid layout (2 columns):
          ┌──────────────┬──────────────────────┐
          │  Profile     │  Summary + Contact   │
          │  Photo+Name  │                      │
          ├──────────────┴──────────────────────┤
          │        Technical Skills (full)       │
          ├──────────────┬──────────────────────┤
          │  Education   │  Experience          │
          │  (timeline)  │  (placeholder)       │
          ├──────────────┴──────────────────────┤
          │        Projects (full, 2-col grid)   │
          ├──────────────┬──────────────────────┤
          │  Certs       │  Awards              │
          └──────────────┴──────────────────────┘
        */}
        <div className="hidden lg:block">
          <div className="px-[10%] pb-24 pt-10">
            <div className="mx-auto max-w-6xl">
              <div
                className="grid gap-5"
                style={{
                  gridTemplateColumns: '5fr 7fr',
                  gridTemplateRows: 'auto',
                }}
              >
                {/* Row 1: Profile | Summary */}
                <div>
                  <CvProfileCard />
                </div>
                <div>
                  <CvSummarySection stretch />
                </div>

                {/* Row 2: Skills (full width) */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <CvSkillsSection />
                </div>

                {/* Row 3: Education | Experience */}
                <div>
                  <CvEducationSection stretch />
                </div>
                <div>
                  <CvExperienceSection stretch />
                </div>

                {/* Row 4: Projects (full width) */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <CvProjectsSection />
                </div>

                {/* Row 5: Certifications | Awards */}
                <div>
                  <CvCertificationsSection stretch />
                </div>
                <div>
                  <CvAwardsSection stretch />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
