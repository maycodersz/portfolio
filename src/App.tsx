import { AppShell } from '@/components/AppShell'
import { AutomationSection } from '@/components/AutomationSection'
import { ContactSection } from '@/components/ContactSection'
import { HeroSplineSection } from '@/components/HeroSplineSection'
import { LoadingScreen } from '@/components/LoadingScreen'
import { PricingSection } from '@/components/PricingSection'
import { SkillsShowcase } from '@/components/SkillsShowcase'
import { StatsSection } from '@/components/StatsSection'
import { WorksSection } from '@/components/WorksSection'
import NavBar from '@/components/ui/navbar'
import { WorksPaperPlaneSuppressor } from '@/contexts/SiteCursorContext'

function App() {
  return (
    <AppShell>
      <LoadingScreen />
      <NavBar />
      <div id="hero">
        <HeroSplineSection />
      </div>
      <SkillsShowcase />
      <StatsSection />
      <WorksPaperPlaneSuppressor id="works">
        <WorksSection />
      </WorksPaperPlaneSuppressor>
      <AutomationSection />
      <PricingSection />
      <ContactSection />
    </AppShell>
  )
}

export default App
