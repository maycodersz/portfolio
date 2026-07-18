import { isbot } from 'isbot'
import type { z } from 'zod'

import { analyticsEnv } from './env.js'
import { writeAnalyticsToGoogleSheets, type AnalyticsEnvelope } from './googleSheets.js'
import { checkLimits, markEventAccepted, redisClient, reserveEvent } from './rateLimit.js'
import { formulaEscape, jsonResponse, readJson, requestEnrichment, validateRequestHeaders } from './requestSecurity.js'
import type { eventSchema, visitSchema } from './schema.js'

type PayloadSchema = typeof visitSchema | typeof eventSchema

export async function ingest(request: Request, schema: PayloadSchema, kind: 'visit' | 'event'): Promise<Response> {
  let env
  try {
    env = analyticsEnv()
  } catch {
    console.error('analytics_ingest_unavailable', { stage: 'environment', kind })
    return jsonResponse({ accepted: false, reason: 'unavailable' }, 503)
  }
  const headerError = validateRequestHeaders(request, env)
  if (headerError) return headerError

  let payload: z.infer<PayloadSchema>
  try {
    payload = schema.parse(await readJson(request))
  } catch (error) {
    const reason = error instanceof Error && error.message === 'body-size' ? 'body-size' : 'validation'
    return jsonResponse({ accepted: false, reason }, reason === 'body-size' ? 413 : 400)
  }

  const trusted = requestEnrichment(request, env)
  const redis = redisClient(env)
  try {
    if (!(await checkLimits(redis, kind, trusted.ipHash))) {
      return jsonResponse({ accepted: false, reason: 'rate-limit' }, 429)
    }
    if (!(await reserveEvent(redis, payload.eventId, env.ANALYTICS_RETENTION_DAYS))) {
      return jsonResponse({ accepted: true, duplicate: true }, 202)
    }
  } catch {
    console.error('analytics_ingest_unavailable', { stage: 'rate-limit', kind })
    return jsonResponse({ accepted: false, reason: 'unavailable' }, 503)
  }

  const userAgent = request.headers.get('user-agent')?.slice(0, 512) ?? ''
  const envelope = formulaEscape({
    ...payload,
    city: trusted.city,
    region: trusted.region,
    country: trusted.country,
    botFlag: isbot(userAgent),
  }) as AnalyticsEnvelope

  if (!(await writeAnalyticsToGoogleSheets(env, envelope))) {
    console.error('analytics_ingest_unavailable', { stage: 'google-sheets', kind })
    await redis.del(`portfolio:event:${payload.eventId}`).catch(() => undefined)
    return jsonResponse({ accepted: false, reason: 'unavailable' }, 503)
  }
  await markEventAccepted(redis, payload.eventId, env.ANALYTICS_RETENTION_DAYS).catch(() => undefined)
  return jsonResponse({ accepted: true }, 202)
}
