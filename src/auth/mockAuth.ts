import type { AuthResult, AuthUser } from './types'

// A tiny localStorage-backed auth backend used when Supabase is not configured.
// It mirrors the shape of the Supabase flows so swapping in the real client is
// seamless. NOT secure — for local/hackathon demos only.

const USERS_KEY = 'tp:auth:users'
const SESSION_KEY = 'tp:auth:session'

interface StoredUser extends AuthUser {
  password?: string
}

function readUsers(): StoredUser[] {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]') as StoredUser[]
  } catch {
    return []
  }
}

function writeUsers(users: StoredUser[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function publicUser(u: StoredUser): AuthUser {
  return { id: u.id, email: u.email, phone: u.phone, name: u.name }
}

function setSession(userId: string | null): void {
  if (userId) localStorage.setItem(SESSION_KEY, userId)
  else localStorage.removeItem(SESSION_KEY)
}

export const mockAuth = {
  current(): AuthUser | null {
    const id = localStorage.getItem(SESSION_KEY)
    if (!id) return null
    const user = readUsers().find((u) => u.id === id)
    return user ? publicUser(user) : null
  },

  async signInWithPassword(email: string, password: string): Promise<AuthResult> {
    const user = readUsers().find(
      (u) => u.email?.toLowerCase() === email.toLowerCase(),
    )
    if (!user || user.password !== password) {
      return { ok: false, error: 'Invalid email or password.' }
    }
    setSession(user.id)
    return { ok: true }
  },

  async signUp(input: {
    email: string
    password: string
    name: string
    phone?: string
  }): Promise<AuthResult> {
    const users = readUsers()
    if (users.some((u) => u.email?.toLowerCase() === input.email.toLowerCase())) {
      return { ok: false, error: 'An account with this email already exists.' }
    }
    const user: StoredUser = {
      id: `usr_${Math.random().toString(36).slice(2, 10)}`,
      email: input.email,
      name: input.name,
      phone: input.phone,
      password: input.password,
    }
    writeUsers([...users, user])
    setSession(user.id)
    return { ok: true }
  },

  async startPhoneOtp(): Promise<AuthResult> {
    // Mock: pretend the SMS was sent. Demo code is 123456.
    return { ok: true }
  },

  async verifyPhoneOtp(phone: string, code: string): Promise<AuthResult> {
    if (!/^\d{6}$/.test(code)) {
      return { ok: false, error: 'Enter the 6-digit code.' }
    }
    const users = readUsers()
    let user = users.find((u) => u.phone === phone)
    if (!user) {
      user = {
        id: `usr_${Math.random().toString(36).slice(2, 10)}`,
        phone,
        name: 'Zambia Member',
      }
      writeUsers([...users, user])
    }
    setSession(user.id)
    return { ok: true }
  },

  async signOut(): Promise<void> {
    setSession(null)
  },
}
