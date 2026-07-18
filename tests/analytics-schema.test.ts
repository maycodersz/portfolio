import { describe, expect, it } from 'vitest'

import { formulaEscape } from '../api/_lib/requestSecurity.js'
import { eventSchema, visitSchema } from '../api/_lib/schema.js'

const common = {
  schemaVersion: 1,
  eventId: 'a3a6d43a-30ee-4c3d-8877-351f9ef08ff0',
  occurredAt: '2026-07-18T12:00:00.000Z',
  visitorId: '42b72caf-4c70-490a-b28c-cf815892415e',
  sessionId: '424c73e5-8d1b-4c86-8a36-c32f97b3cc37',
  pathname: '/',
  screenCategory: 'desktop',
  language: 'en-US',
  timezone: 'Asia/Manila',
  source: '',
  campaign: '',
} as const

describe('analytics contract', () => {
  it('accepts a strict visit and rejects browser-provided location', () => {
    expect(visitSchema.safeParse({ type: 'visit', ...common }).success).toBe(true)
    expect(visitSchema.safeParse({ type: 'visit', ...common, city: 'spoofed' }).success).toBe(false)
  })

  it('validates the click discriminant', () => {
    expect(eventSchema.safeParse({
      type: 'event',
      ...common,
      eventName: 'hero_cta_click',
      clickLabel: 'View Work',
    }).success).toBe(true)
    expect(eventSchema.safeParse({
      type: 'event',
      ...common,
      eventName: 'hero_cta_click',
      clickLabel: 'View Work',
      userAgent: 'must-not-be-collected',
    }).success).toBe(false)
  })

  it('neutralizes spreadsheet formulas recursively', () => {
    expect(formulaEscape({ label: '  =IMPORTXML("x")', safe: 'hello' })).toEqual({
      label: '\'  =IMPORTXML("x")',
      safe: 'hello',
    })
  })
})
