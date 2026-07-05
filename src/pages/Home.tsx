import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Flame, MapPin, Sparkles, TrendingUp, Ticket, ArrowRight } from 'lucide-react'
import type { EventItem } from '../data/types'
import { eventsRepository } from '../data/eventsRepository'
import EventCard from '../components/EventCard'
import PageContainer from '../components/PageContainer'
import { EventCardSkeleton } from '../components/ui/Skeleton'
import Button from '../components/ui/Button'

const CATEGORIES = ['All', 'Music', 'Sports', 'Business', 'Comedy', 'Festivals']

function DesktopHero({ onExplore, onHost }: { onExplore: () => void; onHost: () => void }) {
  return (
    <section className="relative hidden overflow-hidden md:block">
      {/* Ambient gradient orbs */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-brand-600/30 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-16 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />

      <div className="mx-auto grid max-w-6xl grid-cols-2 items-center gap-10 px-6 py-20">
        <div>
          <span className="animate-fade-in-down inline-flex items-center gap-2 rounded-full border border-brand-400/30 bg-brand-500/10 px-3 py-1.5 text-xs font-medium text-brand-300">
            <Sparkles size={14} /> Zambia's premium events platform
          </span>
          <h1 className="animate-fade-in-up mt-5 text-5xl font-extrabold leading-[1.05] tracking-tight delay-75">
            Discover &amp; Experience the{' '}
            <span className="bg-gradient-to-r from-brand-400 to-emerald-400 bg-clip-text text-transparent">
              Best Events
            </span>{' '}
            in Zambia
          </h1>
          <p className="animate-fade-in-up mt-5 max-w-md text-lg text-slate-400 delay-150">
            From Lusaka to Livingstone — book tickets in seconds, pay with mobile
            money, and carry offline-ready passes to the gate.
          </p>
          <div className="animate-fade-in-up mt-8 flex flex-wrap gap-3 delay-300">
            <Button size="lg" onClick={onExplore} leftIcon={<Ticket size={18} />}>
              Explore Events
            </Button>
            <Button size="lg" variant="outline" onClick={onHost}>
              Host an Event <ArrowRight size={18} />
            </Button>
          </div>
          <div className="animate-fade-in-up mt-10 flex gap-8 delay-500">
            {[
              ['12k+', 'Tickets sold'],
              ['300+', 'Events hosted'],
              ['4 cities', 'Across Zambia'],
            ].map(([n, l]) => (
              <div key={l}>
                <p className="text-2xl font-bold text-white">{n}</p>
                <p className="text-sm text-slate-500">{l}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative animate-scale-in">
          <div className="animate-float overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1000&q=80"
              alt="Live event crowd"
              className="h-[26rem] w-full object-cover"
            />
          </div>
          {/* Replaceable clean illustration placeholders */}
          <div className="absolute -bottom-6 -left-6 flex h-24 w-40 flex-col items-center justify-center rounded-2xl border border-white/10 bg-slate-900/90 text-center text-xs text-slate-500 shadow-2xl backdrop-blur">
            <span className="mb-1 text-brand-400">[ Illustration ]</span>
            Replace me
          </div>
          <div className="absolute -right-4 top-8 flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-900/90 px-4 py-3 shadow-2xl backdrop-blur">
            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-400" />
            <span className="text-sm font-medium">Live now in Lusaka</span>
          </div>
        </div>
      </div>
    </section>
  )
}

function MobileGreeting() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-900/80 px-5 pb-4 pt-6 backdrop-blur-lg md:hidden">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="bg-gradient-to-r from-brand-400 to-emerald-400 bg-clip-text text-2xl font-bold tracking-tight text-transparent">
            Discover
          </h1>
          <p className="mt-1 text-sm text-slate-400">What's pulsing in Zambia tonight</p>
        </div>
        <span className="flex items-center gap-1 rounded-full bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300">
          <MapPin size={14} className="text-brand-400" /> Lusaka
        </span>
      </div>
    </header>
  )
}

export default function Home() {
  const navigate = useNavigate()
  const [events, setEvents] = useState<EventItem[] | null>(null)

  useEffect(() => {
    let active = true
    eventsRepository.list().then((data) => {
      if (active) setEvents(data)
    })
    return () => {
      active = false
    }
  }, [])

  const featured = events?.filter((e) => e.featured) ?? []

  return (
    <div className="animate-fade-in">
      <DesktopHero
        onExplore={() => navigate('/search')}
        onHost={() => navigate('/organizer')}
      />
      <MobileGreeting />

      <PageContainer className="space-y-8 px-5 py-5 md:py-4">
        {/* Mobile category chips */}
        <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1 md:hidden">
          {CATEGORIES.map((c, i) => (
            <button
              key={c}
              onClick={() => navigate('/search')}
              className={[
                'whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
                i === 0
                  ? 'bg-gradient-to-r from-brand-500 to-emerald-500 text-white'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10',
              ].join(' ')}
            >
              {c}
            </button>
          ))}
        </div>

        <section>
          <div className="mb-4 flex items-center gap-2">
            <Flame size={18} className="text-orange-400" />
            <h2 className="text-lg font-semibold md:text-2xl">Featured events</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {events
              ? featured.map((e) => <EventCard key={e.id} event={e} />)
              : Array.from({ length: 3 }).map((_, i) => <EventCardSkeleton key={i} />)}
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-emerald-400" />
            <h2 className="text-lg font-semibold md:text-2xl">Happening across Zambia</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {events
              ? events.map((e) => <EventCard key={e.id} event={e} />)
              : Array.from({ length: 6 }).map((_, i) => <EventCardSkeleton key={i} />)}
          </div>
        </section>
      </PageContainer>
    </div>
  )
}
