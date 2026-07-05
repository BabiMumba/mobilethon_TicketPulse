import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="animate-fade-in flex min-h-[70vh] flex-col items-center justify-center px-8 text-center">
      <Compass size={48} className="text-brand-400" />
      <h1 className="mt-4 text-2xl font-bold">Lost the beat</h1>
      <p className="mt-2 text-sm text-slate-400">
        We couldn't find that page. Let's get you back to the events.
      </p>
      <Link
        to="/"
        className="mt-6 rounded-2xl bg-gradient-to-r from-brand-500 to-accent-500 px-6 py-3 text-sm font-semibold text-white shadow-glow"
      >
        Back to Discover
      </Link>
    </div>
  )
}
