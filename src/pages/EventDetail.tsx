import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ArrowLeft, MapPin, CalendarDays, User, Tag } from 'lucide-react'
import type { EventItem } from '../data/types'
import { eventsRepository } from '../data/eventsRepository'
import { useAuth } from '../auth/useAuth'
import PageContainer from '../components/PageContainer'
import Button from '../components/ui/Button'
import { Skeleton } from '../components/ui/Skeleton'
import { formatEventDate, formatMoney, isFreeEvent } from '../lib/format'

export default function EventDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [event, setEvent] = useState<EventItem | null | undefined>(undefined)

  useEffect(() => {
    let active = true
    if (id) eventsRepository.get(id).then((e) => active && setEvent(e))
    return () => {
      active = false
    }
  }, [id])

  const handleGetTickets = () => {
    if (!user) {
      navigate('/login', { state: { from: `/checkout/${id}` } })
      return
    }
    navigate(`/checkout/${id}`)
  }

  if (event === undefined) {
    return (
      <PageContainer className="space-y-4 p-5">
        <Skeleton className="h-60 w-full" />
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-24 w-full" />
      </PageContainer>
    )
  }

  if (event === null) {
    return (
      <PageContainer className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-8 text-center">
        <p className="text-slate-400">This event could not be found.</p>
        <Link to="/" className="text-brand-400 underline">
          Back to Discover
        </Link>
      </PageContainer>
    )
  }

  return (
    <div className="animate-fade-in pb-6">
      <div className="relative">
        <img
          src={event.imageUrl}
          alt={event.title}
          className="h-64 w-full object-cover md:h-96"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        <button
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="absolute left-4 top-4 rounded-full bg-slate-950/60 p-2.5 text-white backdrop-blur transition-colors hover:bg-slate-950/80"
        >
          <ArrowLeft size={20} />
        </button>
      </div>

      <PageContainer className="-mt-12 space-y-6 px-5">
        <div className="relative rounded-3xl border border-white/10 bg-slate-900/90 p-6 backdrop-blur md:max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-500/15 px-3 py-1 text-xs font-semibold text-brand-300">
            <Tag size={12} /> {event.category}
          </span>
          <h1 className="mt-3 text-2xl font-bold leading-tight md:text-3xl">{event.title}</h1>

          <div className="mt-4 space-y-2 text-sm text-slate-300">
            <p className="flex items-center gap-2">
              <MapPin size={16} className="text-brand-400" /> {event.venue}, {event.city}
            </p>
            <p className="flex items-center gap-2">
              <CalendarDays size={16} className="text-brand-400" /> {formatEventDate(event.date)}
            </p>
            <p className="flex items-center gap-2">
              <User size={16} className="text-brand-400" /> Hosted by {event.organizer}
            </p>
          </div>

          <p className="mt-5 text-sm leading-relaxed text-slate-400">{event.description}</p>

          <div className="mt-6 flex items-center justify-between gap-4 border-t border-white/10 pt-5">
            <div>
              <p className="text-xs text-slate-500">From</p>
              <p className="text-2xl font-bold text-emerald-400">
                {formatMoney(event.price, event.currency)}
              </p>
            </div>
            <Button size="lg" onClick={handleGetTickets}>
              {isFreeEvent(event.price) ? 'Get free ticket' : 'Reserve ticket'}
            </Button>
          </div>
        </div>
      </PageContainer>
    </div>
  )
}
