import { useState } from 'react'
import { Plus, Ticket } from 'lucide-react'
import type { City, EventCategory } from '../data/types'
import { eventsRepository } from '../data/eventsRepository'
import { useAuth } from '../auth/useAuth'
import ScreenHeader from '../components/ScreenHeader'
import PageContainer from '../components/PageContainer'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Modal from '../components/ui/Modal'

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

export default function Organizer() {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>()
  const [success, setSuccess] = useState<string>()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [city, setCity] = useState<City>('Lusaka')
  const [venue, setVenue] = useState('')
  const [date, setDate] = useState('')
  const [price, setPrice] = useState('0')
  const [category, setCategory] = useState<EventCategory>('Music')
  const [imageUrl, setImageUrl] = useState(DEFAULT_IMAGE)
  const [featured, setFeatured] = useState(false)

  const resetForm = () => {
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

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setError(undefined)
    setLoading(true)
    try {
      const event = await eventsRepository.create({
        title,
        description,
        city,
        venue,
        date: new Date(date).toISOString(),
        price: Number(price),
        category,
        imageUrl: imageUrl || DEFAULT_IMAGE,
        organizer: user.name ?? user.email ?? 'Organizer',
        tag: Number(price) === 0 ? 'Free' : undefined,
        featured,
      })
      setSuccess(`"${event.title}" published successfully!`)
      resetForm()
      setOpen(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create event.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="animate-fade-in">
      <ScreenHeader
        title="Organizer"
        subtitle="Create events — saved to Supabase"
        action={
          <Button size="sm" leftIcon={<Plus size={15} />} onClick={() => setOpen(true)}>
            New event
          </Button>
        }
      />

      <PageContainer className="space-y-6 px-5 py-5 md:max-w-2xl">
        {success && (
          <p className="rounded-xl border border-accent-500/30 bg-accent-500/10 px-4 py-3 text-sm text-accent-200">
            {success}
          </p>
        )}

        <section className="rounded-3xl border border-white/10 bg-slate-900/60 p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-500/15">
              <Ticket size={24} className="text-accent-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Publish an event</h2>
              <p className="mt-1 text-sm text-slate-400">
                Events appear instantly on the home page and search. Set price to{' '}
                <strong className="text-white">0</strong> for free entry.
              </p>
              <Button className="mt-4" size="sm" onClick={() => setOpen(true)}>
                Create event
              </Button>
            </div>
          </div>
        </section>
      </PageContainer>

      <Modal open={open} onClose={() => setOpen(false)} title="New event">
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
              placeholder="What is this event about?"
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
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" fullWidth onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" fullWidth loading={loading}>
              Publish
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
