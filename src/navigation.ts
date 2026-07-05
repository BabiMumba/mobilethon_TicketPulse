import type { LucideIcon } from 'lucide-react'
import { Home, Search, Ticket, LineChart, User } from 'lucide-react'

export interface NavItem {
  to: string
  label: string
  /** Shorter label used on the desktop header where space allows more detail. */
  desktopLabel?: string
  description: string
  icon: LucideIcon
  /** Only shown to authenticated users. */
  requiresAuth?: boolean
}

export const NAV_ITEMS: NavItem[] = [
  {
    to: '/',
    label: 'Home',
    description: 'Event discovery dashboard',
    icon: Home,
  },
  {
    to: '/search',
    label: 'Search',
    description: 'Advanced filters for Lusaka, Ndola, Kitwe & Livingstone',
    icon: Search,
  },
  {
    to: '/tickets',
    label: 'My Tickets',
    description: 'Offline-ready digital passes & QR codes',
    icon: Ticket,
    requiresAuth: true,
  },
  {
    to: '/organizer',
    label: 'Organizer',
    desktopLabel: 'Organizer Dashboard',
    description: 'Event creation & sales charts',
    icon: LineChart,
    requiresAuth: true,
  },
  {
    to: '/profile',
    label: 'Profile',
    description: 'Your account & preferences',
    icon: User,
    requiresAuth: true,
  },
]

/** Returns the nav items visible for the current auth state. */
export function visibleNavItems(isAuthed: boolean): NavItem[] {
  return NAV_ITEMS.filter((item) => !item.requiresAuth || isAuthed)
}
