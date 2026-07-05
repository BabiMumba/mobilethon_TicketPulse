import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  Calendar,
  MapPin,
  QrCode,
  Search,
  Ticket,
} from 'lucide-react'
import Button from '../ui/Button'

const HERO_IMAGES = [
  {
    src: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80',
    alt: 'Festival crowd',
    className: 'col-span-2 row-span-2',
  },
  {
    src: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=600&q=80',
    alt: 'Live music',
    className: 'col-span-1 row-span-1',
  },
  {
    src: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=600&q=80',
    alt: 'Outdoor concert',
    className: 'col-span-1 row-span-1',
  },
]

const CITIES = ['Lusaka', 'Ndola', 'Kitwe', 'Livingstone'] as const

export default function LandingHero() {
  const navigate = useNavigate()

  return (
    <section className="relative overflow-hidden border-b border-white/5">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-accent-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-brand-600/15 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      <div className="relative mx-auto max-w-6xl px-5 pb-12 pt-8 md:px-6 md:pb-20 md:pt-14">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div>
            <div className="animate-fade-in-down inline-flex items-center gap-2 rounded-xl border border-accent-500/30 bg-accent-500/10 px-3 py-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-400" />
              </span>
              <span className="font-display text-xs uppercase tracking-widest text-accent-300">
                Live events from Supabase
              </span>
            </div>

            <h1 className="animate-fade-in-up mt-6 font-display text-4xl leading-[1.05] tracking-tight text-white delay-75 sm:text-5xl lg:text-[3.4rem]">
              Your night out starts{' '}
              <span className="text-accent-400">here.</span>
            </h1>

            <p className="animate-fade-in-up mt-5 max-w-lg text-base leading-relaxed text-slate-400 delay-150 md:text-lg">
              Discover concerts, sports and festivals across Zambia. Book free or
              paid events, get your QR pass instantly.
            </p>

            <div className="animate-fade-in-up mt-8 delay-300">
              <button
                type="button"
                onClick={() => navigate('/search')}
                className="group flex w-full max-w-md cursor-pointer items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3.5 text-left shadow-lg backdrop-blur transition-all hover:border-accent-500/40 hover:bg-slate-900"
              >
                <Search size={20} className="shrink-0 text-accent-400" />
                <span className="flex-1 text-sm text-slate-500 group-hover:text-slate-400">
                  Search events, venues, artists…
                </span>
                <span className="hidden rounded-lg bg-accent-500 px-3 py-1 text-xs font-semibold text-white sm:inline">
                  Search
                </span>
              </button>
            </div>

            <div className="animate-fade-in-up mt-6 flex flex-wrap gap-2 delay-300">
              {CITIES.map((city) => (
                <Link
                  key={city}
                  to={`/search?city=${city}`}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-sm font-medium text-slate-300 transition-colors hover:border-accent-500/30 hover:bg-accent-500/10 hover:text-white"
                >
                  <MapPin size={14} className="text-accent-400" />
                  {city}
                </Link>
              ))}
            </div>

            <div className="animate-fade-in-up mt-8 flex flex-wrap gap-3 delay-500">
              <Button
                size="lg"
                onClick={() => navigate('/search')}
                leftIcon={<Ticket size={18} />}
              >
                Find events
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/organizer')}
              >
                Host an event <ArrowRight size={18} />
              </Button>
            </div>
          </div>

          <div className="animate-scale-in relative">
            <div className="grid grid-cols-2 grid-rows-2 gap-3 md:gap-4">
              {HERO_IMAGES.map((img, i) => (
                <div
                  key={img.alt}
                  className={[
                    'relative overflow-hidden rounded-2xl border border-white/10 shadow-xl',
                    img.className,
                    i === 0 ? 'min-h-[220px] md:min-h-[320px]' : 'min-h-[100px] md:min-h-[150px]',
                  ].join(' ')}
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                </div>
              ))}
            </div>

            <div className="absolute -bottom-4 -left-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/95 px-4 py-3 shadow-2xl backdrop-blur md:-left-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-500/20">
                <Ticket size={20} className="text-accent-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Free & paid</p>
                <p className="text-xs text-slate-400">Events from ZMW 0</p>
              </div>
            </div>

            <div className="absolute -right-2 top-6 flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/95 px-4 py-3 shadow-2xl backdrop-blur md:-right-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/20">
                <QrCode size={20} className="text-brand-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">QR tickets</p>
                <p className="text-xs text-slate-400">Instant confirmation</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function HowItWorks() {
  const steps = [
    {
      icon: Search,
      title: 'Discover',
      body: 'Browse real events stored in Supabase — filter by city or category.',
    },
    {
      icon: Ticket,
      title: 'Book',
      body: 'Free events are instant. Paid events are reserved (payment coming soon).',
    },
    {
      icon: Calendar,
      title: 'Show your QR',
      body: 'Your ticket appears in My Tickets with a scannable QR code.',
    },
  ]

  return (
    <section className="border-b border-white/5 bg-slate-950/50 py-14 md:py-20">
      <div className="mx-auto max-w-6xl px-5 md:px-6">
        <div className="mb-10 text-center md:mb-14">
          <p className="font-display text-sm uppercase tracking-widest text-accent-400">
            How it works
          </p>
          <h2 className="mt-2 font-display text-2xl text-white md:text-4xl">
            Three steps to your event
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3 md:gap-8">
          {steps.map(({ icon: Icon, title, body }, i) => (
            <div
              key={title}
              className="group relative rounded-3xl border border-white/10 bg-slate-900/60 p-6 transition-all hover:-translate-y-1 hover:border-accent-500/30 hover:shadow-glow-emerald md:p-8"
            >
              <span className="absolute right-6 top-6 font-display text-4xl font-bold text-white/5">
                0{i + 1}
              </span>
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-500/15 text-accent-400 transition-colors group-hover:bg-accent-500 group-hover:text-white">
                <Icon size={22} />
              </div>
              <h3 className="text-lg font-bold text-white">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
