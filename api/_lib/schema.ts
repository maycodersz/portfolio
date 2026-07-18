import { z } from 'zod'

const short = z.string().max(160)
const common = {
  schemaVersion: z.literal(1),
  eventId: z.string().uuid(),
  occurredAt: z.string().datetime({ offset: true }),
  visitorId: z.string().uuid(),
  sessionId: z.string().uuid(),
  pathname: z.string().startsWith('/').max(512),
  screenCategory: z.enum(['mobile', 'tablet', 'desktop']),
  language: z.string().max(24),
  timezone: z.string().max(64),
  source: z.string().max(256),
  campaign: z.string().max(256),
}

export const visitSchema = z.strictObject({ type: z.literal('visit'), ...common })
export const eventSchema = z.strictObject({
  type: z.literal('event'),
  ...common,
  eventName: z.string().min(1).max(80),
  clickLabel: short,
})

export const analyticsPayloadSchema = z.discriminatedUnion('type', [visitSchema, eventSchema])

export type ValidatedVisit = z.infer<typeof visitSchema>
export type ValidatedEvent = z.infer<typeof eventSchema>
export type ValidatedPayload = ValidatedVisit | ValidatedEvent
