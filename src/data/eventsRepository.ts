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
    tag: input.tag ?? (input.price === 0 ? 'Free' : undefined),
    featured: input.featured ?? false,
  }
}

function ownsEvent(event: EventItem, userId: string, fallbackName?: string): boolean {
  if (event.createdBy === userId) return true
  if (!event.createdBy && fallbackName && event.organizer === fallbackName) return true
  return false
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
  async update(id, input) {
    await delay(300)
    const custom = readCustomEvents()
    const idx = custom.findIndex((e) => e.id === id)
    if (idx === -1) throw new Error('Event not found or cannot be edited.')
    const updated = buildEvent({ ...input, createdBy: input.createdBy ?? custom[idx].createdBy }, id)
    custom[idx] = updated
    writeCustomEvents(custom)
    notifyEventsChanged()
    return updated
  },
  async delete(id, userId) {
    await delay(200)
    const custom = readCustomEvents()
    const event = custom.find((e) => e.id === id)
    if (!event || event.createdBy !== userId) {
      throw new Error('Event not found or cannot be deleted.')
    }
    writeCustomEvents(custom.filter((e) => e.id !== id))
    notifyEventsChanged()
  },
  async listByOrganizer(userId, fallbackName) {
    await delay(200)
    return allMockEvents().filter((e) => ownsEvent(e, userId, fallbackName))
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
  async update(id, input) {
    const event = buildEvent(input, id)
    const { data, error } = await supabase!
      .from('events')
      .update(mapEventToRow(event))
      .eq('id', id)
      .select('*')
      .single()
    if (error) throw new Error(error.message)
    const updated = mapEventRow(data)
    notifyEventsChanged()
    return updated
  },
  async delete(id, userId) {
    const { error } = await supabase!.from('events').delete().eq('id', id).eq('created_by', userId)
    if (error) {
      if (error.code === '23503') {
        throw new Error(
          'This event still has ticket reservations. Redeploy the latest version or run migration 011 on Supabase.',
        )
      }
      throw new Error(error.message)
    }
    notifyEventsChanged()
  },
  async listByOrganizer(userId, fallbackName) {
    const { data: byCreator, error: e1 } = await supabase!
      .from('events')
      .select('*')
      .eq('created_by', userId)
      .order('date', { ascending: true })

    if (e1) {
      console.error('[TicketPulse] Failed to load organizer events:', e1.message)
      return []
    }

    let events = (byCreator ?? []).map(mapEventRow)

    if (fallbackName) {
      const { data: legacy } = await supabase!
        .from('events')
        .select('*')
        .is('created_by', null)
        .eq('organizer', fallbackName)
        .order('date', { ascending: true })
      if (legacy?.length) {
        const ids = new Set(events.map((e) => e.id))
        events = [...events, ...legacy.map(mapEventRow).filter((e) => !ids.has(e.id))]
      }
    }

    return events
  },
}

export const eventsRepository: EventsRepository = supabase
  ? supabaseEventsRepository
  : mockEventsRepository
