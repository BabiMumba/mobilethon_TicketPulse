export interface AuthUser {
  id: string
  email?: string
  name?: string
}

export interface AuthResult {
  ok: boolean
  error?: string
  /** Supabase email confirmation enabled — user must verify inbox before login. */
  needsEmailConfirmation?: boolean
}

export interface AuthContextValue {
  user: AuthUser | null
  loading: boolean
  /** True when a real Supabase project is wired up (vs the mock backend). */
  usingSupabase: boolean
  signInWithPassword(email: string, password: string): Promise<AuthResult>
  signUp(input: {
    email: string
    password: string
    name: string
  }): Promise<AuthResult>
  signOut(): Promise<void>
}
