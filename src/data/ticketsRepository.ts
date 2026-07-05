import { supabase } from '../lib/supabase'
import { mapTicketRow, mapTicketToRow } from '../lib/supabaseMap'
import type { EventBooking, NewTicketInput, Ticket, TicketsRepository } from './types'

const CACHE_PREFIX = 'tp:tickets:'
const ALL_TICKETS_KEY = 'tp:tickets:all'

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
    /* non-fatal */
  }
}

function readAllTickets(): Ticket[] {
  try {
    return JSON.parse(localStorage.getItem(ALL_TICKETS_KEY) || '[]') as Ticket[]
  } catch {
    return []
  }
}

function appendTicket(ticket: Ticket): void {
  writeCache(ticket.userId, [ticket, ...readCache(ticket.userId)])
  localStorage.setItem(ALL_TICKETS_KEY, JSON.stringify([ticket, ...readAllTickets()]))
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

function mapToBooking(ticket: Ticket, name: string, email: string): EventBooking {
  return {
    ticketId: ticket.id,
    code: ticket.code,
    attendeeName: name,
    attendeeEmail: email,
    quantity: ticket.quantity,
    amountPaid: ticket.amountPaid,
    currency: ticket.currency,
    status: ticket.status,
    purchasedAt: ticket.purchasedAt,
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
    return readAllTickets().find((t) => t.id === id) ?? null
  },
  async create(input) {
    await delay(400)
    const ticket = buildTicket(input)
    appendTicket(ticket)
    return ticket
  },
  async listForEvent(eventId) {
    await delay(200)
    return readAllTickets()
      .filter((t) => t.eventId === eventId)
      .map((t) => mapToBooking(t, 'Guest', 'guest@local.dev'))
  },
}

type TicketWithProfile = {
  id: string
  code: string
  user_id: string
  quantity: number
  amount_paid: number
  currency: string
  status: string
  purchased_at: string
  profiles: { full_name: string; email: string } | { full_name: string; email: string }[] | null
}

const supabaseTicketsRepository: TicketsRepository = {
  async listForUser(userId) {
    const { data, error } = await supabase!
      .from('tickets')
      .select('*')
      .eq('user_id', userId)
      .order('purchased_at', { ascending: false })
    if (error) {
      console.error('[TicketPulse] Failed to load tickets:', error.message)
      return []
    }
    const tickets = (data ?? []).map(mapTicketRow)
    writeCache(userId, tickets)
    return tickets
  },
  async get(id) {
    const { data, error } = await supabase!.from('tickets').select('*').eq('id', id).single()
    if (error || !data) return null
    return mapTicketRow(data)
  },
  async create(input) {
    const ticket = buildTicket(input)
    const { error } = await supabase!.from('tickets').insert(mapTicketToRow(ticket))
    if (error) throw new Error(error.message)
    appendTicket(ticket)
    return ticket
  },
  async listForEvent(eventId) {
    const { data, error } = await supabase!
      .from('tickets')
      .select('id, code, user_id, quantity, amount_paid, currency, status, purchased_at, profiles(full_name, email)')
      .eq('event_id', eventId)
      .order('purchased_at', { ascending: false })

    if (error) {
      console.error('[TicketPulse] Failed to load event bookings:', error.message)
      return []
    }

    return ((data ?? []) as TicketWithProfile[]).map((row) => {
      const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles
      return {
        ticketId: row.id,
        code: row.code,
        attendeeName: profile?.full_name ?? 'Guest',
        attendeeEmail: profile?.email ?? '—',
        quantity: row.quantity,
        amountPaid: Number(row.amount_paid),
        currency: row.currency,
        status: row.status as EventBooking['status'],
        purchasedAt: row.purchased_at,
      }
    })
  },
}

export const ticketsRepository: TicketsRepository = supabase
  ? supabaseTicketsRepository
  : mockTicketsRepository
