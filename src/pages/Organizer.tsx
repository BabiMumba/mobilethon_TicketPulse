import { Plus, Ticket, DollarSign, Users } from 'lucide-react'
import ScreenHeader from '../components/ScreenHeader'
import PageContainer from '../components/PageContainer'
import Button from '../components/ui/Button'

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
  { label: 'Attendees', value: '1,102', icon: Users, tint: 'text-brand-300' },
]

export default function Organizer() {
  return (
    <div className="animate-fade-in">
      <ScreenHeader
        title="Organizer Dashboard"
        subtitle="Create events and track sales"
        action={
          <Button size="sm" leftIcon={<Plus size={15} />}>
            New event
          </Button>
        }
      />

      <PageContainer className="space-y-6 px-5 py-5">
        <div className="grid grid-cols-3 gap-3 md:max-w-2xl">
          {STATS.map(({ label, value, icon: Icon, tint }) => (
            <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-3 md:p-5">
              <Icon size={18} className={tint} />
              <p className="mt-2 text-base font-bold leading-none md:text-2xl">{value}</p>
              <p className="mt-1 text-[11px] text-slate-400 md:text-sm">{label}</p>
            </div>
          ))}
        </div>

        <section className="rounded-3xl border border-white/10 bg-slate-800/60 p-5 md:max-w-2xl">
          <h2 className="text-sm font-semibold text-slate-200">Sales this week</h2>
          <p className="text-xs text-slate-400">Daily tickets sold</p>

          <div className="mt-5 flex h-40 items-end justify-between gap-2 md:h-56">
            {SALES.map((s) => (
              <div key={s.day} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex w-full flex-1 items-end">
                  <div
                    className="w-full rounded-t-lg bg-gradient-to-t from-brand-500 to-emerald-500 transition-all"
                    style={{ height: `${s.value}%` }}
                    title={`${s.day}: ${s.value}%`}
                  />
                </div>
                <span className="text-[11px] text-slate-400">{s.day}</span>
              </div>
            ))}
          </div>
        </section>

        <Button variant="outline" fullWidth className="md:max-w-2xl">
          View full analytics
        </Button>
      </PageContainer>
    </div>
  )
}
