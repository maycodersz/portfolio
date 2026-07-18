import { createClient } from '@supabase/supabase-js'

import { hasSupabaseConfig, publicEnv } from '@/config/publicEnv'

export const supabase = hasSupabaseConfig
  ? createClient(publicEnv.supabaseUrl, publicEnv.supabasePublishableKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false },
      realtime: { params: { eventsPerSecond: 2 } },
    })
  : null
