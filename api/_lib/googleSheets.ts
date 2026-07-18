import { JWT } from 'google-auth-library'

import type { AnalyticsEnv } from './env.js'
import type { ValidatedPayload } from './schema.js'

const SHEETS_SCOPE = 'https://www.googleapis.com/auth/spreadsheets'
const API_ROOT = 'https://sheets.googleapis.com/v4/spreadsheets'
const EVENTS_RANGE = 'Events!A2:Q100000'
const VISITORS_RANGE = 'Visitors!A2:O100000'
const EVENT_ID_INDEX = 16
export const SHEETS_APPEND_INSERT_DATA_OPTION = 'OVERWRITE' as const

type ServerFields = {
  city: string
  region: string
  country: string
  botFlag: boolean
}

export type AnalyticsEnvelope = ValidatedPayload & ServerFields
type Cell = string | number | boolean

function privateKey(value: string): string {
  return value.replace(/^['"]|['"]$/g, '').replace(/\\n/g, '\n')
}

function manilaTimestamp(iso: string): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Manila',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date(iso))
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((item) => item.type === type)?.value ?? ''
  return `${part('year')}-${part('month')}-${part('day')} ${part('hour')}:${part('minute')}:${part('second')}`
}

export function eventRow(envelope: AnalyticsEnvelope): Cell[] {
  const isEvent = envelope.type === 'event'
  return [
    manilaTimestamp(envelope.occurredAt),
    envelope.visitorId,
    envelope.sessionId,
    envelope.type,
    envelope.pathname,
    isEvent ? envelope.eventName : '',
    isEvent ? envelope.clickLabel : '',
    envelope.language,
    envelope.timezone,
    envelope.city,
    envelope.region,
    envelope.country,
    envelope.source,
    envelope.campaign,
    envelope.screenCategory,
    envelope.botFlag,
    envelope.eventId,
  ]
}

function cell(row: Cell[], index: number): string {
  return String(row[index] ?? '')
}

export function visitorRow(rows: Cell[][], visitorId: string): Cell[] | null {
  const matching = rows
    .filter((row) => cell(row, 1) === visitorId)
    .sort((left, right) => cell(left, 0).localeCompare(cell(right, 0)))
  if (!matching.length) return null

  const first = matching[0]
  const latest = matching[matching.length - 1]
  const firstWith = (index: number) => matching.find((row) => cell(row, index))?.[index] ?? ''
  const latestWith = (index: number) => [...matching].reverse().find((row) => cell(row, index))?.[index] ?? ''
  const latestEventName = cell(latest, 3) === 'event' ? cell(latest, 5) : 'page_view'

  return [
    visitorId,
    cell(first, 0),
    cell(latest, 0),
    new Set(matching.map((row) => cell(row, 2))).size,
    matching.filter((row) => cell(row, 3) === 'visit').length,
    matching.filter((row) => cell(row, 3) === 'event').length,
    latestWith(7),
    latestWith(8),
    latestWith(9),
    latestWith(11),
    firstWith(12),
    latestWith(12),
    cell(latest, 4),
    latestEventName,
    latestWith(14),
  ]
}

async function accessToken(env: AnalyticsEnv): Promise<string | null> {
  const auth = new JWT({
    email: env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: privateKey(env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY),
    scopes: [SHEETS_SCOPE],
  })
  const result = await auth.getAccessToken()
  return result.token ?? null
}

async function request(
  env: AnalyticsEnv,
  token: string,
  path: string,
  init?: RequestInit,
): Promise<Response> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), env.GOOGLE_SHEETS_REQUEST_TIMEOUT_MS)
  try {
    return await fetch(`${API_ROOT}/${env.GOOGLE_SHEETS_SPREADSHEET_ID}/${path}`, {
      ...init,
      headers: {
        authorization: `Bearer ${token}`,
        'content-type': 'application/json',
        ...init?.headers,
      },
      signal: controller.signal,
    })
  } finally {
    clearTimeout(timer)
  }
}

async function getRows(env: AnalyticsEnv, token: string, range: string): Promise<Cell[][]> {
  const response = await request(env, token, `values/${encodeURIComponent(range)}?majorDimension=ROWS`)
  if (!response.ok) throw new Error('sheets-read')
  const body = await response.json() as { values?: Cell[][] }
  return body.values ?? []
}

async function appendRow(env: AnalyticsEnv, token: string, range: string, row: Cell[]): Promise<boolean> {
  const response = await request(
    env,
    token,
    `values/${encodeURIComponent(range)}:append?valueInputOption=RAW&insertDataOption=${SHEETS_APPEND_INSERT_DATA_OPTION}`,
    { method: 'POST', body: JSON.stringify({ majorDimension: 'ROWS', values: [row] }) },
  )
  return response.ok
}

async function updateRow(env: AnalyticsEnv, token: string, range: string, row: Cell[]): Promise<boolean> {
  const response = await request(
    env,
    token,
    `values/${encodeURIComponent(range)}?valueInputOption=RAW`,
    { method: 'PUT', body: JSON.stringify({ majorDimension: 'ROWS', values: [row] }) },
  )
  return response.ok
}

async function ensureEvent(env: AnalyticsEnv, token: string, envelope: AnalyticsEnvelope): Promise<Cell[][]> {
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const rows = await getRows(env, token, EVENTS_RANGE)
    if (rows.some((row) => cell(row, EVENT_ID_INDEX) === envelope.eventId)) return rows
    try {
      if (await appendRow(env, token, 'Events!A:Q', eventRow(envelope))) {
        return await getRows(env, token, EVENTS_RANGE)
      }
    } catch {
      // Re-read Event IDs before the only retry so an ambiguous append cannot duplicate a row.
    }
  }
  const rows = await getRows(env, token, EVENTS_RANGE)
  if (rows.some((row) => cell(row, EVENT_ID_INDEX) === envelope.eventId)) return rows
  throw new Error('sheets-append')
}

async function reconcileVisitor(
  env: AnalyticsEnv,
  token: string,
  events: Cell[][],
  visitorId: string,
): Promise<boolean> {
  const summary = visitorRow(events, visitorId)
  if (!summary) return false

  for (let attempt = 0; attempt < 2; attempt += 1) {
    const visitors = await getRows(env, token, VISITORS_RANGE)
    const index = visitors.findIndex((row) => cell(row, 0) === visitorId)
    try {
      if (index >= 0) {
        if (await updateRow(env, token, `Visitors!A${index + 2}:O${index + 2}`, summary)) return true
      } else if (await appendRow(env, token, 'Visitors!A:O', summary)) {
        return true
      }
    } catch {
      // Updating is idempotent; appending is retried only after checking the visitor column again.
    }
  }
  return false
}

export async function writeAnalyticsToGoogleSheets(
  env: AnalyticsEnv,
  envelope: AnalyticsEnvelope,
): Promise<boolean> {
  try {
    const token = await accessToken(env)
    if (!token) return false
    const events = await ensureEvent(env, token, envelope)
    return await reconcileVisitor(env, token, events, envelope.visitorId)
  } catch {
    return false
  }
}
