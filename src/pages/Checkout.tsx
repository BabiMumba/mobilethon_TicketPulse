import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Minus, Plus, CheckCircle2, Loader2, Ticket } from 'lucide-react'
import type { EventItem } from '../data/types'
import { eventsRepository } from '../data/eventsRepository'
import { ticketsRepository } from '../data/ticketsRepository'
import { useAuth } from '../auth/useAuth'
import Button from '../components/ui/Button'
import { Skeleton } from '../components/ui/Skeleton'
import { formatMoney, isFreeEvent } from '../lib/format'

type Step = 'summary' | 'processing' | 'success'

const TICKET_TYPES = [
  { id: 'general', label: 'General Admission', multiplier: 1 },
  { id: 'vip', label: 'VIP Experience', multiplier: 2 },
]

export default function Checkout() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [event, setEvent] = useState<EventItem | null | undefined>(undefined)
  const [step, setStep] = useState<Step>('summary')
  const [ticketType, setTicketType] = useState(TICKET_TYPES[0])
  const [quantity, setQuantity] = useState(1)
  const [error, setError] = useState<string>()
  const [ticketCode, setTicketCode] = useState<string>()

  useEffect(() => {
    let active = true
    if (id) eventsRepository.get(id).then((e) => active && setEvent(e))
    return () => {
      active = false
    }
  }, [id])

  const unitPrice = event ? event.price * ticketType.multiplier : 0
  const total = unitPrice * quantity
  const isFree = event ? isFreeEvent(event.price) : false

  const confirmBooking = async () => {
    if (!user || !event) return
    setError(undefined)
    setStep('processing')
    try {
      const ticket = await ticketsRepository.create({
        userId: user.id,
        event,
        type: ticketType.label,
        seat: ticketType.id === 'vip' ? 'VIP · Open' : 'General · Open',
        quantity,
        amountPaid: total,
      })
      setTicketCode(ticket.code)
      setStep('success')
    } catch {
      setError('Could not reserve your ticket. Please try again.')
      setStep('summary')
    }
  }

  if (event === undefined) {
    return (
      <div className="mx-auto max-w-md space-y-4 p-6">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-40 w-full" />
      </div>
    )
  }
  if (!event) {
    return <div className="p-8 text-center text-slate-400">Event not found.</div>
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-slate-950 md:my-8 md:min-h-0 md:rounded-3xl md:border md:border-white/10 md:shadow-2xl">
      <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
        {step !== 'success' && step !== 'processing' && (
          <button
            onClick={() => navigate(-1)}
            aria-label="Back"
            className="rounded-full p-1.5 text-slate-300 hover:bg-white/10"
          >
            <ArrowLeft size={20} />
          </button>
        )}
        <div>
          <p className="text-xs text-slate-500">Booking</p>
          <h1 className="text-base font-bold leading-tight">{event.title}</h1>
        </div>
      </div>

      <div className="animate-fade-in flex-1 space-y-6 p-5">
        {step === 'summary' && (
          <>
            <div>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
                Ticket type
              </h2>
              <div className="space-y-3">
                {TICKET_TYPES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTicketType(t)}
                    className={[
                      'flex w-full cursor-pointer items-center justify-between rounded-2xl border px-4 py-3.5 text-left transition-colors',
                      ticketType.id === t.id
                        ? 'border-accent-400 bg-accent-500/10'
                        : 'border-white/10 bg-white/5 hover:bg-white/10',
                    ].join(' ')}
                  >
                    <span className="text-sm font-medium">{t.label}</span>
                    <span className="font-bold text-accent-400">
                      {formatMoney(event.price * t.multiplier, event.currency)}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <span className="text-sm font-medium">Quantity</span>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="rounded-full bg-white/10 p-1.5 hover:bg-white/20"
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} />
                </button>
                <span className="w-6 text-center font-bold">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                  className="rounded-full bg-white/10 p-1.5 hover:bg-white/20"
                  aria-label="Increase quantity"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-white/10 pt-4">
              <span className="text-slate-400">Total</span>
              <span className="text-2xl font-bold text-white">
                {formatMoney(total, event.currency)}
              </span>
            </div>

            {!isFree && (
              <p className="rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-xs text-amber-200">
                Mobile money payment is not integrated yet — your ticket will be reserved
                for the demo.
              </p>
            )}

            {error && (
              <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </p>
            )}

            <Button fullWidth size="lg" leftIcon={<Ticket size={18} />} onClick={confirmBooking}>
              {isFree ? 'Get free ticket' : 'Reserve ticket'}
            </Button>
          </>
        )}

        {step === 'processing' && (
          <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
            <Loader2 size={40} className="animate-spin text-accent-400" />
            <p className="text-sm text-slate-400">Saving your ticket…</p>
          </div>
        )}

        {step === 'success' && (
          <div className="flex flex-col items-center justify-center gap-5 py-16 text-center">
            <div className="animate-scale-in flex h-20 w-20 items-center justify-center rounded-full bg-accent-500/15">
              <CheckCircle2 size={44} className="text-accent-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold">
                {isFree ? 'Ticket confirmed!' : 'Ticket reserved!'}
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                {quantity} {ticketType.label} ticket{quantity > 1 ? 's' : ''} for {event.title}.
              </p>
              {ticketCode && (
                <p className="mt-2 font-mono text-xs text-accent-300">{ticketCode}</p>
              )}
            </div>
            <Button fullWidth size="lg" variant="secondary" onClick={() => navigate('/tickets')}>
              View my tickets
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
