import { AppShell } from '@/components/AppShell'
import { AutomationSection } from '@/components/AutomationSection'
import { ContactSection } from '@/components/ContactSection'
import { HeroSplineSection } from '@/components/HeroSplineSection'
import { LoadingScreen } from '@/components/LoadingScreen'
import { PricingSection } from '@/components/PricingSection'
import { RouteHashScroll } from '@/components/RouteHashScroll'
import { SkillsShowcase } from '@/components/SkillsShowcase'
import { StatsSection } from '@/components/StatsSection'
import { WorksSection } from '@/components/WorksSection'
import NavBar from '@/components/ui/navbar'

function App() {
  return (
    <AppShell>
      <RouteHashScroll />
      <LoadingScreen />
      <NavBar />
      <div id="hero">
        <HeroSplineSection />
      </div>
      <SkillsShowcase />
      <StatsSection />
      <div id="works" className="scroll-mt-[var(--navbar-height)]">
        <WorksSection />
      </div>
      <AutomationSection />
      <PricingSection />
      <ContactSection />
    </AppShell>
  )
}

export default App
