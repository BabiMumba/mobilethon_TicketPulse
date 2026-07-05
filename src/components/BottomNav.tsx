import { NavLink } from 'react-router-dom'
import { NAV_ITEMS } from '../navigation'

/**
 * Fixed bottom navigation bar. It is pinned to the bottom of the centered
 * mobile viewport wrapper (max-w-md), not the full window, so it lines up with
 * the app shell on larger screens too. Active tabs are highlighted via
 * `NavLink`'s active state.
 */
export default function BottomNav() {
  return (
    <nav
      aria-label="Primary"
      className="fixed bottom-0 left-1/2 z-50 w-full max-w-md -translate-x-1/2 border-t border-white/10 bg-slate-900/90 backdrop-blur-lg safe-bottom"
    >
      <ul className="grid grid-cols-5">
        {NAV_ITEMS.map(({ to, label, description, icon: Icon }) => (
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
                        ? 'bg-gradient-to-br from-brand-500/25 to-accent-500/25 text-brand-400 shadow-glow'
                        : 'text-slate-400 group-hover:text-slate-200',
                    ].join(' ')}
                  >
                    <Icon
                      size={22}
                      strokeWidth={isActive ? 2.4 : 2}
                      aria-hidden="true"
                    />
                  </span>
                  <span
                    className={
                      isActive ? 'text-brand-400' : 'text-slate-400 group-hover:text-slate-200'
                    }
                  >
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
