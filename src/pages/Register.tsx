import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Mail, Lock, Smartphone, User } from 'lucide-react'
import { useAuth } from '../auth/useAuth'
import AuthShell from '../components/AuthShell'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

export default function Register() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string })?.from ?? '/'

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string>()
  const [success, setSuccess] = useState<string>()
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(undefined)
    setSuccess(undefined)
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    setLoading(true)
    const res = await signUp({ name, email, password, phone: phone || undefined })
    setLoading(false)
    if (res.ok) {
      if (res.needsEmailConfirmation) {
        setSuccess('Account created! Check your email to confirm, then log in.')
        return
      }
      navigate(from, { replace: true })
    } else setError(res.error)
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Join TicketPulse and never miss an event in Zambia."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-brand-400 hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <Input
          label="Full name"
          name="name"
          required
          placeholder="Chanda Zulu"
          value={name}
          onChange={(e) => setName(e.target.value)}
          icon={<User size={16} />}
        />
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
          label="Mobile number (optional)"
          name="phone"
          type="tel"
          placeholder="097 000 0000"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          icon={<Smartphone size={16} />}
        />
        <Input
          label="Password"
          name="password"
          type="password"
          required
          placeholder="At least 6 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={<Lock size={16} />}
        />
        {success && (
          <p className="rounded-xl border border-accent-500/30 bg-accent-500/10 px-4 py-3 text-sm text-accent-200">
            {success}
          </p>
        )}
        {error && (
          <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </p>
        )}
        <Button type="submit" fullWidth size="lg" loading={loading}>
          Create account
        </Button>
      </form>
    </AuthShell>
  )
}
