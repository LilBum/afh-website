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

export { site, areasServed } from './contact'

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

export const everettChips: string[] = [
  'Private rooms',
  'Family-style dining',
  'Sunny back deck',
  'Landscaped gardens',
  'Home-cooked meals',
  'Holiday & birthday celebrations',
]

export type Photo = { src: string; alt: string; caption: string }

export const lynnwoodGallery: Photo[] = [
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
    src: '/assets/img/dining-festive.jpg',
    alt: 'Dining area decorated with red, white, and blue balloons, stars, and American flags for the Fourth of July',
    caption: 'Decorated for the Fourth of July, one of many holidays we celebrate',
  },
  {
    src: '/assets/img/celebration-table.jpg',
    alt: 'Holiday table set with a turkey, side dishes, fresh fruit, and a large bouquet of flowers',
    caption: 'A holiday feast, ready for the table',
  },
]

export const everettGallery: Photo[] = [
  {
    src: '/assets/img/everett-garden.jpg',
    alt: 'The front garden on a sunny day, with a Japanese maple, a bed of red azaleas, hostas, and lavender along a stone border',
    caption: 'The front garden in full bloom',
  },
  {
    src: '/assets/img/everett-bedroom.jpg',
    alt: 'A private resident bedroom with a made bed, a wooden dresser, a recliner, and a curtained window',
    caption: 'A private room, with space to settle in',
  },
  {
    src: '/assets/img/everett-dining.jpg',
    alt: 'Dining room with a dark wood table, floral-upholstered chairs, an orchid centerpiece, and the home’s licenses framed on the wall',
    caption: 'The dining room, set for family-style meals',
  },
  {
    src: '/assets/img/everett-deck.jpg',
    alt: 'The back deck with cushioned wicker chairs and pots of pink hydrangeas, framed by tall evergreens',
    caption: 'The back deck, framed by summer flowers',
  },
  {
    src: '/assets/img/everett-deck-flowers.jpg',
    alt: 'Close view of the deck seating area, with hydrangeas in stone planters and a rainbow pinwheel',
    caption: 'A shady corner of the deck, good for an afternoon outside',
  },
  {
    src: '/assets/img/everett-back-deck.jpg',
    alt: 'A lower deck with a cushioned outdoor couch, two armchairs, a coffee table, and a fenced back lawn beyond',
    caption: 'The lower deck, opening onto the fenced back lawn',
  },
  {
    src: '/assets/img/everett-bathroom.jpg',
    alt: 'Bathroom with a white vanity, a round mirror, and a curtained roll-in shower with grab bars beyond',
    caption: 'A bright, step-free bathroom',
  },
  {
    src: '/assets/img/everett-shower.jpg',
    alt: 'A tiled roll-in shower with grab bars, a handheld shower head, and a wheeled shower chair',
    caption: 'Roll-in showers with grab bars and shower chairs',
  },
  {
    src: '/assets/img/everett-celebration.jpg',
    alt: 'Three residents in party hats celebrating a birthday at a festive table with a cake, balloons, and a Happy Birthday banner',
    caption: 'Celebrating a birthday together, because we make a fuss over every one',
  },
]
