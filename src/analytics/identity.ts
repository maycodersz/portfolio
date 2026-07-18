const VISITOR_KEY = 'portfolio_visitor_id'
const SESSION_KEY = 'portfolio_session_id'

function storedUuid(storage: Storage, key: string): string {
  const current = storage.getItem(key)
  if (current) return current
  const value = crypto.randomUUID()
  storage.setItem(key, value)
  return value
}

export function getVisitorId(): string {
  return storedUuid(window.localStorage, VISITOR_KEY)
}

export function getSessionId(): string {
  return storedUuid(window.sessionStorage, SESSION_KEY)
}
