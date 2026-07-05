import { useEffect, useState } from 'react'
import type { EventItem } from '../data/types'
import { eventsRepository } from '../data/eventsRepository'
import LandingHero, { HowItWorks, PaymentBadges } from '../components/landing/LandingHero'
import EventsShowcase from '../components/landing/EventsShowcase'

export default function Home() {
  const [events, setEvents] = useState<EventItem[] | null>(null)

  useEffect(() => {
    let active = true
    eventsRepository.list().then((data) => {
      if (active) setEvents(data)
    })
    return () => {
      active = false
    }
  }, [])

  return (
    <div className="animate-fade-in">
      <LandingHero />
      <EventsShowcase events={events} />
      <HowItWorks />
      <PaymentBadges />
    </div>
  )
}
