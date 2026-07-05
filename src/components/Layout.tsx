import { Outlet } from 'react-router-dom'
import TopHeader from './TopHeader'
import BottomNav from './BottomNav'

/**
 * Responsive application shell.
 *  - Mobile (< md): a strict centered max-w-md column with the fixed bottom
 *    navigation for a native app feel.
 *  - Desktop (>= md): full-width canvas with a sticky glassmorphic top header;
 *    the bottom bar is hidden.
 */
export default function Layout() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <TopHeader />
      <div className="relative mx-auto min-h-screen max-w-md bg-slate-900 pb-20 shadow-2xl md:min-h-0 md:max-w-none md:bg-transparent md:pb-0 md:shadow-none">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  )
}
