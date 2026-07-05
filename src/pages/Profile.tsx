import { useNavigate } from 'react-router-dom'
import {
  Bell,
  CreditCard,
  Globe,
  ShieldCheck,
  ChevronRight,
  LogOut,
  Database,
} from 'lucide-react'
import { useAuth } from '../auth/useAuth'
import ScreenHeader from '../components/ScreenHeader'
import PageContainer from '../components/PageContainer'
import Button from '../components/ui/Button'

const SETTINGS = [
  { label: 'Notifications', icon: Bell },
  { label: 'Payment methods', icon: CreditCard },
  { label: 'Language & region', icon: Globe },
  { label: 'Privacy & security', icon: ShieldCheck },
]

export default function Profile() {
  const { user, signOut, usingSupabase } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const displayName = user?.name || user?.email || user?.phone || 'Member'
  const initials = displayName.slice(0, 2).toUpperCase()

  return (
    <div className="animate-fade-in">
      <ScreenHeader title="Profile" subtitle="Manage your account" />

      <PageContainer className="space-y-6 px-5 py-5 md:max-w-2xl">
        <section className="flex items-center gap-4 rounded-3xl border border-white/10 bg-gradient-to-br from-brand-500/15 to-emerald-500/15 p-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-emerald-500 text-2xl font-bold">
            {initials}
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-lg font-bold">{displayName}</h2>
            {user?.email && <p className="truncate text-sm text-slate-400">{user.email}</p>}
            {user?.phone && <p className="text-sm text-slate-400">{user.phone}</p>}
          </div>
        </section>

        <section className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-slate-400">
          <Database size={14} className={usingSupabase ? 'text-emerald-400' : 'text-amber-400'} />
          {usingSupabase
            ? 'Connected to Supabase.'
            : 'Running on the local mock backend — set Supabase env vars to sync.'}
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

        <Button
          variant="outline"
          fullWidth
          leftIcon={<LogOut size={16} />}
          className="border-red-500/30 bg-red-500/10 text-red-300 hover:bg-red-500/20"
          onClick={handleSignOut}
        >
          Sign out
        </Button>

        <p className="text-center text-xs text-slate-500">TicketPulse Zambia • v0.2.0</p>
      </PageContainer>
    </div>
  )
}
