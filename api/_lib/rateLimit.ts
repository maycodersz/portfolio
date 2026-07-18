import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

import type { AnalyticsEnv } from './env.js'

export function redisClient(env: AnalyticsEnv): Redis {
  return new Redis({ url: env.UPSTASH_REDIS_REST_URL, token: env.UPSTASH_REDIS_REST_TOKEN })
}

export async function checkLimits(
  redis: Redis,
  kind: 'visit' | 'event',
  ipHash: string,
): Promise<boolean> {
  const minuteLimit = kind === 'visit' ? 10 : 30
  const dailyLimit = kind === 'visit' ? 500 : 1500
  const minute = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(minuteLimit, '1 m'),
    prefix: `portfolio:${kind}:minute`,
  })
  const daily = new Ratelimit({
    redis,
    limiter: Ratelimit.fixedWindow(dailyLimit, '1 d'),
    prefix: `portfolio:${kind}:daily`,
  })
  const [minuteResult, dailyResult] = await Promise.all([
    minute.limit(ipHash),
    daily.limit(ipHash),
  ])
  return minuteResult.success && dailyResult.success
}

export async function reserveEvent(redis: Redis, eventId: string, retentionDays: number): Promise<boolean> {
  const result = await redis.set(`portfolio:event:${eventId}`, 'processing', {
    nx: true,
    ex: Math.min(retentionDays * 86_400, 300),
  })
  return result === 'OK'
}

export async function markEventAccepted(redis: Redis, eventId: string, retentionDays: number): Promise<void> {
  await redis.set(`portfolio:event:${eventId}`, 'accepted', { ex: retentionDays * 86_400 })
}
