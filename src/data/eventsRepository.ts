import { supabase } from '../lib/supabase'
import type { EventFilters, EventItem, EventsRepository } from './types'
import { SEED_EVENTS } from './seed'

// Small artificial latency so skeleton loading states are exercised in dev.
const delay = (ms = 350) => new Promise((r) => setTimeout(r, ms))

function applyFilters(events: EventItem[], filters?: EventFilters): EventItem[] {
  if (!filters) return events
  return events.filter((e) => {
    if (filters.city && e.city !== filters.city) return false
    if (filters.categories?.length && !filters.categories.includes(e.category)) {
      return false
    }
    if (filters.query) {
      const q = filters.query.toLowerCase()
      const haystack = `${e.title} ${e.venue} ${e.city} ${e.organizer}`.toLowerCase()
      if (!haystack.includes(q)) return false
    }
    return true
  })
}

const mockEventsRepository: EventsRepository = {
  async list(filters) {
    await delay()
    return applyFilters(SEED_EVENTS, filters)
  },
  async get(id) {
    await delay(200)
    return SEED_EVENTS.find((e) => e.id === id) ?? null
  },
  async featured() {
    await delay()
    return SEED_EVENTS.filter((e) => e.featured)
  },
}

// Supabase-backed implementation. Expects an `events` table whose columns map
// to EventItem (snake_case). Falls back to seed data if the query fails so the
// UI never hard-crashes during a hackathon demo.
const supabaseEventsRepository: EventsRepository = {
  async list(filters) {
    let query = supabase!.from('events').select('*').order('date', { ascending: true })
    if (filters?.city) query = query.eq('city', filters.city)
    const { data, error } = await query
    if (error || !data) return applyFilters(SEED_EVENTS, filters)
    return applyFilters(data as unknown as EventItem[], filters)
  },
  async get(id) {
    const { data, error } = await supabase!.from('events').select('*').eq('id', id).single()
    if (error || !data) return SEED_EVENTS.find((e) => e.id === id) ?? null
    return data as unknown as EventItem
  },
  async featured() {
    const { data, error } = await supabase!.from('events').select('*').eq('featured', true)
    if (error || !data) return SEED_EVENTS.filter((e) => e.featured)
    return data as unknown as EventItem[]
  },
}

export const eventsRepository: EventsRepository = supabase
  ? supabaseEventsRepository
  : mockEventsRepository
