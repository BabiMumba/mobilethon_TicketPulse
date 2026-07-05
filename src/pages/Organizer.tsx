import { Plus, Ticket, DollarSign, Users } from 'lucide-react'
import ScreenHeader from '../components/ScreenHeader'

const SALES = [
  { day: 'Mon', value: 40 },
  { day: 'Tue', value: 65 },
  { day: 'Wed', value: 50 },
  { day: 'Thu', value: 80 },
  { day: 'Fri', value: 95 },
  { day: 'Sat', value: 100 },
  { day: 'Sun', value: 72 },
]

const STATS = [
  { label: 'Tickets sold', value: '1,284', icon: Ticket, tint: 'text-brand-400' },
  { label: 'Revenue', value: 'ZMW 312k', icon: DollarSign, tint: 'text-emerald-400' },
  { label: 'Attendees', value: '1,102', icon: Users, tint: 'text-accent-500' },
]

export default function Organizer() {
  return (
    <div className="animate-fade-in">
      <ScreenHeader
        title="Organizer"
        subtitle="Create events and track sales"
        action={
          <button className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-brand-500 to-accent-500 px-3.5 py-2 text-xs font-semibold text-white shadow-glow">
            <Plus size={15} /> New event
          </button>
        }
      />

      <div className="space-y-6 px-5 py-5">
        <div className="grid grid-cols-3 gap-3">
          {STATS.map(({ label, value, icon: Icon, tint }) => (
            <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <Icon size={18} className={tint} />
              <p className="mt-2 text-base font-bold leading-none">{value}</p>
              <p className="mt-1 text-[11px] text-slate-400">{label}</p>
            </div>
          ))}
        </div>

        <section className="rounded-3xl border border-white/10 bg-slate-800/60 p-5">
          <h2 className="text-sm font-semibold text-slate-200">Sales this week</h2>
          <p className="text-xs text-slate-400">Daily tickets sold</p>

          <div className="mt-5 flex h-40 items-end justify-between gap-2">
            {SALES.map((s) => (
              <div key={s.day} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex w-full flex-1 items-end">
                  <div
                    className="w-full rounded-t-lg bg-gradient-to-t from-brand-500 to-accent-500 transition-all"
                    style={{ height: `${s.value}%` }}
                    title={`${s.day}: ${s.value}%`}
                  />
                </div>
                <span className="text-[11px] text-slate-400">{s.day}</span>
              </div>
            ))}
          </div>
        </section>

        <button className="w-full rounded-2xl border border-white/10 bg-white/5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10">
          View full analytics
        </button>
      </div>
    </div>
  )
}
