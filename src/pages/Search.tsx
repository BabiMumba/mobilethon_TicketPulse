import { useState } from 'react'
import { Search as SearchIcon, SlidersHorizontal, MapPin } from 'lucide-react'
import ScreenHeader from '../components/ScreenHeader'

const CITIES = ['Lusaka', 'Ndola', 'Kitwe', 'Livingstone']
const CATEGORIES = ['Music', 'Sports', 'Business', 'Comedy', 'Festivals', 'Theatre']

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [activeCity, setActiveCity] = useState<string>('Lusaka')
  const [activeCategories, setActiveCategories] = useState<string[]>([])

  const toggleCategory = (c: string) =>
    setActiveCategories((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c],
    )

  return (
    <div className="animate-fade-in">
      <ScreenHeader title="Search" subtitle="Advanced filters across Zambia" />

      <div className="space-y-6 px-5 py-5">
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
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
              City
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {CITIES.map((city) => (
              <button
                key={city}
                onClick={() => setActiveCity(city)}
                className={[
                  'rounded-2xl border px-4 py-3 text-sm font-medium transition-colors',
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
            <SlidersHorizontal size={16} className="text-accent-500" />
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
                  onClick={() => toggleCategory(c)}
                  className={[
                    'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
                    active
                      ? 'bg-gradient-to-r from-brand-500 to-accent-500 text-white'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10',
                  ].join(' ')}
                >
                  {c}
                </button>
              )
            })}
          </div>
        </section>

        <button className="w-full rounded-2xl bg-gradient-to-r from-brand-500 to-accent-500 py-3.5 text-sm font-semibold text-white shadow-glow transition-transform active:scale-[0.98]">
          Show results in {activeCity}
          {activeCategories.length > 0 && ` • ${activeCategories.length} filters`}
        </button>
      </div>
    </div>
  )
}
