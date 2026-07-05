import { useNavigate } from 'react-router-dom'
import { Flame, TrendingUp } from 'lucide-react'
import type { EventItem } from '../../data/types'
import EventCard from '../EventCard'
import { EventCardSkeleton } from '../ui/Skeleton'
import Button from '../ui/Button'

const CATEGORIES = ['All', 'Music', 'Sports', 'Business', 'Comedy', 'Festivals'] as const

interface EventsShowcaseProps {
  events: EventItem[] | null
}

export default function EventsShowcase({ events }: EventsShowcaseProps) {
  const navigate = useNavigate()
  const featured = events?.filter((e) => e.featured) ?? []

  return (
    <div className="space-y-12 py-10 md:py-14">
      {/* Category strip — mobile */}
      <div className="no-scrollbar flex gap-2 overflow-x-auto px-5 md:hidden">
        {CATEGORIES.map((c, i) => (
          <button
            key={c}
            type="button"
            onClick={() => navigate('/search')}
            className={[
              'cursor-pointer whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors',
              i === 0
                ? 'bg-accent-500 text-white shadow-glow-emerald'
                : 'border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10',
            ].join(' ')}
          >
            {c}
          </button>
        ))}
      </div>

      <section className="mx-auto max-w-6xl px-5 md:px-6">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <Flame size={20} className="text-orange-400" />
              <span className="font-display text-sm uppercase tracking-widest text-orange-400/80">
                Hot right now
              </span>
            </div>
            <h2 className="font-display text-2xl text-white md:text-3xl">Featured events</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate('/search')}>
            View all
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {events
            ? featured.map((e) => <EventCard key={e.id} event={e} />)
            : Array.from({ length: 3 }).map((_, i) => <EventCardSkeleton key={i} />)}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 md:px-6">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <TrendingUp size={20} className="text-accent-400" />
              <span className="font-display text-sm uppercase tracking-widest text-accent-400/80">
                This month
              </span>
            </div>
            <h2 className="font-display text-2xl text-white md:text-3xl">
              Happening across Zambia
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {events
            ? events.map((e) => <EventCard key={e.id} event={e} />)
            : Array.from({ length: 6 }).map((_, i) => <EventCardSkeleton key={i} />)}
        </div>
      </section>
    </div>
  )
}
