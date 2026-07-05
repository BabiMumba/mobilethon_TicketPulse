import type { EventItem, Profile, Ticket } from '../data/types'

type EventRow = {
  id: string
  title: string
  description: string
  city: string
  venue: string
  date: string
  price: number
  currency: string
  category: string
  image_url: string
  organizer: string
  tag?: string | null
  featured?: boolean | null
}

type ProfileRow = {
  id: string
  full_name: string
  email: string
  phone?: string | null
  city?: string | null
  is_organizer?: boolean | null
}

type TicketRow = {
  id: string
  code: string
  event_id: string
  user_id: string
  type: string
  seat: string
  quantity: number
  amount_paid: number
  currency: string
  status: string
  purchased_at: string
  event: Ticket['event']
}

export function mapEventRow(row: EventRow): EventItem {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    city: row.city as EventItem['city'],
    venue: row.venue,
    date: row.date,
    price: Number(row.price),
    currency: row.currency,
    category: row.category as EventItem['category'],
    imageUrl: row.image_url,
    organizer: row.organizer,
    tag: row.tag ?? undefined,
    featured: row.featured ?? undefined,
  }
}

export function mapEventToRow(event: EventItem) {
  return {
    id: event.id,
    title: event.title,
    description: event.description,
    city: event.city,
    venue: event.venue,
    date: event.date,
    price: event.price,
    currency: event.currency,
    category: event.category,
    image_url: event.imageUrl,
    organizer: event.organizer,
    tag: event.tag ?? null,
    featured: event.featured ?? false,
  }
}

export function mapProfileRow(row: ProfileRow): Profile {
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    phone: row.phone ?? undefined,
    city: (row.city as Profile['city']) ?? undefined,
    isOrganizer: row.is_organizer ?? undefined,
  }
}

export function mapProfileToRow(profile: Profile): ProfileRow {
  return {
    id: profile.id,
    full_name: profile.fullName,
    email: profile.email,
    phone: profile.phone ?? null,
    city: profile.city ?? null,
    is_organizer: profile.isOrganizer ?? false,
  }
}

export function mapTicketRow(row: TicketRow): Ticket {
  return {
    id: row.id,
    code: row.code,
    eventId: row.event_id,
    userId: row.user_id,
    type: row.type,
    seat: row.seat,
    quantity: row.quantity,
    amountPaid: Number(row.amount_paid),
    currency: row.currency,
    status: row.status as Ticket['status'],
    purchasedAt: row.purchased_at,
    event: row.event,
  }
}

export function mapTicketToRow(ticket: Ticket) {
  return {
    id: ticket.id,
    code: ticket.code,
    event_id: ticket.eventId,
    user_id: ticket.userId,
    type: ticket.type,
    seat: ticket.seat,
    quantity: ticket.quantity,
    amount_paid: ticket.amountPaid,
    currency: ticket.currency,
    status: ticket.status,
    purchased_at: ticket.purchasedAt,
    event: ticket.event,
  }
}
