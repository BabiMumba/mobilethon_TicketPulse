import { useCallback, useEffect, useState } from 'react'
import { ChevronDown, ChevronUp, Pencil, Plus, Ticket, Trash2, Users } from 'lucide-react'
import type { City, EventCategory, EventItem, EventWithBookings } from '../data/types'
import { eventsRepository } from '../data/eventsRepository'
import { ticketsRepository } from '../data/ticketsRepository'
import { useAuth } from '../auth/useAuth'
import PageShell from '../components/PageShell'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Modal from '../components/ui/Modal'
import { formatEventDate, formatMoney } from '../lib/format'
import { EVENTS_CHANGED } from '../lib/eventsNotify'

const CITIES: City[] = ['Lusaka', 'Ndola', 'Kitwe', 'Livingstone']
const CATEGORIES: EventCategory[] = [
  'Music',
  'Sports',
  'Business',
  'Comedy',
  'Festivals',
  'Theatre',
]

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80'

function toDatetimeLocalValue(iso: string): string {
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export default function Organizer() {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>()
  const [success, setSuccess] = useState<string>()
  const [myEvents, setMyEvents] = useState<EventWithBookings[] | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [city, setCity] = useState<City>('Lusaka')
  const [venue, setVenue] = useState('')
  const [date, setDate] = useState('')
  const [price, setPrice] = useState('0')
  const [category, setCategory] = useState<EventCategory>('Music')
  const [imageUrl, setImageUrl] = useState(DEFAULT_IMAGE)
  const [featured, setFeatured] = useState(false)

  const organizerName = user?.name ?? user?.email ?? 'Organizer'

  const loadMyEvents = useCallback(async () => {
    if (!user) return
    const events = await eventsRepository.listByOrganizer(user.id, organizerName)
    const withBookings = await Promise.all(
      events.map(async (event) => {
        const bookings = await ticketsRepository.listForEvent(event.id)
        const totalAttendees = bookings.reduce((sum, b) => sum + b.quantity, 0)
        return { event, bookings, totalTickets: bookings.length, totalAttendees }
      }),
    )
    setMyEvents(withBookings)
  }, [user, organizerName])

  useEffect(() => {
    loadMyEvents()
    window.addEventListener(EVENTS_CHANGED, loadMyEvents)
    return () => window.removeEventListener(EVENTS_CHANGED, loadMyEvents)
  }, [loadMyEvents])

  const resetForm = () => {
    setEditingId(null)
    setTitle('')
    setDescription('')
    setCity('Lusaka')
    setVenue('')
    setDate('')
    setPrice('0')
    setCategory('Music')
    setImageUrl(DEFAULT_IMAGE)
    setFeatured(false)
    setError(undefined)
  }

  const openCreate = () => {
    resetForm()
    setOpen(true)
  }

  const openEdit = (event: EventItem) => {
    setEditingId(event.id)
    setTitle(event.title)
    setDescription(event.description)
    setCity(event.city)
    setVenue(event.venue)
    setDate(toDatetimeLocalValue(event.date))
    setPrice(String(event.price))
    setCategory(event.category)
    setImageUrl(event.imageUrl)
    setFeatured(event.featured ?? false)
    setError(undefined)
    setOpen(true)
  }

  const closeModal = () => {
    setOpen(false)
    resetForm()
  }

  const buildInput = () => ({
    title,
    description,
    city,
    venue,
    date: new Date(date).toISOString(),
    price: Number(price),
    category,
    imageUrl: imageUrl || DEFAULT_IMAGE,
    organizer: organizerName,
    createdBy: user!.id,
    tag: Number(price) === 0 ? 'Free' : undefined,
    featured,
  })

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setError(undefined)
    setLoading(true)
    try {
      if (editingId) {
        const event = await eventsRepository.update(editingId, buildInput())
        setSuccess(`"${event.title}" updated.`)
      } else {
        const event = await eventsRepository.create(buildInput())
        setSuccess(`"${event.title}" published — visible on Home & Search.`)
      }
      closeModal()
      await loadMyEvents()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save event.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (event: EventItem) => {
    if (!user) return
    if (!window.confirm(`Delete "${event.title}"? This cannot be undone.`)) return
    try {
      await eventsRepository.delete(event.id, user.id)
      setSuccess(`"${event.title}" deleted.`)
      if (expandedId === event.id) setExpandedId(null)
      await loadMyEvents()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete event.')
    }
  }

  return (
    <>
      <PageShell
        narrow
        title="Organizer"
        subtitle="Create, edit and track your events"
        action={
          <Button size="sm" leftIcon={<Plus size={15} />} onClick={openCreate}>
            New event
          </Button>
        }
      >
        {success && (
          <p className="mb-6 rounded-xl border border-accent-500/30 bg-accent-500/10 px-4 py-3 text-sm text-accent-200">
            {success}
          </p>
        )}
        {error && !open && (
          <p className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </p>
        )}

        <section className="mb-8 rounded-3xl border border-white/10 bg-slate-900/60 p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent-500/15">
              <Ticket size={24} className="text-accent-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Manage your events</h2>
              <p className="mt-1 text-sm text-slate-400">
                Create, edit or delete events. Price <strong className="text-white">0</strong> = free.
              </p>
              <Button className="mt-4" size="sm" onClick={openCreate}>
                Create event
              </Button>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
            My events &amp; bookings
          </h2>

          {myEvents === null && <p className="text-sm text-slate-500">Loading your events…</p>}

          {myEvents?.length === 0 && (
            <p className="rounded-2xl border border-white/10 bg-white/5 px-4 py-8 text-center text-sm text-slate-400">
              No events yet — create one to see reservations here.
            </p>
          )}

          {myEvents?.map(({ event, bookings, totalAttendees, totalTickets }) => (
            <EventBookingsCard
              key={event.id}
              event={event}
              bookings={bookings}
              totalAttendees={totalAttendees}
              totalTickets={totalTickets}
              expanded={expandedId === event.id}
              onToggle={() => setExpandedId((id) => (id === event.id ? null : event.id))}
              onEdit={() => openEdit(event)}
              onDelete={() => handleDelete(event)}
            />
          ))}
        </section>
      </PageShell>

      <Modal
        open={open}
        onClose={closeModal}
        title={editingId ? 'Edit event' : 'New event'}
      >
        <form onSubmit={submit} className="space-y-4">
          <Input label="Title" required value={title} onChange={(e) => setTitle(e.target.value)} />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">Description</label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-accent-400 focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300">City</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value as City)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-accent-400 focus:outline-none"
              >
                {CITIES.map((c) => (
                  <option key={c} value={c} className="bg-slate-900">
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as EventCategory)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-accent-400 focus:outline-none"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} className="bg-slate-900">
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <Input label="Venue" required value={venue} onChange={(e) => setVenue(e.target.value)} />
          <Input
            label="Date & time"
            type="datetime-local"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <Input
            label="Price (ZMW) — 0 for free"
            type="number"
            min={0}
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <Input
            label="Cover image URL"
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
          <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-300">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="rounded border-white/20 bg-white/5"
            />
            Feature on home page
          </label>
          {error && (
            <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </p>
          )}
          <div className="sticky bottom-0 flex gap-3 border-t border-white/10 bg-slate-900 pt-4">
            <Button type="button" variant="outline" fullWidth onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit" fullWidth loading={loading}>
              {editingId ? 'Save changes' : 'Publish'}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  )
}

function EventBookingsCard({
  event,
  bookings,
  totalAttendees,
  totalTickets,
  expanded,
  onToggle,
  onEdit,
  onDelete,
}: {
  event: EventItem
  bookings: EventWithBookings['bookings']
  totalAttendees: number
  totalTickets: number
  expanded: boolean
  onToggle: () => void
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <article className="overflow-hidden rounded-2xl border border-white/10 bg-slate-800/50">
      <div className="flex items-start gap-2 px-4 py-4">
        <button
          type="button"
          onClick={onToggle}
          className="min-w-0 flex-1 cursor-pointer text-left hover:opacity-90"
        >
          <h3 className="font-semibold text-white">{event.title}</h3>
          <p className="mt-1 text-xs text-slate-400">
            {formatEventDate(event.date)} · {event.city} · {formatMoney(event.price, event.currency)}
          </p>
          <p className="mt-2 flex items-center gap-1.5 text-sm text-accent-300">
            <Users size={15} />
            {totalAttendees} attendee{totalAttendees === 1 ? '' : 's'} · {totalTickets} booking
            {totalTickets === 1 ? '' : 's'}
          </p>
        </button>
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={onEdit}
            aria-label="Edit event"
            className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
          >
            <Pencil size={16} />
          </button>
          <button
            type="button"
            onClick={onDelete}
            aria-label="Delete event"
            className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
          >
            <Trash2 size={16} />
          </button>
          <button
            type="button"
            onClick={onToggle}
            aria-label={expanded ? 'Collapse' : 'Expand'}
            className="rounded-xl p-2 text-slate-400 hover:bg-white/10"
          >
            {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-white/10 px-4 py-3">
          {bookings.length === 0 ? (
            <p className="py-3 text-sm text-slate-500">No reservations yet.</p>
          ) : (
            <ul className="divide-y divide-white/5">
              {bookings.map((b) => (
                <li
                  key={b.ticketId}
                  className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm"
                >
                  <div>
                    <p className="font-medium text-white">{b.attendeeName}</p>
                    <p className="text-xs text-slate-400">{b.attendeeEmail}</p>
                  </div>
                  <div className="text-right text-xs text-slate-400">
                    <p className="font-mono text-brand-300">{b.code}</p>
                    <p>
                      {b.quantity}× · {formatMoney(b.amountPaid, b.currency)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </article>
  )
}
