import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { AuthContext } from './context'
import { mockAuth } from './mockAuth'
import type { AuthResult, AuthUser } from './types'

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
      const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
        const u = session?.user
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
        return error ? { ok: false, error: error.message } : { ok: true }
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
        const { error } = await supabase.auth.signUp({
          email: input.email,
          password: input.password,
          options: { data: { full_name: input.name, phone: input.phone } },
        })
        return error ? { ok: false, error: error.message } : { ok: true }
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
      return error ? { ok: false, error: error.message } : { ok: true }
    }
    return mockAuth.startPhoneOtp()
  }, [])

  const verifyPhoneOtp = useCallback(
    async (phone: string, code: string): Promise<AuthResult> => {
      if (supabase) {
        const { error } = await supabase.auth.verifyOtp({ phone, token: code, type: 'sms' })
        return error ? { ok: false, error: error.message } : { ok: true }
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
