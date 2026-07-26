// Single source of truth for per-route search metadata.
//
// Consumed twice: at runtime by <Seo> (React 19 hoists the tags into <head>) and at
// build time by the `seoHtml` plugin in vite.config.ts, which stamps the same tags into
// a static HTML file per route. The static copy is what matters for search: crawlers and
// link unfurlers see the right title, description, canonical and JSON-LD without running JS.

import { areasServed, site } from './contact'

/** No custom domain yet. Change this one line when one is pointed at the Vercel project. */
export const SITE_URL = 'https://afh-kg.vercel.app'

const BRAND = 'A&D Home Care & Aging with Grace AFH'

const ORG_ID = `${SITE_URL}/#organization`
const LYNNWOOD_ID = `${SITE_URL}/lynnwood#home`
const EVERETT_ID = `${SITE_URL}/everett#home`

/** Care needs families actually search for. Mirrors `servicesFull` in site.ts. */
const CARE_SERVICES = [
  '24-hour care',
  'Medication management',
  'Diabetes care',
  'Stroke (CVA) care',
  'Wound care',
  'Oxygen therapy',
  'Tube feeding',
  'Foley catheter care',
  'Incontinence care',
  'Bowel and bladder retraining',
  'Cancer care',
  'Congestive heart failure care',
  'Hospice care',
  'Mobility and transfer assistance',
  'Bathing, grooming and dressing',
  'Home-cooked meals',
]

const AREA_SERVED = areasServed.map((name) => ({
  '@type': name === 'Snohomish County' ? 'AdministrativeArea' : 'City',
  name: `${name}, WA`,
}))

/** Licensed 24-hour residential care, so the door is never closed. */
const OPEN_ALWAYS = [
  {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    opens: '00:00',
    closes: '23:59',
  },
]

function offerCatalog(name: string) {
  return {
    '@type': 'OfferCatalog',
    name,
    itemListElement: CARE_SERVICES.map((service) => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Service', name: service },
    })),
  }
}

const organization = {
  '@type': 'Organization',
  '@id': ORG_ID,
  name: BRAND,
  url: SITE_URL,
  logo: `${SITE_URL}/assets/favicon.svg`,
  telephone: site.phoneTel,
  email: site.email,
  areaServed: AREA_SERVED,
  description:
    'Two licensed adult family homes providing 24-hour senior care in Lynnwood and Everett, Washington.',
}

// No geo coordinates: the exact latitude/longitude has not been confirmed, and a guessed
// pin is worse than none. Add `geo` once the owners verify it.
const lynnwoodHome = {
  '@type': 'LocalBusiness',
  '@id': LYNNWOOD_ID,
  name: 'A&D Home Care',
  alternateName: 'A&D Home Care Adult Family Home',
  description:
    'Licensed adult family home in Lynnwood, Washington, with private rooms, family-style dining and 24-hour professional care.',
  url: `${SITE_URL}/lynnwood`,
  telephone: site.phoneTel,
  email: site.email,
  image: [
    `${SITE_URL}/assets/img/living-room.jpg`,
    `${SITE_URL}/assets/img/kitchen.jpg`,
    `${SITE_URL}/assets/img/dining-room.jpg`,
  ],
  address: {
    '@type': 'PostalAddress',
    streetAddress: site.lynnwood.street,
    addressLocality: 'Lynnwood',
    addressRegion: 'WA',
    postalCode: '98036',
    addressCountry: 'US',
  },
  hasMap: site.lynnwood.mapsUrl,
  areaServed: AREA_SERVED,
  openingHoursSpecification: OPEN_ALWAYS,
  parentOrganization: { '@id': ORG_ID },
  hasOfferCatalog: offerCatalog('Care and services at A&D Home Care'),
}

const everettHome = {
  '@type': 'LocalBusiness',
  '@id': EVERETT_ID,
  name: 'Aging with Grace AFH',
  alternateName: 'Aging with Grace Adult Family Home',
  description:
    'Licensed adult family home in Everett, Washington, with private rooms, roll-in showers, landscaped gardens and 24-hour professional care.',
  url: `${SITE_URL}/everett`,
  telephone: site.phoneTel,
  email: site.email,
  image: [
    `${SITE_URL}/assets/img/everett-exterior.jpg`,
    `${SITE_URL}/assets/img/everett-bedroom.jpg`,
    `${SITE_URL}/assets/img/everett-dining.jpg`,
  ],
  // Street address is deliberately withheld until the owners publish it.
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Everett',
    addressRegion: 'WA',
    addressCountry: 'US',
  },
  areaServed: AREA_SERVED,
  openingHoursSpecification: OPEN_ALWAYS,
  parentOrganization: { '@id': ORG_ID },
  hasOfferCatalog: offerCatalog('Care and services at Aging with Grace AFH'),
}

function breadcrumb(name: string, path: string) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name, item: `${SITE_URL}${path}` },
    ],
  }
}

export type RouteSeo = {
  /** Route path as served. */
  path: string
  /** Static file the Vite plugin writes into dist. */
  file: string
  title: string
  description: string
  /** Social preview image, 1200x630. */
  image: string
  jsonLd: Record<string, unknown>
}

export const routeSeo: RouteSeo[] = [
  {
    path: '/',
    file: 'index.html',
    title: 'Adult Family Homes in Lynnwood & Everett, WA | A&D Home Care',
    description: `Licensed adult family homes in Lynnwood and Everett, WA. 24-hour care, RN on call, private rooms and home-cooked meals, serving Snohomish County. Call ${site.phone}.`,
    image: `${SITE_URL}/assets/og/og-home.jpg`,
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          '@id': `${SITE_URL}/#website`,
          url: SITE_URL,
          name: BRAND,
          publisher: { '@id': ORG_ID },
          inLanguage: 'en-US',
        },
        organization,
        lynnwoodHome,
        everettHome,
      ],
    },
  },
  {
    path: '/lynnwood',
    file: 'lynnwood.html',
    title: 'Adult Family Home in Lynnwood, WA | A&D Home Care',
    description: `Licensed adult family home in Lynnwood, WA. Private rooms, 24-hour care, RN on call, medication management, diabetes, stroke and hospice care. Call ${site.phone}.`,
    image: `${SITE_URL}/assets/og/og-lynnwood.jpg`,
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [lynnwoodHome, breadcrumb('Lynnwood Home', '/lynnwood')],
    },
  },
  {
    path: '/everett',
    file: 'everett.html',
    title: 'Adult Family Home in Everett, WA | Aging with Grace AFH',
    description: `Licensed adult family home in Everett, WA. Private rooms, 24-hour care, RN on call, roll-in showers, home-cooked meals and family-style dining. Call ${site.phone}.`,
    image: `${SITE_URL}/assets/og/og-everett.jpg`,
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [everettHome, breadcrumb('Everett Home', '/everett')],
    },
  },
]

export function seoFor(path: string): RouteSeo {
  return routeSeo.find((r) => r.path === path) ?? routeSeo[0]
}
