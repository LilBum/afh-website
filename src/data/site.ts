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
  { icon: ShieldCheck, label: 'RN Delegation & Consultation' },
  { icon: Home, label: 'Family-Style Homes' },
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
      'Medication support',
      'Diabetes & delegated insulin support',
      'Higher-acuity support assessed individually',
      '24-hour personal care & supervision',
    ],
  },
  {
    icon: SquarePlus,
    title: 'Specialized Care',
    items: [
      'Dementia & memory support',
      'Mental health care',
      'Complex-care support assessed individually',
      'Nurse-delegated support',
      'Hospice support & coordination',
    ],
  },
  {
    icon: Music,
    title: 'Activities',
    items: [
      'Movie nights & table games',
      'Exercise program',
      'Recreational music activities',
      'Hair stylist & nails',
      'Birthday & holiday celebrations',
    ],
  },
]

// The owners confirmed these services separately for both homes on 2026-08-02. The lists are
// currently identical, but the page copy still qualifies clinical support by assessment, care
// plan, scope of practice, nurse delegation, and outside-provider coordination when required.
export const servicesFull: ServiceCard[] = [
  {
    icon: Heart,
    title: 'Personal Care',
    items: [
      'Bathing, bed, grooming & dressing',
      'Personal hygiene, oral care & dentures',
      'Skin care',
      'Incontinence care',
      'Bowel & bladder retraining',
      'Laundry & housekeeping',
      'Nutritious meal preparation',
      'Transfer assistance',
      'Mobility assistance',
      'Safety supervision',
      'Emotional support & family communication',
    ],
  },
  {
    icon: Activity,
    title: 'Clinical Support',
    items: [
      'Personalized care plans',
      'Support based on assessed needs',
      'Medication reminders & assistance',
      'Medication administration support',
      'Diabetes support',
      'Insulin support, including delegated administration',
      'Nurse-delegated tasks, when authorized',
      'Wound care support',
      'Oxygen support',
      'Tube-feeding support',
      'Foley catheter care',
      'RN delegation & consultation',
    ],
  },
  {
    icon: SquarePlus,
    title: 'Specialized Support',
    items: [
      'Dementia & memory support',
      'Mental health care',
      'Stroke/CVA recovery support',
      'Cancer care support',
      'Congestive heart failure support',
      'Support for residents enrolled in hospice',
      'Coordination with outside hospice providers',
      '24-hour personal care & supervision',
    ],
  },
  {
    icon: Music,
    title: 'Daily Life & Activities',
    items: [
      'Private rooms',
      'Personal cable TV & internet',
      'In-home library',
      'Movie nights',
      'Table games',
      'Exercise program',
      'Recreational music activities',
      'Hair stylist & nails',
      'Birthday celebrations',
      'Holiday celebrations',
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
  'Nurse-delegated support',
  'Hospice coordination',
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
  'Nurse-delegated support',
  'Hospice coordination',
]

export type Faq = { q: string; a: string }

/**
 * Questions families actually type into Google. Every answer here is either a general fact
 * about the Washington adult-family-home licence class or something the owners have confirmed;
 * current owner-confirmed payment facts are stated with their qualifications. Rates still route
 * to a phone call because the owners chose not to publish them. Mirrored into FAQPage structured
 * data in data/seo.ts.
 */
export const faqs: Faq[] = [
  {
    q: 'What is an adult family home?',
    a: 'An adult family home is a licensed private residence where a small number of adults live and receive care. Washington law normally limits an adult family home to six residents, although the Department of Social and Health Services may approve a qualified home for seven or eight. Both of our homes are ordinary houses in quiet residential neighborhoods, not institutions.',
  },
  {
    q: 'How is an adult family home different from assisted living?',
    a: 'Mostly scale, and it changes everything. An assisted living facility may house dozens or hundreds of residents in apartment-style units with rotating staff. An adult family home is a real house with a handful of residents and the same small team of caregivers every day, who come to know each resident personally.',
  },
  {
    q: 'Do you provide dementia, Alzheimer’s, or memory care?',
    a: 'Yes. Washington DSHS lists Dementia and Mental Health as specialty designations for both homes. Our dementia and memory support can include care for people living with Alzheimer’s when their assessed needs can be safely met. Support includes 24-hour supervision and medication assistance. As needs change, continued placement depends on whether the home can keep meeting them safely.',
  },
  {
    q: 'What level of medical care can you provide?',
    a: 'A registered nurse serves both homes as a delegating nurse and consultant. Depending on a resident’s assessment, care plan, scope-of-practice requirements, and any required nurse delegation or outside-provider coordination, support may include medication administration, diabetes and insulin support, wound and oxygen support, tube feeding, Foley catheter care, stroke recovery, cancer and congestive-heart-failure support, and hospice coordination. Call so we can review the exact need and confirm a safe fit.',
  },
  {
    q: 'Does Medicaid pay for adult family home care in Washington?',
    a: 'The owner reports that both homes accept private pay, Medicaid, and long-term care insurance. New Medicaid-funded placement is conditional or waitlisted, and new placements generally require 24 months of private pay before a possible transition to Medicaid. Program eligibility, insurance billing, exceptions, room and board, client responsibility, availability, and final payment terms are confirmed individually.',
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
    src: '/assets/img/everett-holiday-meal.webp',
    alt: 'Holiday meal table with roast turkey, sweet potatoes, corn, green beans, flowers, and colorful place settings',
    caption: 'A holiday meal, prepared and ready to share',
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
