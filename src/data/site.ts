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
  { icon: ShieldCheck, label: 'RN on Staff & On Call' },
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
      'RN on staff and on call',
      'Home doctor on call',
      '24-hour care',
    ],
  },
  {
    icon: SquarePlus,
    title: 'Specialized Care',
    items: [
      'Dementia & Alzheimer’s care',
      'Mental health care',
      'Medication management',
      'Diabetes care',
      'Stroke (CVA) care',
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
      'RN on staff and on call',
      'Home doctor on call',
      '24-hour care',
    ],
  },
  {
    icon: SquarePlus,
    title: 'Specialized Services',
    items: [
      'Dementia & Alzheimer’s care',
      'Memory care & supervision',
      'Mental health care',
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
  'Dementia & memory care',
  'Mental health care',
  'Private rooms',
  'Vaulted-ceiling living room',
  'Wheelchair-accessible entry',
  'Step-free shower',
  'Open kitchen',
  'Sunny back deck',
  'Family-style dining',
  'Home-cooked meals',
]

export const everettChips: string[] = [
  'Dementia & memory care',
  'Mental health care',
  'Private rooms',
  'Roll-in showers',
  'Family-style dining',
  'Sunny back deck',
  'Landscaped gardens',
  'Home-cooked meals',
  'Holiday & birthday celebrations',
]

export type Faq = { q: string; a: string }

/**
 * Questions families actually type into Google. Every answer here is either a general fact
 * about the Washington adult-family-home licence class or something the owners have confirmed;
 * anything home-specific (rates, current openings, Medicaid contracts) routes to a phone call
 * rather than being stated. Mirrored into FAQPage structured data in data/seo.ts.
 */
export const faqs: Faq[] = [
  {
    q: 'What is an adult family home?',
    a: 'An adult family home is a licensed private residence where a small number of adults live and receive care. In Washington they are licensed by the Department of Social and Health Services for up to six residents, so each person gets far more individual attention than in a large facility. Both of our homes are ordinary houses in quiet residential neighborhoods, not institutions.',
  },
  {
    q: 'How is an adult family home different from assisted living?',
    a: 'Mostly scale, and it changes everything. An assisted living facility may house dozens or hundreds of residents in apartment-style units with rotating staff. An adult family home is a real house with a handful of residents and the same small team of caregivers every day, who come to know each resident personally.',
  },
  {
    q: 'Do you provide dementia, Alzheimer’s, or memory care?',
    a: 'Yes. Both homes are licensed for dementia and Alzheimer’s care and for mental health care, with 24-hour supervision, medication management, and staff experienced with memory loss. Because both specialties are covered, a resident whose needs change over time can usually stay in the home and with the caregivers they already know.',
  },
  {
    q: 'What level of medical care can you provide?',
    a: 'A registered nurse works on our team and is on call around the clock, as is a home doctor. We provide medication management, diabetes care, wound care, stroke recovery care, oxygen therapy, tube feeding, catheter and incontinence care, and hospice care. If you are weighing whether we can meet a specific medical need, call us and we will tell you honestly.',
  },
  {
    q: 'Does Medicaid pay for adult family home care in Washington?',
    a: 'Washington Medicaid does cover adult family home care for people who meet the financial and functional eligibility rules, usually through a COPES or similar waiver. Whether that works for your situation depends on eligibility and on current openings, so please call and we will talk it through with you.',
  },
  {
    q: 'How much does it cost?',
    a: 'Rates depend on the level of care a resident needs, so we quote them individually rather than publishing one figure. Call us and we will give you a straight answer for your situation. Tours are always free and carry no obligation.',
  },
  {
    q: 'Can we visit before deciding?',
    a: 'Please do. Tours run daily by appointment. Walk through the whole home, meet the caregivers, see a room, and ask anything. Choosing care for a parent is not a decision anyone should make from photographs alone.',
  },
]

export type Photo = { src: string; alt: string; caption: string }

export const lynnwoodGallery: Photo[] = [
  {
    src: '/assets/img/living-room.webp',
    alt: 'Living room with vaulted ceilings, a chandelier, skylights, a fireplace, a large TV, and comfortable couches',
    caption: 'The living room, with vaulted ceilings and room for everyone',
  },
  {
    src: '/assets/img/kitchen.webp',
    alt: 'Open kitchen with dark wood cabinets, stone countertops, and stainless steel appliances',
    caption: 'The open kitchen, at the heart of the home',
  },
  {
    src: '/assets/img/dining-room.webp',
    alt: 'Dining room with a large wooden table, upholstered chairs, bay window, and chandelier',
    caption: 'The dining room, set for family-style meals',
  },
  {
    src: '/assets/img/lynnwood-bedroom.webp',
    alt: 'A private resident bedroom with an adjustable bed, a bedside table and lamp, and a window with lace curtains',
    caption: 'A private room, bright and ready to make your own',
  },
  {
    src: '/assets/img/lynnwood-bathroom.webp',
    alt: 'Tiled bathroom with a vanity, a round mirror, folded towels, and a raised toilet seat with safety rails',
    caption: 'A bathroom set up for safety, with rails within reach',
  },
  {
    src: '/assets/img/lynnwood-shower.webp',
    alt: 'Step-free tiled shower with a grab bar, a handheld shower head, and a shower bench',
    caption: 'A step-free shower with a bench and grab bars',
  },
  {
    src: '/assets/img/back-deck.webp',
    alt: 'Sunny back deck with a cushioned outdoor couch, two armchairs, a coffee table, and a fenced backyard',
    caption: 'The sunny back deck and fenced backyard',
  },
  {
    src: '/assets/img/lynnwood-fountain.webp',
    alt: 'A tiered stone fountain on a circular paver patio, surrounded by lawn and clipped shrubs',
    caption: 'The garden fountain, a quiet spot to sit outside',
  },
  {
    src: '/assets/img/celebration-table.webp',
    alt: 'Holiday table set with a roast turkey, side dishes, cranberry sauce, and a large bouquet of flowers',
    caption: 'A holiday feast, ready for the table',
  },
]

export const everettGallery: Photo[] = [
  {
    src: '/assets/img/everett-garden.webp',
    alt: 'The front garden on a sunny day, with a Japanese maple, a bed of red azaleas, hostas, and lavender along a stone border',
    caption: 'The front garden in full bloom',
  },
  {
    src: '/assets/img/everett-bedroom.webp',
    alt: 'A private resident bedroom with a made bed, a wooden dresser, a recliner, and a curtained window',
    caption: 'A private room, with space to settle in',
  },
  {
    src: '/assets/img/everett-dining.webp',
    alt: 'Dining room with a dark wood table, floral-upholstered chairs, an orchid centerpiece, and the home’s licenses framed on the wall',
    caption: 'The dining room, set for family-style meals',
  },
  {
    src: '/assets/img/everett-deck.webp',
    alt: 'The back deck with cushioned wicker chairs and pots of pink hydrangeas, framed by tall evergreens',
    caption: 'The back deck, framed by summer flowers',
  },
  {
    src: '/assets/img/everett-deck-flowers.webp',
    alt: 'Close view of the deck seating area, with hydrangeas in stone planters and a rainbow pinwheel',
    caption: 'A shady corner of the deck, good for an afternoon outside',
  },
  {
    src: '/assets/img/everett-bathroom.webp',
    alt: 'Bathroom with a white vanity, a round mirror, and a curtained roll-in shower with grab bars beyond',
    caption: 'A bright, step-free bathroom',
  },
  {
    src: '/assets/img/everett-shower.webp',
    alt: 'A tiled roll-in shower with grab bars, a handheld shower head, and a wheeled shower chair',
    caption: 'Roll-in showers with grab bars and shower chairs',
  },
]
