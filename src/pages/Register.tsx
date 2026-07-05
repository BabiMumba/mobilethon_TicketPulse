import { useCallback, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Mail, Lock, User } from 'lucide-react'
import { useAuth } from '../auth/useAuth'
import AuthShell from '../components/AuthShell'
import RegisterSuccess, { RegisterLoading } from '../components/auth/RegisterSuccess'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

type Phase = 'form' | 'loading' | 'success'

const MIN_LOADING_MS = 1400

function wait(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

export default function Register() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string })?.from ?? '/'

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string>()
  const [phase, setPhase] = useState<Phase>('form')
  const [loadingMessage, setLoadingMessage] = useState('Creating your account…')
  const [needsEmailConfirmation, setNeedsEmailConfirmation] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(undefined)
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setPhase('loading')
    setLoadingMessage('Creating your account…')

    const started = Date.now()
    const res = await signUp({ name, email, password })

    if (res.ok && !res.needsEmailConfirmation) {
      setLoadingMessage('Setting up your profile…')
    }

    const elapsed = Date.now() - started
    if (elapsed < MIN_LOADING_MS) {
      await wait(MIN_LOADING_MS - elapsed)
    }

    if (res.ok) {
      setNeedsEmailConfirmation(Boolean(res.needsEmailConfirmation))
      setPhase('success')
      return
    }

    setPhase('form')
    setError(res.error)
  }

  const goHome = useCallback(() => navigate(from, { replace: true }), [navigate, from])
  const goLogin = useCallback(() => navigate('/login', { replace: true }), [navigate])

  return (
    <>
      {phase === 'loading' && <RegisterLoading message={loadingMessage} />}

      {phase === 'success' && (
        <RegisterSuccess
          name={name}
          needsEmailConfirmation={needsEmailConfirmation}
          onContinue={needsEmailConfirmation ? goLogin : goHome}
        />
      )}

      <AuthShell
        title="Create your account"
        subtitle="Email and password — that's all you need."
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
            disabled={phase !== 'form'}
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
            autoComplete="email"
            disabled={phase !== 'form'}
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
            autoComplete="new-password"
            disabled={phase !== 'form'}
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Lock size={16} />}
          />
          {error && (
            <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </p>
          )}
          <Button
            type="submit"
            fullWidth
            size="lg"
            loading={phase === 'loading'}
            disabled={phase !== 'form'}
          >
            Create account
          </Button>
        </form>
      </AuthShell>
    </>
  )
}
