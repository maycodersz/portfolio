export type Attribution = {
  source: string
  campaign: string
}

const SESSION_KEY = 'portfolio_attribution'
const KEYS = ['src', 'utm_source', 'utm_medium', 'campaign', 'utm_campaign', 'lead'] as const

function clean(value: string | null): string {
  return (value ?? '').trim().slice(0, 256)
}

export function captureAttribution(): Attribution {
  const url = new URL(window.location.href)
  const params = url.searchParams
  const captured: Attribution = {
    source: clean(params.get('utm_source') ?? params.get('src')),
    campaign: clean(params.get('utm_campaign') ?? params.get('campaign')),
  }

  const hasCaptured = Object.values(captured).some(Boolean)
  if (hasCaptured) sessionStorage.setItem(SESSION_KEY, JSON.stringify(captured))
  KEYS.forEach((key) => params.delete(key))
  if (url.href !== window.location.href) window.history.replaceState(window.history.state, '', url)

  if (hasCaptured) return captured
  try {
    return JSON.parse(sessionStorage.getItem(SESSION_KEY) ?? '') as Attribution
  } catch {
    return { source: '', campaign: '' }
  }
}
