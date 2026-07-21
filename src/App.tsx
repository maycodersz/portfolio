import { AppShell } from '@/components/AppShell'
import { AutomationSection } from '@/components/AutomationSection'
import { ContactSection } from '@/components/ContactSection'
import { HeroSplineSection } from '@/components/HeroSplineSection'
import {
  AccountingOpsTeaserSection,
  FaqSection,
  ProcessSection,
  SolutionsSection,
  WhereAutomationHelpsSection,
} from '@/components/LandingSections'
import { LoadingScreen } from '@/components/LoadingScreen'
import { RouteHashScroll } from '@/components/RouteHashScroll'
import { SkillsShowcase } from '@/components/SkillsShowcase'
import { SiteFooter } from '@/components/SiteFooter'
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
      <WhereAutomationHelpsSection />
      <SolutionsSection />
      <ProcessSection />
      <AccountingOpsTeaserSection />
      <div id="works">
        <AutomationSection />
      </div>
      <WorksSection />
      <FaqSection />
      <ContactSection />
      <SiteFooter />
    </AppShell>
  )
}

export default App
