import { supabase } from '../lib/supabase'
import { notifyEventsChanged } from '../lib/eventsNotify'
import { mapEventRow, mapEventToRow } from '../lib/supabaseMap'
import type { CreateEventInput, EventFilters, EventItem, EventsRepository } from './types'
import { SEED_EVENTS } from './seed'

const CUSTOM_EVENTS_KEY = 'tp:events:custom'

const delay = (ms = 350) => new Promise((r) => setTimeout(r, ms))

function readCustomEvents(): EventItem[] {
  try {
    return JSON.parse(localStorage.getItem(CUSTOM_EVENTS_KEY) || '[]') as EventItem[]
  } catch {
    return []
  }
}

function writeCustomEvents(events: EventItem[]): void {
  localStorage.setItem(CUSTOM_EVENTS_KEY, JSON.stringify(events))
}

function allMockEvents(): EventItem[] {
  const custom = readCustomEvents()
  const seedIds = new Set(SEED_EVENTS.map((e) => e.id))
  return [...SEED_EVENTS, ...custom.filter((e) => !seedIds.has(e.id))]
}

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

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40)
}

function buildEvent(input: CreateEventInput, id?: string): EventItem {
  const eventId = id ?? `evt-${slugify(input.title)}-${Date.now()}`
  return {
    id: eventId,
    title: input.title,
    description: input.description,
    city: input.city,
    venue: input.venue,
    date: input.date,
    price: input.price,
    currency: input.currency ?? 'ZMW',
    category: input.category,
    imageUrl: input.imageUrl,
    organizer: input.organizer,
    createdBy: input.createdBy,
    tag: input.tag,
    featured: input.featured ?? false,
  }
}

const mockEventsRepository: EventsRepository = {
  async list(filters) {
    await delay()
    return applyFilters(allMockEvents(), filters)
  },
  async get(id) {
    await delay(200)
    return allMockEvents().find((e) => e.id === id) ?? null
  },
  async featured() {
    await delay()
    return allMockEvents().filter((e) => e.featured)
  },
  async create(input) {
    await delay(300)
    const event = buildEvent(input)
    writeCustomEvents([event, ...readCustomEvents()])
    notifyEventsChanged()
    return event
  },
  async listByOrganizer(userId) {
    await delay(200)
    return allMockEvents().filter((e) => e.createdBy === userId)
  },
}

const supabaseEventsRepository: EventsRepository = {
  async list(filters) {
    let query = supabase!.from('events').select('*').order('date', { ascending: true })
    if (filters?.city) query = query.eq('city', filters.city)
    const { data, error } = await query
    if (error) {
      console.error('[TicketPulse] Failed to load events:', error.message)
      return []
    }
    return applyFilters((data ?? []).map(mapEventRow), filters)
  },
  async get(id) {
    const { data, error } = await supabase!.from('events').select('*').eq('id', id).single()
    if (error || !data) return null
    return mapEventRow(data)
  },
  async featured() {
    const { data, error } = await supabase!.from('events').select('*').eq('featured', true)
    if (error) return []
    return (data ?? []).map(mapEventRow)
  },
  async create(input) {
    const event = buildEvent(input)
    const { data, error } = await supabase!
      .from('events')
      .insert(mapEventToRow(event))
      .select('*')
      .single()
    if (error) throw new Error(error.message)
    const created = mapEventRow(data)
    notifyEventsChanged()
    return created
  },
  async listByOrganizer(userId) {
    const { data, error } = await supabase!
      .from('events')
      .select('*')
      .eq('created_by', userId)
      .order('date', { ascending: true })
    if (error) {
      console.error('[TicketPulse] Failed to load organizer events:', error.message)
      return []
    }
    return (data ?? []).map(mapEventRow)
  },
}

export const eventsRepository: EventsRepository = supabase
  ? supabaseEventsRepository
  : mockEventsRepository
