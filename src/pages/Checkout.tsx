import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Minus,
  Plus,
  ShieldCheck,
  Smartphone,
  CheckCircle2,
  Loader2,
} from 'lucide-react'
import type { EventItem } from '../data/types'
import { eventsRepository } from '../data/eventsRepository'
import { ticketsRepository } from '../data/ticketsRepository'
import { useAuth } from '../auth/useAuth'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { Skeleton } from '../components/ui/Skeleton'
import { formatMoney } from '../lib/format'

type Step = 'summary' | 'method' | 'otp' | 'processing' | 'success'

interface Provider {
  id: string
  name: string
  colors: string
  short: string
}

const PROVIDERS: Provider[] = [
  { id: 'airtel', name: 'Airtel Money', colors: 'bg-red-500', short: 'AM' },
  { id: 'mtn', name: 'MTN MoMo', colors: 'bg-yellow-400 text-slate-900', short: 'MTN' },
  { id: 'zampay', name: 'ZamPay', colors: 'bg-emerald-500', short: 'ZP' },
]

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
  const [provider, setProvider] = useState<Provider | null>(null)
  const [phone, setPhone] = useState(user?.phone ?? '')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState<string>()
  const [ticketCode, setTicketCode] = useState<string>()

  useEffect(() => {
    let active = true
    if (id) eventsRepository.get(id).then((e) => active && setEvent(e))
    return () => {
      active = false
    }
  }, [id])

  const total = useMemo(
    () => (event ? event.price * ticketType.multiplier * quantity : 0),
    [event, ticketType, quantity],
  )

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

  const sendOtp = () => {
    setError(undefined)
    if (!/^(\+?26)?0?9[5-7]\d{7}$/.test(phone.replace(/\s/g, ''))) {
      setError('Enter a valid Zambian mobile number (e.g. 097XXXXXXX).')
      return
    }
    setStep('otp')
  }

  const verifyOtp = async () => {
    setError(undefined)
    if (!/^\d{6}$/.test(otp)) {
      setError('Enter the 6-digit code sent to your phone.')
      return
    }
    setStep('processing')
    // Simulate mobile-money authorization latency.
    await new Promise((r) => setTimeout(r, 1600))
    const ticket = await ticketsRepository.create({
      userId: user!.id,
      event,
      type: ticketType.label,
      seat: ticketType.id === 'vip' ? 'VIP · Open' : 'General · Open',
      quantity,
      amountPaid: total,
    })
    setTicketCode(ticket.code)
    setStep('success')
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-slate-950 md:my-8 md:min-h-0 md:rounded-3xl md:border md:border-white/10 md:shadow-2xl">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
        {step !== 'success' && step !== 'processing' && (
          <button
            onClick={() => (step === 'summary' ? navigate(-1) : setStep('summary'))}
            aria-label="Back"
            className="rounded-full p-1.5 text-slate-300 hover:bg-white/10"
          >
            <ArrowLeft size={20} />
          </button>
        )}
        <div>
          <p className="text-xs text-slate-500">Checkout</p>
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
                    onClick={() => setTicketType(t)}
                    className={[
                      'flex w-full items-center justify-between rounded-2xl border px-4 py-3.5 text-left transition-colors',
                      ticketType.id === t.id
                        ? 'border-brand-400 bg-brand-500/10'
                        : 'border-white/10 bg-white/5 hover:bg-white/10',
                    ].join(' ')}
                  >
                    <span className="text-sm font-medium">{t.label}</span>
                    <span className="font-bold text-emerald-400">
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
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="rounded-full bg-white/10 p-1.5 hover:bg-white/20"
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} />
                </button>
                <span className="w-6 text-center font-bold">{quantity}</span>
                <button
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

            <Button fullWidth size="lg" onClick={() => setStep('method')}>
              Continue to payment
            </Button>
          </>
        )}

        {step === 'method' && (
          <>
            <div>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
                Mobile money
              </h2>
              <div className="space-y-3">
                {PROVIDERS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setProvider(p)}
                    className={[
                      'flex w-full items-center gap-3 rounded-2xl border px-4 py-3.5 text-left transition-colors',
                      provider?.id === p.id
                        ? 'border-brand-400 bg-brand-500/10'
                        : 'border-white/10 bg-white/5 hover:bg-white/10',
                    ].join(' ')}
                  >
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-xl text-xs font-bold text-white ${p.colors}`}
                    >
                      {p.short}
                    </span>
                    <span className="text-sm font-medium">{p.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <Input
              label="Mobile number"
              name="phone"
              type="tel"
              inputMode="tel"
              placeholder="097 000 0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              icon={<Smartphone size={16} />}
              error={error}
            />

            <Button fullWidth size="lg" disabled={!provider} onClick={sendOtp}>
              Pay {formatMoney(total, event.currency)}
            </Button>
            <p className="flex items-center justify-center gap-1.5 text-center text-xs text-slate-500">
              <ShieldCheck size={13} /> Secured by {provider?.name ?? 'mobile money'}
            </p>
          </>
        )}

        {step === 'otp' && (
          <div className="space-y-6">
            <div className="text-center">
              <span
                className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl text-sm font-bold text-white ${provider?.colors}`}
              >
                {provider?.short}
              </span>
              <h2 className="text-lg font-bold">Authorize payment</h2>
              <p className="mt-1 text-sm text-slate-400">
                Enter the 6-digit PIN sent to{' '}
                <span className="font-medium text-slate-200">{phone}</span> to approve{' '}
                {formatMoney(total, event.currency)}.
              </p>
            </div>

            <Input
              name="otp"
              inputMode="numeric"
              maxLength={6}
              placeholder="••••••"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              className="text-center text-2xl tracking-[0.5em]"
              error={error}
            />

            <p className="rounded-xl bg-white/5 px-3 py-2 text-center text-xs text-slate-500">
              Demo: use code <span className="font-mono text-brand-300">123456</span> (any
              6 digits works).
            </p>

            <Button fullWidth size="lg" onClick={verifyOtp}>
              Confirm &amp; pay
            </Button>
          </div>
        )}

        {step === 'processing' && (
          <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
            <Loader2 size={40} className="animate-spin text-brand-400" />
            <p className="text-sm text-slate-400">
              Authorizing with {provider?.name}…
            </p>
          </div>
        )}

        {step === 'success' && (
          <div className="flex flex-col items-center justify-center gap-5 py-16 text-center">
            <div className="animate-scale-in flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/15">
              <CheckCircle2 size={44} className="text-emerald-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Payment successful!</h2>
              <p className="mt-1 text-sm text-slate-400">
                {quantity} {ticketType.label} ticket{quantity > 1 ? 's' : ''} confirmed.
              </p>
              {ticketCode && (
                <p className="mt-2 font-mono text-xs text-brand-300">{ticketCode}</p>
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
