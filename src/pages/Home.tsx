import { useEffect, useState } from 'react'
import type { EventItem } from '../data/types'
import { eventsRepository } from '../data/eventsRepository'
import LandingHero, { HowItWorks } from '../components/landing/LandingHero'
import EventsShowcase from '../components/landing/EventsShowcase'
import { EVENTS_CHANGED } from '../lib/eventsNotify'

export default function Home() {
  const [events, setEvents] = useState<EventItem[] | null>(null)

  useEffect(() => {
    let active = true
    const load = () => {
      eventsRepository.list().then((data) => {
        if (active) setEvents(data)
      })
    }
    load()
    window.addEventListener(EVENTS_CHANGED, load)
    return () => {
      active = false
      window.removeEventListener(EVENTS_CHANGED, load)
    }
  }, [])

  return (
    <div className="animate-fade-in">
      <LandingHero />
      <EventsShowcase events={events} />
      <HowItWorks />
    </div>
  )
}
