import { z } from 'zod'

const schema = z.object({
  GOOGLE_SHEETS_SPREADSHEET_ID: z.string().regex(/^[a-zA-Z0-9_-]{20,}$/),
  GOOGLE_SERVICE_ACCOUNT_EMAIL: z.string().email(),
  GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY: z.string().min(100),
  IP_HASH_SALT: z.string().min(32),
  UPSTASH_REDIS_REST_URL: z.string().url(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(16),
  ANALYTICS_ALLOWED_ORIGINS: z.string().min(1),
  GOOGLE_SHEETS_REQUEST_TIMEOUT_MS: z.coerce.number().int().min(500).max(10_000).default(4000),
  ANALYTICS_RETENTION_DAYS: z.coerce.number().int().min(1).max(365).default(90),
})

export type AnalyticsEnv = z.infer<typeof schema> & { allowedOrigins: Set<string> }

export function analyticsEnv(): AnalyticsEnv {
  const parsed = schema.parse(process.env)
  return {
    ...parsed,
    allowedOrigins: new Set(
      parsed.ANALYTICS_ALLOWED_ORIGINS.split(',').map((value) => new URL(value.trim()).origin),
    ),
  }
}
