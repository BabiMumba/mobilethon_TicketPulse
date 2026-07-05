import {
  User,
  Bell,
  CreditCard,
  Globe,
  ShieldCheck,
  ChevronRight,
  LogOut,
} from 'lucide-react'
import ScreenHeader from '../components/ScreenHeader'

const SETTINGS = [
  { label: 'Notifications', icon: Bell },
  { label: 'Payment methods', icon: CreditCard },
  { label: 'Language & region', icon: Globe },
  { label: 'Privacy & security', icon: ShieldCheck },
]

export default function Profile() {
  return (
    <div className="animate-fade-in">
      <ScreenHeader title="Profile" subtitle="Manage your account" />

      <div className="space-y-6 px-5 py-5">
        <section className="flex items-center gap-4 rounded-3xl border border-white/10 bg-gradient-to-br from-brand-500/15 to-accent-500/15 p-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-accent-500 text-2xl font-bold">
            CZ
          </div>
          <div>
            <h2 className="text-lg font-bold">Chanda Zulu</h2>
            <p className="text-sm text-slate-400">chanda.zulu@example.zm</p>
            <span className="mt-1 inline-block rounded-full bg-brand-500/20 px-2.5 py-0.5 text-[11px] font-medium text-brand-300">
              Lusaka, Zambia
            </span>
          </div>
        </section>

        <section className="overflow-hidden rounded-3xl border border-white/10 bg-slate-800/60">
          {SETTINGS.map(({ label, icon: Icon }, i) => (
            <button
              key={label}
              className={[
                'flex w-full items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-white/5',
                i !== SETTINGS.length - 1 ? 'border-b border-white/10' : '',
              ].join(' ')}
            >
              <Icon size={18} className="text-brand-400" />
              <span className="flex-1 text-sm font-medium">{label}</span>
              <ChevronRight size={16} className="text-slate-500" />
            </button>
          ))}
        </section>

        <button className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-500/30 bg-red-500/10 py-3.5 text-sm font-semibold text-red-300 transition-colors hover:bg-red-500/20">
          <LogOut size={16} /> Sign out
        </button>

        <p className="flex items-center justify-center gap-1.5 text-center text-xs text-slate-500">
          <User size={12} /> TicketPulse Zambia • v0.1.0
        </p>
      </div>
    </div>
  )
}
