import { Link } from 'react-router-dom'
import { MapPin, CalendarDays } from 'lucide-react'
import type { EventItem } from '../data/types'
import { formatEventDate, formatMoney, isFreeEvent } from '../lib/format'

export default function EventCard({ event }: { event: EventItem }) {
  return (
    <Link
      to={`/events/${event.id}`}
      className="group flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 transition-all duration-200 hover:-translate-y-1 hover:border-accent-500/30 hover:shadow-glow-emerald"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={event.imageUrl}
          alt={event.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
        {event.tag && (
          <span className="absolute left-3 top-3 rounded-full bg-brand-500/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
            {event.tag}
          </span>
        )}
        <span className="absolute bottom-3 right-3 rounded-xl bg-slate-950/80 px-3 py-1.5 text-sm font-bold text-accent-400 backdrop-blur">
          {formatMoney(event.price, event.currency)}
        </span>
        {isFreeEvent(event.price) && (
          <span className="absolute left-3 bottom-3 rounded-full bg-accent-500 px-2.5 py-1 text-[11px] font-semibold uppercase text-white">
            Free
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-base font-bold leading-tight text-white">{event.title}</h3>
        <div className="mt-3 space-y-1.5 text-sm text-slate-300">
          <p className="flex items-center gap-2">
            <MapPin size={15} className="text-brand-400" />
            {event.venue}, {event.city}
          </p>
          <p className="flex items-center gap-2">
            <CalendarDays size={15} className="text-brand-400" />
            {formatEventDate(event.date)}
          </p>
        </div>
      </div>
    </Link>
  )
}
