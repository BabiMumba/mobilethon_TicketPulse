import { Ticket } from 'lucide-react'

export default function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-2">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-emerald-500 shadow-glow">
        <Ticket size={18} className="text-white" />
      </span>
      {!compact && (
        <span className="text-lg font-extrabold tracking-tight">
          Ticket<span className="text-brand-400">Pulse</span>
        </span>
      )}
    </span>
  )
}
