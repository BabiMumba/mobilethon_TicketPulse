import type { ReactNode } from 'react'
import BottomNav from './BottomNav'

/**
 * The application shell. Enforces a strict, centered mobile viewport so the PWA
 * looks and feels like a native app on any screen size, and reserves space at
 * the bottom for the fixed navigation bar (pb-20).
 */
export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="relative mx-auto min-h-screen max-w-md bg-slate-900 pb-20 text-white shadow-2xl">
      {children}
      <BottomNav />
    </div>
  )
}
