export type ScreenCategory = 'mobile' | 'tablet' | 'desktop'

export type AnalyticsCommon = {
  schemaVersion: 1
  eventId: string
  occurredAt: string
  visitorId: string
  sessionId: string
  pathname: string
  screenCategory: ScreenCategory
  language: string
  timezone: string
  source: string
  campaign: string
}

export type VisitPayload = AnalyticsCommon & { type: 'visit' }
export type ClickPayload = AnalyticsCommon & {
  type: 'event'
  eventName: string
  clickLabel: string
}

export type AnalyticsPayload = VisitPayload | ClickPayload
