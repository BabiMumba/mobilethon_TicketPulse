import type { AuthResult, AuthUser } from './types'

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
  return { id: u.id, email: u.email, name: u.name }
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
    const normalized = email.trim().toLowerCase()
    const user = readUsers().find((u) => u.email?.toLowerCase() === normalized)
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
  }): Promise<AuthResult> {
    const users = readUsers()
    if (users.some((u) => u.email?.toLowerCase() === input.email.toLowerCase())) {
      return { ok: false, error: 'An account with this email already exists.' }
    }
    const user: StoredUser = {
      id: `usr_${Math.random().toString(36).slice(2, 10)}`,
      email: input.email.trim().toLowerCase(),
      name: input.name,
      password: input.password,
    }
    writeUsers([...users, user])
    setSession(user.id)
    return { ok: true }
  },

  async signOut(): Promise<void> {
    setSession(null)
  },
}
