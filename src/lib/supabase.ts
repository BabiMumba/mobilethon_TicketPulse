import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// Supabase is configured entirely through Vite env vars. When they are absent
// (e.g. local hackathon dev, or before you run `supabase` setup) the app
// transparently falls back to a fully-featured mock backend, so nothing breaks.
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const isSupabaseConfigured = Boolean(url && anonKey)

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url as string, anonKey as string, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null

if (!isSupabaseConfigured) {
  console.info(
    '[TicketPulse] Supabase env not set — running with the in-memory mock backend. ' +
      'Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to connect a real project.',
  )
}
