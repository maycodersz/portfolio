const env = import.meta.env

export const publicEnv = {
  supabaseUrl: env.VITE_SUPABASE_URL?.trim() ?? '',
  supabasePublishableKey: env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim() ?? '',
  turnstileSiteKey: env.VITE_TURNSTILE_SITE_KEY?.trim() ?? '',
  analyticsEnabled: env.VITE_ANALYTICS_ENABLED === 'true',
} as const

export const hasSupabaseConfig = Boolean(
  publicEnv.supabaseUrl && publicEnv.supabasePublishableKey,
)
