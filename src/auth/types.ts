export interface AuthUser {
  id: string
  email?: string
  phone?: string
  name?: string
}

export interface AuthResult {
  ok: boolean
  error?: string
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
    phone?: string
  }): Promise<AuthResult>
  /** Kick off phone OTP sign-in. Returns ok when the code was "sent". */
  startPhoneOtp(phone: string): Promise<AuthResult>
  /** Verify the 6-digit code from the phone OTP flow. */
  verifyPhoneOtp(phone: string, code: string): Promise<AuthResult>
  signOut(): Promise<void>
}
