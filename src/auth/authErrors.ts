import type { AuthError } from '@supabase/supabase-js'
import { isSupabaseConfigured } from '../lib/supabase'

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

export function authErrorMessage(error: AuthError): string {
  const code = error.code ?? (error as AuthError & { error_code?: string }).error_code

  if (code === 'email_not_confirmed') {
    return 'Confirm your email first (check your inbox), then log in again.'
  }
  if (code === 'invalid_credentials') {
    return isSupabaseConfigured
      ? 'Incorrect email or password. If you just signed up, confirm your email in Supabase first.'
      : 'Incorrect email or password.'
  }
  if (error.message?.trim()) return error.message
  return 'Authentication failed. Please try again.'
}

export function mockLoginHint(): string | undefined {
  if (isSupabaseConfigured) return undefined
  return 'Demo mode: accounts are stored in this browser only. Use the same device where you registered.'
}
