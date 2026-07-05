import type { EventItem } from './types'

// Curated Unsplash placeholders (free to use). Swap these for owned media later.
const img = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1200&q=80`

export const SEED_EVENTS: EventItem[] = [
  {
    id: 'evt-amapiano',
    title: 'Lusaka July Amapiano Festival',
    description:
      'The biggest Amapiano lineup in Zambia returns to Heroes Stadium with headline DJs, food villages and a VIP experience.',
    city: 'Lusaka',
    venue: 'National Heroes Stadium',
    date: '2026-07-25T18:00:00+02:00',
    price: 250,
    currency: 'ZMW',
    category: 'Music',
    imageUrl: img('1470229722913-7c0e2dbbafd3'),
    organizer: 'Pulse Live ZM',
    tag: 'Trending',
    featured: true,
  },
  {
    id: 'evt-tech-summit',
    title: 'Copperbelt Tech Summit',
    description:
      'A two-day gathering of founders, engineers and investors shaping the future of technology on the Copperbelt.',
    city: 'Ndola',
    venue: 'Mukuba Hotel',
    date: '2026-07-31T09:00:00+02:00',
    price: 400,
    currency: 'ZMW',
    category: 'Business',
    imageUrl: img('1540575467063-178a50c2df87'),
    organizer: 'BongoHive',
    tag: 'Business',
    featured: true,
  },
  {
    id: 'evt-jazz-zambezi',
    title: 'Livingstone Jazz on the Zambezi',
    description:
      'Sunset jazz on the banks of the mighty Zambezi with an intimate line-up of local and international artists.',
    city: 'Livingstone',
    venue: 'Royal Livingstone',
    date: '2026-08-09T16:30:00+02:00',
    price: 350,
    currency: 'ZMW',
    category: 'Music',
    imageUrl: img('1511192336575-5a79af67a629'),
    organizer: 'Zambezi Sounds',
    tag: 'Live Music',
    featured: true,
  },
  {
    id: 'evt-comedy-night',
    title: 'Kitwe Comedy Night',
    description:
      'An evening of stand-up featuring the funniest comedians from across Zambia. Prepare to laugh out loud.',
    city: 'Kitwe',
    venue: 'Edinburgh Hotel',
    date: '2026-08-15T20:00:00+02:00',
    price: 150,
    currency: 'ZMW',
    category: 'Comedy',
    imageUrl: img('1585699324551-f6c309eedeca'),
    organizer: 'LaughFest ZM',
    tag: 'Comedy',
  },
  {
    id: 'evt-marathon',
    title: 'Lusaka City Marathon',
    description:
      'Run through the heart of the capital in the annual Lusaka City Marathon. 5K, 10K and full marathon categories.',
    city: 'Lusaka',
    venue: 'Freedom Statue',
    date: '2026-09-06T06:00:00+02:00',
    price: 100,
    currency: 'ZMW',
    category: 'Sports',
    imageUrl: img('1452626038306-9aae5e071dd3'),
    organizer: 'Run Zambia',
    tag: 'Sports',
  },
  {
    id: 'evt-theatre',
    title: 'Ndola Theatre Gala',
    description:
      'A celebration of Zambian storytelling and drama, featuring award-winning productions on one stage.',
    city: 'Ndola',
    venue: 'Ndola Little Theatre',
    date: '2026-09-20T18:30:00+02:00',
    price: 200,
    currency: 'ZMW',
    category: 'Theatre',
    imageUrl: img('1503095396549-807759245b35'),
    organizer: 'Zed Stage',
    tag: 'Theatre',
  },
]
