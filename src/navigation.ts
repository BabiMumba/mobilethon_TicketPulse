import type { LucideIcon } from 'lucide-react'
import { Home, Search, Ticket, LineChart, User } from 'lucide-react'

export interface NavItem {
  /** Route path used by react-router. */
  to: string
  /** Visible label in the bottom navigation. */
  label: string
  /** Accessible / descriptive purpose of the tab. */
  description: string
  icon: LucideIcon
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
  },
  {
    to: '/organizer',
    label: 'Organizer',
    description: 'Event creation & sales charts',
    icon: LineChart,
  },
  {
    to: '/profile',
    label: 'Profile',
    description: 'Your account & preferences',
    icon: User,
  },
]
