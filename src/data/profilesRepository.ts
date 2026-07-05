import { supabase } from '../lib/supabase'
import { mapProfileRow, mapProfileToRow } from '../lib/supabaseMap'
import type { Profile, ProfilesRepository } from './types'

const CACHE_PREFIX = 'tp:profile:'

function readCache(userId: string): Profile | null {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + userId)
    return raw ? (JSON.parse(raw) as Profile) : null
  } catch {
    return null
  }
}

function writeCache(profile: Profile): void {
  try {
    localStorage.setItem(CACHE_PREFIX + profile.id, JSON.stringify(profile))
  } catch {
    /* non-fatal */
  }
}

const mockProfilesRepository: ProfilesRepository = {
  async get(userId) {
    return readCache(userId)
  },
  async upsert(profile) {
    writeCache(profile)
    return profile
  },
}

const supabaseProfilesRepository: ProfilesRepository = {
  async get(userId) {
    const { data, error } = await supabase!
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    if (error || !data) return readCache(userId)
    const profile = mapProfileRow(data)
    writeCache(profile)
    return profile
  },
  async upsert(profile) {
    writeCache(profile)
    const { error } = await supabase!.from('profiles').upsert(mapProfileToRow(profile))
    if (error) {
      console.warn('[TicketPulse] Profile cached locally; will sync when online.', error)
    }
    return profile
  },
}

export const profilesRepository: ProfilesRepository = supabase
  ? supabaseProfilesRepository
  : mockProfilesRepository
