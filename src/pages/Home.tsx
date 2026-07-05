import { CalendarDays, MapPin, Flame, TrendingUp } from 'lucide-react'
import ScreenHeader from '../components/ScreenHeader'

interface EventCard {
  id: string
  title: string
  city: string
  venue: string
  date: string
  price: string
  tag: string
  gradient: string
}

const FEATURED: EventCard[] = [
  {
    id: 'evt-1',
    title: 'Lusaka July Amapiano Festival',
    city: 'Lusaka',
    venue: 'Heroes Stadium',
    date: 'Sat, 25 Jul • 18:00',
    price: 'ZMW 250',
    tag: 'Trending',
    gradient: 'from-fuchsia-500/30 to-brand-500/30',
  },
  {
    id: 'evt-2',
    title: 'Copperbelt Tech Summit',
    city: 'Ndola',
    venue: 'Mukuba Hotel',
    date: 'Fri, 31 Jul • 09:00',
    price: 'ZMW 400',
    tag: 'Business',
    gradient: 'from-cyan-500/30 to-emerald-500/30',
  },
  {
    id: 'evt-3',
    title: 'Livingstone Jazz on the Zambezi',
    city: 'Livingstone',
    venue: 'Royal Livingstone',
    date: 'Sun, 09 Aug • 16:30',
    price: 'ZMW 350',
    tag: 'Live Music',
    gradient: 'from-amber-500/30 to-accent-500/30',
  },
]

const CATEGORIES = ['All', 'Music', 'Sports', 'Business', 'Comedy', 'Festivals']

export default function Home() {
  return (
    <div className="animate-fade-in">
      <ScreenHeader
        title="Discover"
        subtitle="What's pulsing in Zambia tonight"
        action={
          <span className="flex items-center gap-1 rounded-full bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300">
            <MapPin size={14} className="text-brand-400" /> Lusaka
          </span>
        }
      />

      <div className="space-y-6 px-5 py-5">
        <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
          {CATEGORIES.map((c, i) => (
            <button
              key={c}
              className={[
                'whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
                i === 0
                  ? 'bg-gradient-to-r from-brand-500 to-accent-500 text-white'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10',
              ].join(' ')}
            >
              {c}
            </button>
          ))}
        </div>

        <section>
          <div className="mb-3 flex items-center gap-2">
            <Flame size={18} className="text-orange-400" />
            <h2 className="text-lg font-semibold">Featured events</h2>
          </div>

          <div className="space-y-4">
            {FEATURED.map((evt) => (
              <article
                key={evt.id}
                className={`overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br ${evt.gradient} p-4 backdrop-blur`}
              >
                <div className="flex items-start justify-between">
                  <span className="rounded-full bg-black/30 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white/90">
                    {evt.tag}
                  </span>
                  <span className="rounded-full bg-black/30 px-2.5 py-1 text-sm font-bold text-brand-300">
                    {evt.price}
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-bold leading-tight">{evt.title}</h3>
                <div className="mt-3 space-y-1.5 text-sm text-slate-200">
                  <p className="flex items-center gap-2">
                    <MapPin size={15} className="text-brand-300" />
                    {evt.venue}, {evt.city}
                  </p>
                  <p className="flex items-center gap-2">
                    <CalendarDays size={15} className="text-brand-300" />
                    {evt.date}
                  </p>
                </div>
                <button className="mt-4 w-full rounded-2xl bg-white/10 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/20">
                  Get tickets
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
          <TrendingUp className="text-emerald-400" />
          <div>
            <p className="text-sm font-semibold">37 events near you this week</p>
            <p className="text-xs text-slate-400">
              Across Lusaka, Ndola, Kitwe &amp; Livingstone
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
