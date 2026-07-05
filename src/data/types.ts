export type City = 'Lusaka' | 'Ndola' | 'Kitwe' | 'Livingstone'

export type EventCategory =
  | 'Music'
  | 'Sports'
  | 'Business'
  | 'Comedy'
  | 'Festivals'
  | 'Theatre'

export interface EventItem {
  id: string
  title: string
  description: string
  city: City
  venue: string
  /** ISO 8601 date-time string. */
  date: string
  price: number
  currency: string
  category: EventCategory
  imageUrl: string
  organizer: string
  tag?: string
  featured?: boolean
}

export interface Profile {
  id: string
  fullName: string
  email: string
  phone?: string
  city?: City
  isOrganizer?: boolean
}

export type TicketStatus = 'valid' | 'used' | 'refunded'

export interface Ticket {
  id: string
  code: string
  eventId: string
  userId: string
  type: string
  seat: string
  quantity: number
  amountPaid: number
  currency: string
  status: TicketStatus
  purchasedAt: string
  /** Denormalised event snapshot so passes render fully offline. */
  event: Pick<EventItem, 'title' | 'city' | 'venue' | 'date' | 'imageUrl'>
}

export interface EventFilters {
  query?: string
  city?: City
  categories?: EventCategory[]
}

export interface EventsRepository {
  list(filters?: EventFilters): Promise<EventItem[]>
  get(id: string): Promise<EventItem | null>
  featured(): Promise<EventItem[]>
}

export interface TicketsRepository {
  listForUser(userId: string): Promise<Ticket[]>
  get(id: string): Promise<Ticket | null>
  create(input: NewTicketInput): Promise<Ticket>
}

export interface NewTicketInput {
  userId: string
  event: EventItem
  type: string
  seat: string
  quantity: number
  amountPaid: number
}

export interface ProfilesRepository {
  get(userId: string): Promise<Profile | null>
  upsert(profile: Profile): Promise<Profile>
}
