import type { ReactNode } from 'react'
import PageContainer from './PageContainer'

interface PageShellProps {
  title: string
  subtitle?: string
  action?: ReactNode
  children: ReactNode
  /** Narrow content column on desktop (profile, organizer). */
  narrow?: boolean
  className?: string
}

/** Unified page layout — title + content share the same horizontal padding. */
export default function PageShell({
  title,
  subtitle,
  action,
  children,
  narrow,
  className = '',
}: PageShellProps) {
  return (
    <div className="animate-fade-in">
      <PageContainer
        className={[
          'px-5 pb-8 pt-6 md:px-6 md:pt-10',
          narrow ? 'md:max-w-2xl' : '',
          className,
        ].join(' ')}
      >
        <header className="mb-6 flex items-start justify-between gap-4 border-b border-white/5 pb-5">
          <div className="min-w-0">
            <h1 className="bg-gradient-to-r from-brand-400 to-emerald-400 bg-clip-text text-2xl font-bold tracking-tight text-transparent md:text-3xl">
              {title}
            </h1>
            {subtitle && <p className="mt-1.5 text-sm text-slate-400">{subtitle}</p>}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </header>
        {children}
      </PageContainer>
    </div>
  )
}
