import { useEffect, useState } from 'react'
import { CheckCircle2, Loader2, Mail } from 'lucide-react'
import Confetti from '../ui/Confetti'
import Button from '../ui/Button'

interface RegisterSuccessProps {
  name: string
  needsEmailConfirmation?: boolean
  onContinue: () => void
}

export default function RegisterSuccess({
  name,
  needsEmailConfirmation,
  onContinue,
}: RegisterSuccessProps) {
  const [progress, setProgress] = useState(0)
  const redirectSeconds = 3

  useEffect(() => {
    if (needsEmailConfirmation) return

    const start = Date.now()
    const duration = redirectSeconds * 1000
    const tick = window.setInterval(() => {
      const elapsed = Date.now() - start
      setProgress(Math.min(100, (elapsed / duration) * 100))
      if (elapsed >= duration) {
        window.clearInterval(tick)
        onContinue()
      }
    }, 50)
    return () => window.clearInterval(tick)
  }, [needsEmailConfirmation, onContinue])

  return (
    <>
      <Confetti active />
      <div className="fixed inset-0 z-[190] flex items-center justify-center bg-slate-950/85 p-6 backdrop-blur-sm">
        <div className="animate-scale-in w-full max-w-sm rounded-3xl border border-white/10 bg-slate-900 p-8 text-center shadow-2xl">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-accent-500/15">
            {needsEmailConfirmation ? (
              <Mail size={40} className="text-accent-400" />
            ) : (
              <CheckCircle2 size={44} className="text-accent-400" />
            )}
          </div>

          <h2 className="mt-6 font-display text-2xl text-white">
            {needsEmailConfirmation ? 'Almost there!' : 'Welcome aboard!'}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">
            {needsEmailConfirmation ? (
              <>
                Hi <span className="font-semibold text-white">{name}</span> — we sent a
                confirmation link to your inbox. Click it, then log in.
              </>
            ) : (
              <>
                Account created for{' '}
                <span className="font-semibold text-white">{name}</span>. You&apos;re ready
                to discover events across Zambia.
              </>
            )}
          </p>

          {needsEmailConfirmation ? (
            <Button className="mt-8" fullWidth size="lg" onClick={onContinue}>
              Go to login
            </Button>
          ) : (
            <div className="mt-8 space-y-3">
              <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-accent-500 to-brand-500 transition-[width] duration-100 ease-linear"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-slate-500">
                Redirecting to home in {redirectSeconds}s…
              </p>
              <Button variant="ghost" size="sm" onClick={onContinue}>
                Continue now
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

interface RegisterLoadingProps {
  message: string
}

export function RegisterLoading({ message }: RegisterLoadingProps) {
  return (
    <div className="fixed inset-0 z-[180] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm">
      <div className="animate-fade-in flex flex-col items-center gap-4 rounded-3xl border border-white/10 bg-slate-900 px-10 py-8 shadow-2xl">
        <Loader2 size={40} className="animate-spin text-accent-400" />
        <div className="text-center">
          <p className="font-semibold text-white">{message}</p>
          <p className="mt-1 text-sm text-slate-500">This only takes a moment…</p>
        </div>
      </div>
    </div>
  )
}
