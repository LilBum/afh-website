import type { LucideIcon } from 'lucide-react'
import {
  Activity,
  Award,
  BedDouble,
  Clock,
  CookingPot,
  Heart,
  Home,
  Music,
  ShieldCheck,
  SquarePlus,
  Sun,
} from 'lucide-react'

export const site = {
  name: 'A&D Home Care',
  phone: '(425) 773-0844',
  phoneTel: '+14257730844',
  email: 'gabi_badet@yahoo.com',
  lynnwood: {
    street: '3111 201st Pl SW',
    cityState: 'Lynnwood, WA 98036',
    oneLine: '3111 201st Pl SW, Lynnwood, WA 98036',
    mapsUrl: 'https://maps.google.com/?q=3111+201st+Pl+SW,+Lynnwood,+WA+98036',
  },
  everett: {
    cityState: 'Everett, Washington',
  },
} as const

export type NavLink = { label: string; href: string }

export const navLinks: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Lynnwood Home', href: '/lynnwood' },
  { label: 'Everett Home', href: '/everett' },
  { label: 'Contact', href: '/#contact' },
]

export type Feature = { icon: LucideIcon; label: string }

export const trustStrip: Feature[] = [
  { icon: Clock, label: '24-Hour Care' },
  { icon: ShieldCheck, label: 'RN on Call' },
  { icon: Home, label: 'Home Doctor on Call' },
  { icon: BedDouble, label: 'Private Rooms' },
  { icon: CookingPot, label: 'Home-Cooked Meals' },
]

export const values: Feature[] = [
  { icon: Heart, label: 'Compassion' },
  { icon: ShieldCheck, label: 'Respect' },
  { icon: Sun, label: 'Hard Working' },
  { icon: Clock, label: 'Dedication' },
  { icon: Award, label: 'Dignity' },
]

export type ServiceCard = { icon: LucideIcon; title: string; items: string[] }

// Condensed overview shown on the home page.
export const servicesOverview: ServiceCard[] = [
  {
    icon: Heart,
    title: 'Personal Care',
    items: [
      'Bathing, grooming & dressing',
      'Laundry & housekeeping',
      'Nutritious meal preparation',
      'Mobility & transfer assistance',
      'Safety supervision',
    ],
  },
  {
    icon: Activity,
    title: 'Health Services',
    items: [
      'Personalized care plans',
      'Comprehensive health monitoring',
      'RN on call',
      'Home doctor on call',
      '24-hour care',
    ],
  },
  {
    icon: SquarePlus,
    title: 'Specialized Care',
    items: [
      'Medication management',
      'Diabetes care',
      'Stroke (CVA) care',
      'Wound care',
      'Hospice care',
    ],
  },
  {
    icon: Music,
    title: 'Activities',
    items: [
      'Movie nights & table games',
      'Exercise program',
      'Music therapy',
      'Hair stylist & nails',
      'Birthday & holiday celebrations',
    ],
  },
]

// Full service columns shown on both home (Lynnwood & Everett) pages.
export const servicesFull: ServiceCard[] = [
  {
    icon: Heart,
    title: 'Personal Service',
    items: [
      'Bathing, bed, grooming & dressing',
      'Personal hygiene: oral care, dentures, nails & hair',
      'Skin care',
      'Laundry & housekeeping',
      'Private room',
      'Personal cable TV',
      'Internet',
      'Nutritious meal preparation',
      'Transfer assistance & transportation services',
      'Mobility assistance',
      'Safety supervision',
    ],
  },
  {
    icon: Activity,
    title: 'Health Services',
    items: [
      'Personalized care plans',
      'Emotional security & support',
      'Comprehensive health monitoring',
      'RN on call',
      'Home doctor on call',
      '24-hour care',
    ],
  },
  {
    icon: SquarePlus,
    title: 'Specialized Services',
    items: [
      'Medication management',
      'Diabetes care',
      'Incontinence care',
      'Wound care',
      'Oxygen therapy',
      'Tube feeding',
      'Stroke (CVA) care',
      'Foley catheter',
      'Bowel & bladder retraining program',
      'Cancer care',
      'Congestive heart failure',
      'Hospice care',
    ],
  },
  {
    icon: Music,
    title: 'Activities',
    items: [
      'In-home library',
      'Movie nights',
      'Table games',
      'Exercise program',
      'Music therapy',
      'Hair stylist & nails',
      'Birthday celebrations',
      'Holiday celebrations',
      'Internet & cable television',
    ],
  },
]

export const lynnwoodChips: string[] = [
  'Private rooms',
  'Vaulted-ceiling living room',
  'Open kitchen',
  'Sunny back deck',
  'Family-style dining',
  'Home-cooked meals',
]

export type Photo = { src: string; alt: string; caption: string }

export const lynnwoodGallery: Photo[] = [
  {
    src: '/assets/img/living-room.jpg',
    alt: 'Living room with vaulted ceilings, chandelier, fireplace, large TV, and comfortable couches',
    caption: 'The living room — vaulted ceilings, a fireplace, and room for everyone',
  },
  {
    src: '/assets/img/kitchen.jpg',
    alt: 'Open kitchen with dark wood cabinets, stone countertops, and stainless steel appliances',
    caption: 'The open kitchen, at the heart of the home',
  },
  {
    src: '/assets/img/dining-room.jpg',
    alt: 'Dining room with a large wooden table, upholstered chairs, bay window, and chandelier',
    caption: 'The dining room, set for family-style meals',
  },
  {
    src: '/assets/img/back-deck.jpg',
    alt: 'Sunny back deck with cushioned outdoor seating and a fenced backyard',
    caption: 'The sunny back deck and fenced backyard',
  },
  {
    src: '/assets/img/dining-festive.jpg',
    alt: 'Dining area decorated with red, white, and blue balloons, stars, and American flags for the Fourth of July',
    caption: 'Decorated for the Fourth of July — we celebrate every holiday',
  },
  {
    src: '/assets/img/celebration-table.jpg',
    alt: 'Holiday table set with a turkey, side dishes, fresh fruit, and a large bouquet of flowers',
    caption: 'A holiday feast, ready for the table',
  },
]
