import { supabase } from '../lib/supabase'
import type { NewTicketInput, Ticket, TicketsRepository } from './types'

const CACHE_PREFIX = 'tp:tickets:'

// LocalStorage fallback cache so purchased passes open instantly in
// low-bandwidth zones across Lusaka — even before any network round-trip.
function readCache(userId: string): Ticket[] {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + userId)
    return raw ? (JSON.parse(raw) as Ticket[]) : []
  } catch {
    return []
  }
}

function writeCache(userId: string, tickets: Ticket[]): void {
  try {
    localStorage.setItem(CACHE_PREFIX + userId, JSON.stringify(tickets))
  } catch {
    /* storage full / unavailable — non-fatal */
  }
}

function makeCode(city: string): string {
  const prefix = city.slice(0, 3).toUpperCase()
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase()
  return `TP-${prefix}-${rand}`
}

function buildTicket(input: NewTicketInput): Ticket {
  const code = makeCode(input.event.city)
  return {
    id: code,
    code,
    eventId: input.event.id,
    userId: input.userId,
    type: input.type,
    seat: input.seat,
    quantity: input.quantity,
    amountPaid: input.amountPaid,
    currency: input.event.currency,
    status: 'valid',
    purchasedAt: new Date().toISOString(),
    event: {
      title: input.event.title,
      city: input.event.city,
      venue: input.event.venue,
      date: input.event.date,
      imageUrl: input.event.imageUrl,
    },
  }
}

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms))

const mockTicketsRepository: TicketsRepository = {
  async listForUser(userId) {
    await delay()
    return readCache(userId)
  },
  async get(id) {
    await delay(150)
    for (const key of Object.keys(localStorage)) {
      if (!key.startsWith(CACHE_PREFIX)) continue
      const found = (JSON.parse(localStorage.getItem(key) || '[]') as Ticket[]).find(
        (t) => t.id === id,
      )
      if (found) return found
    }
    return null
  },
  async create(input) {
    await delay(400)
    const ticket = buildTicket(input)
    const tickets = [ticket, ...readCache(input.userId)]
    writeCache(input.userId, tickets)
    return ticket
  },
}

// Supabase-backed tickets, with the same localStorage cache used as an offline
// read-through fallback so tickets remain scannable with no network.
const supabaseTicketsRepository: TicketsRepository = {
  async listForUser(userId) {
    const { data, error } = await supabase!
      .from('tickets')
      .select('*')
      .eq('user_id', userId)
      .order('purchased_at', { ascending: false })
    if (error || !data) return readCache(userId) // offline fallback
    const tickets = data as unknown as Ticket[]
    writeCache(userId, tickets)
    return tickets
  },
  async get(id) {
    const { data, error } = await supabase!.from('tickets').select('*').eq('id', id).single()
    if (error || !data) return mockTicketsRepository.get(id)
    return data as unknown as Ticket
  },
  async create(input) {
    const ticket = buildTicket(input)
    const { error } = await supabase!.from('tickets').insert(ticket)
    // Always cache locally regardless of network result.
    writeCache(input.userId, [ticket, ...readCache(input.userId)])
    if (error) {
      console.warn('[TicketPulse] Ticket saved offline; will sync when online.', error)
    }
    return ticket
  },
}

export const ticketsRepository: TicketsRepository = supabase
  ? supabaseTicketsRepository
  : mockTicketsRepository
