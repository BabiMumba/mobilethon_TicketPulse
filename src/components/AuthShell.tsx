import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import Logo from './Logo'

/**
 * Full-screen layout for auth pages. On desktop it becomes a two-column split
 * with a vibrant marketing panel; on mobile it's a clean centered form.
 */
export default function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string
  subtitle: string
  children: ReactNode
  footer: ReactNode
}) {
  return (
    <div className="grid min-h-screen bg-slate-950 md:grid-cols-2">
      {/* Marketing panel (desktop only) */}
      <div className="relative hidden overflow-hidden md:block">
        <img
          src="https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=1200&q=80"
          alt="Concert lights"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-950/70 to-brand-900/40" />
        <div className="absolute inset-0 flex flex-col justify-between p-10">
          <Logo />
          <div>
            <h2 className="max-w-sm text-3xl font-bold leading-tight">
              Your gateway to Zambia's biggest events.
            </h2>
            <p className="mt-3 max-w-sm text-slate-300">
              Discover events, book free or paid tickets, and manage your passes in one place.
            </p>
          </div>
        </div>
      </div>

      {/* Form column */}
      <div className="flex flex-col justify-center px-6 py-10 sm:px-10">
        <div className="mx-auto w-full max-w-sm animate-fade-in-up">
          <div className="mb-8 md:hidden">
            <Link to="/">
              <Logo />
            </Link>
          </div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
          <div className="mt-8">{children}</div>
          <div className="mt-6 text-center text-sm text-slate-400">{footer}</div>
        </div>
      </div>
    </div>
  )
}
