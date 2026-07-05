import { useEffect, useMemo } from 'react'

const COLORS = ['#16a34a', '#a855f7', '#f59e0b', '#34d399', '#c084fc', '#fbbf24']

/** Lightweight CSS confetti — no extra dependency. */
export default function Confetti({ active }: { active: boolean }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: 56 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 0.8}s`,
        duration: `${2.2 + Math.random() * 1.8}s`,
        color: COLORS[i % COLORS.length],
        size: 6 + Math.random() * 8,
        rotate: Math.random() * 360,
        drift: -40 + Math.random() * 80,
      })),
    [],
  )

  useEffect(() => {
    if (!active) return
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [active])

  if (!active) return null

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[200] overflow-hidden"
      aria-hidden
    >
      {pieces.map((p) => (
        <span
          key={p.id}
          className="confetti-piece absolute top-0 block rounded-sm opacity-90"
          style={{
            left: p.left,
            width: p.size,
            height: p.size * 0.6,
            backgroundColor: p.color,
            animationDelay: p.delay,
            animationDuration: p.duration,
            transform: `rotate(${p.rotate}deg)`,
            ['--confetti-drift' as string]: `${p.drift}px`,
          }}
        />
      ))}
    </div>
  )
}
