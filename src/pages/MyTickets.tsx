import { WifiOff, QrCode, MapPin, CalendarDays, CheckCircle2 } from 'lucide-react'
import ScreenHeader from '../components/ScreenHeader'

interface Ticket {
  id: string
  event: string
  city: string
  venue: string
  date: string
  type: string
  seat: string
  code: string
}

const TICKETS: Ticket[] = [
  {
    id: 'TP-LUS-4821',
    event: 'Lusaka July Amapiano Festival',
    city: 'Lusaka',
    venue: 'Heroes Stadium',
    date: 'Sat, 25 Jul • 18:00',
    type: 'VIP',
    seat: 'Block A · Row 3',
    code: 'TP-LUS-4821',
  },
  {
    id: 'TP-LIV-1190',
    event: 'Livingstone Jazz on the Zambezi',
    city: 'Livingstone',
    venue: 'Royal Livingstone',
    date: 'Sun, 09 Aug • 16:30',
    type: 'General',
    seat: 'GA',
    code: 'TP-LIV-1190',
  },
]

/**
 * A deterministic, decorative QR-style matrix rendered purely with SVG so a
 * scannable-looking pass is always available offline (no network image fetch).
 * A production build would swap this for the real encoded QR payload.
 */
function QrGlyph({ seed }: { seed: string }) {
  const size = 21
  const cells: boolean[] = []
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0
  for (let i = 0; i < size * size; i++) {
    h = (h * 1103515245 + 12345) & 0x7fffffff
    cells.push((h >> 16) % 2 === 0)
  }
  const finder = (x: number, y: number) =>
    (x < 7 && y < 7) || (x >= size - 7 && y < 7) || (x < 7 && y >= size - 7)

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className="h-40 w-40 rounded-xl bg-white p-2"
      shapeRendering="crispEdges"
      role="img"
      aria-label={`QR code for ticket ${seed}`}
    >
      {cells.map((on, i) => {
        const x = i % size
        const y = Math.floor(i / size)
        if (finder(x, y)) return null
        return on ? <rect key={i} x={x} y={y} width="1" height="1" fill="#020617" /> : null
      })}
      {[
        [0, 0],
        [size - 7, 0],
        [0, size - 7],
      ].map(([fx, fy], idx) => (
        <g key={idx} fill="#020617">
          <rect x={fx} y={fy} width="7" height="7" />
          <rect x={fx + 1} y={fy + 1} width="5" height="5" fill="#fff" />
          <rect x={fx + 2} y={fy + 2} width="3" height="3" />
        </g>
      ))}
    </svg>
  )
}

export default function MyTickets() {
  return (
    <div className="animate-fade-in">
      <ScreenHeader
        title="My Tickets"
        subtitle="Your passes work offline"
        action={
          <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1.5 text-xs font-medium text-emerald-300">
            <WifiOff size={14} /> Offline ready
          </span>
        }
      />

      <div className="space-y-5 px-5 py-5">
        <p className="flex items-center gap-2 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          <CheckCircle2 size={18} className="shrink-0" />
          Passes &amp; QR codes are cached on this device — scan at the gate even
          with no signal.
        </p>

        {TICKETS.map((t) => (
          <article
            key={t.id}
            className="overflow-hidden rounded-3xl border border-white/10 bg-slate-800/60"
          >
            <div className="bg-gradient-to-r from-brand-500/20 to-accent-500/20 px-5 py-4">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-black/30 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-brand-300">
                  {t.type}
                </span>
                <span className="text-xs font-mono text-slate-300">{t.code}</span>
              </div>
              <h3 className="mt-3 text-lg font-bold leading-tight">{t.event}</h3>
              <div className="mt-2 space-y-1 text-sm text-slate-200">
                <p className="flex items-center gap-2">
                  <MapPin size={15} className="text-brand-300" />
                  {t.venue}, {t.city}
                </p>
                <p className="flex items-center gap-2">
                  <CalendarDays size={15} className="text-brand-300" />
                  {t.date}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center gap-3 border-t border-dashed border-white/15 px-5 py-5">
              <QrGlyph seed={t.code} />
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <QrCode size={16} className="text-brand-400" />
                {t.seat}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
