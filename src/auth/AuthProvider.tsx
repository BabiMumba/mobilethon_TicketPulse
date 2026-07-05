import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { AuthError } from '@supabase/supabase-js'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { profilesRepository } from '../data/profilesRepository'
import { AuthContext } from './context'
import { mockAuth } from './mockAuth'
import type { AuthResult, AuthUser } from './types'

function authErrorMessage(error: AuthError): string {
  if (error.message?.trim()) return error.message
  const code = (error as AuthError & { code?: string }).code
  if (code === 'unexpected_failure') {
    return 'Unable to create your account. Please try again or contact support.'
  }
  return 'Authentication failed. Please try again.'
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    if (supabase) {
      supabase.auth.getSession().then(({ data }) => {
        if (!active) return
        const u = data.session?.user
        setUser(u ? { id: u.id, email: u.email ?? undefined, phone: u.phone ?? undefined } : null)
        setLoading(false)
      })
      const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
        const u = session?.user
        if (u) {
          const meta = u.user_metadata as { full_name?: string; name?: string; phone?: string }
          await profilesRepository.upsert({
            id: u.id,
            fullName: meta.full_name ?? meta.name ?? u.email?.split('@')[0] ?? 'User',
            email: u.email ?? '',
            phone: meta.phone ?? u.phone ?? undefined,
          })
        }
        setUser(u ? { id: u.id, email: u.email ?? undefined, phone: u.phone ?? undefined } : null)
      })
      return () => {
        active = false
        sub.subscription.unsubscribe()
      }
    }

    // Mock backend
    setUser(mockAuth.current())
    setLoading(false)
    return () => {
      active = false
    }
  }, [])

  const signInWithPassword = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      if (supabase) {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        return error ? { ok: false, error: authErrorMessage(error) } : { ok: true }
      }
      const res = await mockAuth.signInWithPassword(email, password)
      if (res.ok) setUser(mockAuth.current())
      return res
    },
    [],
  )

  const signUp = useCallback(
    async (input: {
      email: string
      password: string
      name: string
      phone?: string
    }): Promise<AuthResult> => {
      if (supabase) {
        const { data, error } = await supabase.auth.signUp({
          email: input.email,
          password: input.password,
          options: { data: { full_name: input.name, phone: input.phone } },
        })
        if (error) return { ok: false, error: authErrorMessage(error) }

        // Backup profile row if trigger succeeded but metadata differs
        if (data.user) {
          await profilesRepository.upsert({
            id: data.user.id,
            fullName: input.name,
            email: input.email,
            phone: input.phone,
          })
        }
        return { ok: true, needsEmailConfirmation: Boolean(data.user && !data.session) }
      }
      const res = await mockAuth.signUp(input)
      if (res.ok) setUser(mockAuth.current())
      return res
    },
    [],
  )

  const startPhoneOtp = useCallback(async (phone: string): Promise<AuthResult> => {
    if (supabase) {
      const { error } = await supabase.auth.signInWithOtp({ phone })
      return error ? { ok: false, error: authErrorMessage(error) } : { ok: true }
    }
    return mockAuth.startPhoneOtp()
  }, [])

  const verifyPhoneOtp = useCallback(
    async (phone: string, code: string): Promise<AuthResult> => {
      if (supabase) {
        const { error } = await supabase.auth.verifyOtp({ phone, token: code, type: 'sms' })
        return error ? { ok: false, error: authErrorMessage(error) } : { ok: true }
      }
      const res = await mockAuth.verifyPhoneOtp(phone, code)
      if (res.ok) setUser(mockAuth.current())
      return res
    },
    [],
  )

  const signOut = useCallback(async (): Promise<void> => {
    if (supabase) {
      await supabase.auth.signOut()
      return
    }
    await mockAuth.signOut()
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      loading,
      usingSupabase: isSupabaseConfigured,
      signInWithPassword,
      signUp,
      startPhoneOtp,
      verifyPhoneOtp,
      signOut,
    }),
    [user, loading, signInWithPassword, signUp, startPhoneOtp, verifyPhoneOtp, signOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
