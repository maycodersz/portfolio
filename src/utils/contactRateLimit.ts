import type { ContactFormRateLimitConfig } from '@/content/portfolio'

const STORAGE_KEY = 'maycoder-contact-submissions'
const HOUR_MS = 60 * 60 * 1000

type StoredSubmissions = {
  timestamps: number[]
}

export type ContactRateLimitResult =
  | { allowed: true }
  | { allowed: false; retryAfterMs: number }

function readStored(): StoredSubmissions | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { timestamps: [] }
    const parsed = JSON.parse(raw) as unknown
    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      'timestamps' in parsed &&
      Array.isArray((parsed as StoredSubmissions).timestamps)
    ) {
      return {
        timestamps: (parsed as StoredSubmissions).timestamps.filter(
          (t): t is number => typeof t === 'number' && Number.isFinite(t),
        ),
      }
    }
    return { timestamps: [] }
  } catch {
    return null
  }
}

function writeStored(data: StoredSubmissions): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    /* fail open — storage unavailable */
  }
}

function pruneTimestamps(timestamps: number[], now: number): number[] {
  return timestamps.filter((t) => now - t < HOUR_MS)
}

export function checkContactRateLimit(
  config: ContactFormRateLimitConfig,
): ContactRateLimitResult {
  const stored = readStored()
  if (stored === null) return { allowed: true }

  const now = Date.now()
  const timestamps = pruneTimestamps(stored.timestamps, now)
  const minIntervalMs = config.minIntervalSeconds * 1000

  if (timestamps.length >= config.maxSubmissionsPerHour) {
    const oldest = timestamps[0]
    const retryAfterMs = HOUR_MS - (now - oldest)
    return {
      allowed: false,
      retryAfterMs: Math.max(retryAfterMs, 1),
    }
  }

  const last = timestamps[timestamps.length - 1]
  if (last !== undefined && now - last < minIntervalMs) {
    return {
      allowed: false,
      retryAfterMs: minIntervalMs - (now - last),
    }
  }

  return { allowed: true }
}

export function recordContactSubmission(): void {
  const stored = readStored()
  if (stored === null) return

  const now = Date.now()
  const timestamps = [...pruneTimestamps(stored.timestamps, now), now]
  writeStored({ timestamps })
}

export function formatRateLimitedMessage(
  template: string,
  retryAfterMs: number,
): string {
  const seconds = Math.ceil(retryAfterMs / 1000)
  return template.replace('{seconds}', String(seconds))
}
