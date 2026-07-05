import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Mail, Lock, Smartphone } from 'lucide-react'
import { useAuth } from '../auth/useAuth'
import AuthShell from '../components/AuthShell'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

type Mode = 'email' | 'phone'

export default function Login() {
  const { signInWithPassword, startPhoneOtp, verifyPhoneOtp } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string })?.from ?? '/'

  const [mode, setMode] = useState<Mode>('email')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState('')
  const [error, setError] = useState<string>()
  const [loading, setLoading] = useState(false)

  const done = () => navigate(from, { replace: true })

  const submitEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(undefined)
    setLoading(true)
    const res = await signInWithPassword(email, password)
    setLoading(false)
    if (res.ok) done()
    else setError(res.error)
  }

  const submitPhone = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(undefined)
    setLoading(true)
    if (!otpSent) {
      const res = await startPhoneOtp(phone)
      setLoading(false)
      if (res.ok) setOtpSent(true)
      else setError(res.error)
      return
    }
    const res = await verifyPhoneOtp(phone, otp)
    setLoading(false)
    if (res.ok) done()
    else setError(res.error)
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to access your tickets and events."
      footer={
        <>
          New to TicketPulse?{' '}
          <Link to="/register" className="font-semibold text-brand-400 hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <div className="mb-5 grid grid-cols-2 gap-1 rounded-2xl bg-white/5 p-1">
        {(['email', 'phone'] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => {
              setMode(m)
              setError(undefined)
            }}
            className={[
              'rounded-xl py-2 text-sm font-medium capitalize transition-colors',
              mode === m ? 'bg-brand-500 text-white' : 'text-slate-300 hover:text-white',
            ].join(' ')}
          >
            {m === 'email' ? 'Email' : 'Phone number'}
          </button>
        ))}
      </div>

      {mode === 'email' ? (
        <form onSubmit={submitEmail} className="space-y-4">
          <Input
            label="Email"
            name="email"
            type="email"
            required
            placeholder="you@example.zm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail size={16} />}
          />
          <Input
            label="Password"
            name="password"
            type="password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Lock size={16} />}
            error={error}
          />
          <Button type="submit" fullWidth size="lg" loading={loading}>
            Log in
          </Button>
        </form>
      ) : (
        <form onSubmit={submitPhone} className="space-y-4">
          <Input
            label="Mobile number"
            name="phone"
            type="tel"
            required
            disabled={otpSent}
            placeholder="097 000 0000"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            icon={<Smartphone size={16} />}
          />
          {otpSent && (
            <Input
              label="Verification code"
              name="otp"
              inputMode="numeric"
              maxLength={6}
              placeholder="Enter 6-digit code (123456)"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              error={error}
            />
          )}
          {!otpSent && error && <p className="text-xs text-red-400">{error}</p>}
          <Button type="submit" fullWidth size="lg" loading={loading}>
            {otpSent ? 'Verify & log in' : 'Send code'}
          </Button>
        </form>
      )}
    </AuthShell>
  )
}
