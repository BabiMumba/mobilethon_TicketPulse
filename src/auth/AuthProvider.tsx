import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { AuthError, User } from '@supabase/supabase-js'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { profilesRepository } from '../data/profilesRepository'
import { authErrorMessage, normalizeEmail } from './authErrors'
import { AuthContext } from './context'
import { mockAuth } from './mockAuth'
import type { AuthResult, AuthUser } from './types'

function mapUser(u: User): AuthUser {
  const meta = u.user_metadata as { full_name?: string; name?: string }
  return {
    id: u.id,
    email: u.email ?? undefined,
    name: meta.full_name ?? meta.name ?? u.email?.split('@')[0],
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  const syncProfile = useCallback(async (u: User) => {
    const meta = u.user_metadata as { full_name?: string; name?: string }
    await profilesRepository.upsert({
      id: u.id,
      fullName: meta.full_name ?? meta.name ?? u.email?.split('@')[0] ?? 'User',
      email: u.email ?? '',
    })
  }, [])

  useEffect(() => {
    let active = true

    if (supabase) {
      supabase.auth.getSession().then(({ data }) => {
        if (!active) return
        const u = data.session?.user
        if (u) syncProfile(u)
        setUser(u ? mapUser(u) : null)
        setLoading(false)
      })
      const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
        const u = session?.user
        if (u) await syncProfile(u)
        setUser(u ? mapUser(u) : null)
      })
      return () => {
        active = false
        sub.subscription.unsubscribe()
      }
    }

    setUser(mockAuth.current())
    setLoading(false)
    return () => {
      active = false
    }
  }, [syncProfile])

  const signInWithPassword = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      const normalized = normalizeEmail(email)
      if (supabase) {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: normalized,
            password,
          })
          if (error) return { ok: false, error: authErrorMessage(error) }
          if (data.user) {
            await syncProfile(data.user)
            setUser(mapUser(data.user))
          }
          return { ok: true }
        } catch (err) {
          const message =
            err instanceof Error ? err.message : 'Authentication failed. Please try again.'
          return {
            ok: false,
            error: authErrorMessage({ message, name: 'AuthError', status: 0 } as AuthError),
          }
        }
      }
      const res = await mockAuth.signInWithPassword(normalized, password)
      if (res.ok) setUser(mockAuth.current())
      return res
    },
    [syncProfile],
  )

  const signUp = useCallback(
    async (input: { email: string; password: string; name: string }): Promise<AuthResult> => {
      const normalized = normalizeEmail(input.email)
      if (supabase) {
        try {
          const { data, error } = await supabase.auth.signUp({
            email: normalized,
            password: input.password,
            options: { data: { full_name: input.name } },
          })
          if (error) return { ok: false, error: authErrorMessage(error) }

          if (data.user && data.session) {
            await profilesRepository.upsert({
              id: data.user.id,
              fullName: input.name,
              email: normalized,
            })
            setUser(mapUser(data.user))
          }
          return { ok: true, needsEmailConfirmation: Boolean(data.user && !data.session) }
        } catch (err) {
          const message =
            err instanceof Error ? err.message : 'Registration failed. Please try again.'
          return {
            ok: false,
            error: authErrorMessage({ message, name: 'AuthError', status: 0 } as AuthError),
          }
        }
      }
      const res = await mockAuth.signUp({ ...input, email: normalized })
      if (res.ok) setUser(mockAuth.current())
      return res
    },
    [],
  )

  const signOut = useCallback(async (): Promise<void> => {
    if (supabase) {
      await supabase.auth.signOut()
      setUser(null)
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
      signOut,
    }),
    [user, loading, signInWithPassword, signUp, signOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
