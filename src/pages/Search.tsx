import { useEffect, useMemo, useState } from 'react'
import { Search as SearchIcon, SlidersHorizontal, MapPin, CalendarX } from 'lucide-react'
import type { City, EventCategory, EventItem } from '../data/types'
import { eventsRepository } from '../data/eventsRepository'
import PageShell from '../components/PageShell'
import EventCard from '../components/EventCard'
import { EventCardSkeleton } from '../components/ui/Skeleton'
import { EVENTS_CHANGED } from '../lib/eventsNotify'

const CITIES: City[] = ['Lusaka', 'Ndola', 'Kitwe', 'Livingstone']
const CATEGORIES: EventCategory[] = [
  'Music',
  'Sports',
  'Business',
  'Comedy',
  'Festivals',
  'Theatre',
]

export default function SearchPage() {
  const [allEvents, setAllEvents] = useState<EventItem[] | null>(null)
  const [query, setQuery] = useState('')
  const [activeCity, setActiveCity] = useState<City | null>(null)
  const [activeCategories, setActiveCategories] = useState<EventCategory[]>([])

  useEffect(() => {
    let active = true
    const load = () => {
      eventsRepository.list().then((data) => {
        if (active) setAllEvents(data)
      })
    }
    load()
    window.addEventListener(EVENTS_CHANGED, load)
    return () => {
      active = false
      window.removeEventListener(EVENTS_CHANGED, load)
    }
  }, [])

  const toggleCategory = (c: EventCategory) =>
    setActiveCategories((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c],
    )

  const results = useMemo(() => {
    if (!allEvents) return null
    return allEvents.filter((e) => {
      if (activeCity && e.city !== activeCity) return false
      if (activeCategories.length && !activeCategories.includes(e.category)) return false
      if (query) {
        const q = query.toLowerCase()
        if (!`${e.title} ${e.venue} ${e.city} ${e.organizer}`.toLowerCase().includes(q))
          return false
      }
      return true
    })
  }, [allEvents, activeCity, activeCategories, query])

  return (
    <PageShell title="Search" subtitle="Find events across Zambia">
      <div className="space-y-6">
        <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
          <SearchIcon size={18} className="text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search events, artists, venues…"
            className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
          />
        </div>

        <section>
          <div className="mb-3 flex items-center gap-2">
            <MapPin size={16} className="text-brand-400" />
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">City</h2>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {CITIES.map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => setActiveCity((prev) => (prev === city ? null : city))}
                className={[
                  'cursor-pointer rounded-2xl border px-4 py-3 text-sm font-medium transition-colors',
                  activeCity === city
                    ? 'border-brand-400 bg-brand-500/15 text-brand-300'
                    : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10',
                ].join(' ')}
              >
                {city}
              </button>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-3 flex items-center gap-2">
            <SlidersHorizontal size={16} className="text-emerald-400" />
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
              Categories
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => {
              const active = activeCategories.includes(c)
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => toggleCategory(c)}
                  className={[
                    'cursor-pointer rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
                    active
                      ? 'bg-gradient-to-r from-brand-500 to-emerald-500 text-white'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10',
                  ].join(' ')}
                >
                  {c}
                </button>
              )
            })}
          </div>
        </section>

        <section>
          <p className="mb-4 text-sm text-slate-400">
            {results ? `${results.length} event${results.length === 1 ? '' : 's'} found` : 'Searching…'}
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {results
              ? results.map((e) => <EventCard key={e.id} event={e} />)
              : Array.from({ length: 4 }).map((_, i) => <EventCardSkeleton key={i} />)}
          </div>
          {results && results.length === 0 && (
            <div className="flex flex-col items-center gap-3 rounded-3xl border border-white/10 bg-white/5 py-14 text-center">
              <CalendarX size={32} className="text-slate-500" />
              <p className="text-sm text-slate-400">No events match your filters yet.</p>
            </div>
          )}
        </section>
      </div>
    </PageShell>
  )
}
