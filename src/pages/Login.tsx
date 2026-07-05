import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Mail, Lock } from 'lucide-react'
import { useAuth } from '../auth/useAuth'
import AuthShell from '../components/AuthShell'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

export default function Login() {
  const { signInWithPassword } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string })?.from ?? '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string>()
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(undefined)
    setLoading(true)
    const res = await signInWithPassword(email, password)
    setLoading(false)
    if (res.ok) navigate(from, { replace: true })
    else setError(res.error)
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in with your email and password."
      footer={
        <>
          New to TicketPulse?{' '}
          <Link to="/register" className="font-semibold text-brand-400 hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <Input
          label="Email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={<Mail size={16} />}
        />
        <Input
          label="Password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={<Lock size={16} />}
        />
        {error && (
          <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </p>
        )}
        <Button type="submit" fullWidth size="lg" loading={loading}>
          Log in
        </Button>
      </form>
    </AuthShell>
  )
}
