import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { WifiOff, MapPin, CalendarDays, CheckCircle2, TicketX } from 'lucide-react'
import type { Ticket } from '../data/types'
import { ticketsRepository } from '../data/ticketsRepository'
import { useAuth } from '../auth/useAuth'
import ScreenHeader from '../components/ScreenHeader'
import PageContainer from '../components/PageContainer'
import TicketQR from '../components/TicketQR'
import { Skeleton } from '../components/ui/Skeleton'
import Button from '../components/ui/Button'
import { formatEventDate, formatMoney } from '../lib/format'

export default function MyTickets() {
  const { user } = useAuth()
  const [tickets, setTickets] = useState<Ticket[] | null>(null)

  useEffect(() => {
    let active = true
    if (user) {
      ticketsRepository.listForUser(user.id).then((t) => active && setTickets(t))
    }
    return () => {
      active = false
    }
  }, [user])

  return (
    <div className="animate-fade-in">
      <ScreenHeader
        title="My Tickets"
        subtitle="Your passes work offline"
        action={
          <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1.5 text-xs font-medium text-emerald-300">
            <WifiOff size={14} /> Offline ready
          </span>
        }
      />

      <PageContainer className="space-y-5 px-5 py-5">
        <p className="flex items-center gap-2 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          <CheckCircle2 size={18} className="shrink-0" />
          Passes &amp; QR codes are cached on this device — scan at the gate even with
          no signal.
        </p>

        {tickets === null && (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <Skeleton key={i} className="h-72 w-full" />
            ))}
          </div>
        )}

        {tickets?.length === 0 && (
          <div className="flex flex-col items-center gap-4 rounded-3xl border border-white/10 bg-white/5 py-16 text-center">
            <TicketX size={36} className="text-slate-500" />
            <div>
              <p className="font-semibold">No tickets yet</p>
              <p className="mt-1 text-sm text-slate-400">
                Book an event and your pass will appear here.
              </p>
            </div>
            <Link to="/search">
              <Button size="sm">Browse events</Button>
            </Link>
          </div>
        )}

        {tickets && tickets.length > 0 && (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {tickets.map((t) => (
              <article
                key={t.id}
                className="overflow-hidden rounded-3xl border border-white/10 bg-slate-800/60"
              >
                <div className="bg-gradient-to-r from-brand-500/20 to-emerald-500/20 px-5 py-4">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-black/30 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-brand-300">
                      {t.type}
                    </span>
                    <span className="font-mono text-xs text-slate-300">{t.code}</span>
                  </div>
                  <h3 className="mt-3 text-lg font-bold leading-tight">{t.event.title}</h3>
                  <div className="mt-2 space-y-1 text-sm text-slate-200">
                    <p className="flex items-center gap-2">
                      <MapPin size={15} className="text-brand-300" />
                      {t.event.venue}, {t.event.city}
                    </p>
                    <p className="flex items-center gap-2">
                      <CalendarDays size={15} className="text-brand-300" />
                      {formatEventDate(t.event.date)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-3 border-t border-dashed border-white/15 px-5 py-5">
                  <TicketQR ticket={t} />
                  <div className="flex items-center justify-between gap-4 text-sm text-slate-300">
                    <span>{t.seat}</span>
                    <span className="text-slate-500">·</span>
                    <span>
                      {t.quantity} × · {formatMoney(t.amountPaid, t.currency)}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </PageContainer>
    </div>
  )
}
