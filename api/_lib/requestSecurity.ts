import { createHmac } from 'node:crypto'

import { geolocation, ipAddress } from '@vercel/functions'

import type { AnalyticsEnv } from './env.js'

export const MAX_BODY_BYTES = 12 * 1024

export function jsonResponse(body: object, status: number): Response {
  return Response.json(body, {
    status,
    headers: { 'cache-control': 'no-store', 'content-type': 'application/json' },
  })
}

export function validateRequestHeaders(request: Request, env: AnalyticsEnv): Response | null {
  if (request.method !== 'POST') return jsonResponse({ accepted: false, reason: 'method' }, 405)
  if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) {
    return jsonResponse({ accepted: false, reason: 'content-type' }, 415)
  }
  const length = Number(request.headers.get('content-length') ?? '0')
  if (Number.isFinite(length) && length > MAX_BODY_BYTES) {
    return jsonResponse({ accepted: false, reason: 'body-size' }, 413)
  }
  const origin = request.headers.get('origin')
  const requestOrigin = new URL(request.url).origin
  const permitted = new Set([requestOrigin, ...env.allowedOrigins])
  if (!origin || !permitted.has(origin)) return jsonResponse({ accepted: false, reason: 'origin' }, 403)
  const fetchSite = request.headers.get('sec-fetch-site')
  if (fetchSite && fetchSite !== 'same-origin' && fetchSite !== 'same-site') {
    return jsonResponse({ accepted: false, reason: 'fetch-site' }, 403)
  }
  return null
}

export async function readJson(request: Request): Promise<unknown> {
  const text = await request.text()
  if (new TextEncoder().encode(text).byteLength > MAX_BODY_BYTES) throw new Error('body-size')
  return JSON.parse(text) as unknown
}

export function requestEnrichment(request: Request, env: AnalyticsEnv) {
  const rawIp = (ipAddress(request) ?? '').trim().toLowerCase()
  const ipHash = createHmac('sha256', env.IP_HASH_SALT)
    .update(rawIp || 'unavailable')
    .digest('hex')
  const geo = geolocation(request)
  return {
    ipHash,
    city: (geo.city ?? '').slice(0, 120),
    region: (geo.countryRegion ?? '').slice(0, 120),
    country: (geo.country ?? '').slice(0, 2),
  }
}

export function formulaEscape(value: unknown): unknown {
  if (typeof value === 'string') return /^[\s]*[=+\-@]/.test(value) ? `'${value}` : value
  if (Array.isArray(value)) return value.map(formulaEscape)
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, formulaEscape(item)]))
  }
  return value
}
