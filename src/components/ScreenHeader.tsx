interface ScreenHeaderProps {
  title: string
  subtitle?: string
  action?: React.ReactNode
}

/**
 * Screen title block. Sticky and glassy on mobile; on desktop it becomes a
 * regular section heading since the top header already provides sticky chrome.
 */
export default function ScreenHeader({ title, subtitle, action }: ScreenHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-900/80 px-5 pb-4 pt-6 backdrop-blur-lg md:static md:border-0 md:bg-transparent md:px-0 md:pt-8 md:backdrop-blur-none">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="bg-gradient-to-r from-brand-400 to-emerald-400 bg-clip-text text-2xl font-bold tracking-tight text-transparent md:text-3xl">
            {title}
          </h1>
          {subtitle && <p className="mt-1 text-sm text-slate-400">{subtitle}</p>}
        </div>
        {action}
      </div>
    </header>
  )
}
