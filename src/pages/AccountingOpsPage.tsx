import { useEffect, useLayoutEffect } from 'react'

import { AccountingOpsCaseStudy } from '@/components/AccountingOpsCaseStudy'
import { AppShell } from '@/components/AppShell'
import NavBar from '@/components/ui/navbar'

export default function AccountingOpsPage() {
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [])

  useEffect(() => {
    const previousTitle = document.title
    document.title = 'AccountingOps Automation System | Maycoder'
    return () => {
      document.title = previousTitle
    }
  }, [])

  return (
    <AppShell>
      <NavBar />
      <AccountingOpsCaseStudy />
    </AppShell>
  )
}
