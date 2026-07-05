import { NavLink } from 'react-router-dom'
import { visibleNavItems } from '../navigation'
import { useAuth } from '../auth/useAuth'

/**
 * Fixed bottom navigation bar — the native-feeling mobile experience. Hidden on
 * desktop (md+), where the sticky top header takes over. Items are filtered by
 * the current auth session.
 */
export default function BottomNav() {
  const { user } = useAuth()
  const items = visibleNavItems(Boolean(user))

  return (
    <nav
      aria-label="Primary"
      className="fixed bottom-0 left-1/2 z-50 w-full max-w-md -translate-x-1/2 border-t border-white/10 bg-slate-900/90 backdrop-blur-lg safe-bottom md:hidden"
    >
      <ul
        className="grid"
        style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}
      >
        {items.map(({ to, label, description, icon: Icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={to === '/'}
              title={description}
              className="group flex flex-col items-center gap-1 px-1 pb-2 pt-2.5 text-[11px] font-medium outline-none transition-colors"
            >
              {({ isActive }) => (
                <>
                  <span
                    className={[
                      'relative flex h-9 w-12 items-center justify-center rounded-2xl transition-all duration-200',
                      isActive
                        ? 'bg-gradient-to-br from-brand-500/25 to-emerald-500/25 text-brand-400 shadow-glow'
                        : 'text-slate-400 group-hover:text-slate-200',
                    ].join(' ')}
                  >
                    <Icon size={22} strokeWidth={isActive ? 2.4 : 2} aria-hidden="true" />
                  </span>
                  <span className={isActive ? 'text-brand-400' : 'text-slate-400 group-hover:text-slate-200'}>
                    {label}
                  </span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
