import { describe, expect, it } from 'vitest'

import {
  eventRow,
  SHEETS_APPEND_INSERT_DATA_OPTION,
  visitorRow,
  type AnalyticsEnvelope,
} from '../api/_lib/googleSheets.js'

const visit: AnalyticsEnvelope = {
  type: 'visit',
  schemaVersion: 1,
  eventId: 'a3a6d43a-30ee-4c3d-8877-351f9ef08ff0',
  occurredAt: '2026-07-18T12:00:00.000Z',
  visitorId: '42b72caf-4c70-490a-b28c-cf815892415e',
  sessionId: '424c73e5-8d1b-4c86-8a36-c32f97b3cc37',
  pathname: '/',
  screenCategory: 'desktop',
  language: 'en-US',
  timezone: 'Asia/Manila',
  source: 'google',
  campaign: '',
  city: 'Manila',
  region: 'Metro Manila',
  country: 'PH',
  botFlag: false,
}

describe('Google Sheets row mapping', () => {
  it('appends without inserting grid rows that shift Dashboard formulas', () => {
    expect(SHEETS_APPEND_INSERT_DATA_OPTION).toBe('OVERWRITE')
  })

  it('maps an event to the minimal 17-column contract', () => {
    const row = eventRow(visit)
    expect(row).toHaveLength(17)
    expect(row[0]).toBe('2026-07-18 20:00:00')
    expect(row[15]).toBe(false)
    expect(row[16]).toBe(visit.eventId)
  })

  it('reconciles the 15-column visitor summary from Events', () => {
    const click: AnalyticsEnvelope = {
      ...visit,
      type: 'event',
      eventId: 'f95bb2bd-c899-478d-ad66-f828cee1ac88',
      occurredAt: '2026-07-18T12:05:00.000Z',
      eventName: 'hero_cta_click',
      clickLabel: 'View Work',
    }
    const summary = visitorRow([eventRow(click), eventRow(visit)], visit.visitorId)

    expect(summary).toHaveLength(15)
    expect(summary?.slice(0, 6)).toEqual([
      visit.visitorId,
      '2026-07-18 20:00:00',
      '2026-07-18 20:05:00',
      1,
      1,
      1,
    ])
    expect(summary?.[13]).toBe('hero_cta_click')
    expect(summary?.[14]).toBe('desktop')
  })
})
