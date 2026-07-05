import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { LogOut, User as UserIcon } from 'lucide-react'
import { visibleNavItems } from '../navigation'
import { useAuth } from '../auth/useAuth'
import Logo from './Logo'
import Button from './ui/Button'

/**
 * Sticky glassmorphic desktop header. Hidden on mobile (< md), where the bottom
 * navigation bar is used instead. Navigation links and the auth control react
 * to the current session.
 */
export default function TopHeader() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const items = visibleNavItems(Boolean(user))

  const handleSignOut = async () => {
    await signOut()
    setMenuOpen(false)
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-50 hidden border-b border-white/10 bg-slate-900/80 backdrop-blur-md md:block">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <NavLink to="/" className="transition-opacity hover:opacity-80">
          <Logo />
        </NavLink>

        <nav aria-label="Primary" className="flex items-center gap-1">
          {items.map(({ to, label, desktopLabel }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                [
                  'rounded-xl px-4 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-white/10 text-brand-400'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white',
                ].join(' ')
              }
            >
              {desktopLabel ?? label}
            </NavLink>
          ))}
        </nav>

        <div className="relative">
          {user ? (
            <>
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 py-1.5 pl-1.5 pr-3 text-sm font-medium transition-colors hover:bg-white/10"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-emerald-500 text-xs font-bold">
                  {(user.name || user.email || 'ZM').slice(0, 2).toUpperCase()}
                </span>
                <span className="max-w-[10rem] truncate">
                  {user.name || user.email || user.phone}
                </span>
              </button>
              {menuOpen && (
                <div className="animate-scale-in absolute right-0 mt-2 w-48 overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-2xl">
                  <NavLink
                    to="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 text-sm text-slate-200 transition-colors hover:bg-white/5"
                  >
                    <UserIcon size={16} className="text-brand-400" /> Profile
                  </NavLink>
                  <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-2 border-t border-white/10 px-4 py-3 text-left text-sm text-red-300 transition-colors hover:bg-red-500/10"
                  >
                    <LogOut size={16} /> Sign out
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                Log in
              </Button>
              <Button size="sm" onClick={() => navigate('/register')}>
                Sign up
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
