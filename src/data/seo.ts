// Single source of truth for per-route search metadata.
//
// Consumed twice: at runtime by <Seo> (React 19 hoists the tags into <head>) and at
// build time by the `seoHtml` plugin in vite.config.ts, which stamps the same tags into
// a static HTML file per route. The static copy is what matters for search: crawlers and
// link unfurlers see the right title, description, canonical and JSON-LD without running JS.

import { areasServed, geo, googleBusinessProfile, site, team } from './contact'
import { faqs } from './site'

/**
 * Every canonical, Open Graph URL, sitemap entry and robots.txt line derives from this.
 * Changing it is the whole domain switch.
 */
export const SITE_URL = 'https://kingsgateafh.org'

const BRAND = 'A&D Home Care & Aging with Grace AFH'

const ORG_ID = `${SITE_URL}/#organization`
const LYNNWOOD_ID = `${SITE_URL}/lynnwood#home`
const EVERETT_ID = `${SITE_URL}/everett#home`

/** Care needs families actually search for. Mirrors `servicesFull` in site.ts. */
const CARE_SERVICES = [
  'Dementia care',
  'Alzheimer’s care',
  'Memory care',
  'Mental health care',
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

/** Drops empty/null keys, so an unconfirmed fact is omitted rather than published blank. */
function compact<T extends Record<string, unknown>>(obj: T): T {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== null && v !== undefined && v !== ''),
  ) as T
}

function geoFor(home: 'lynnwood' | 'everett') {
  const coords = geo[home]
  return coords ? { '@type': 'GeoCoordinates', ...coords } : null
}

function licenseId(number: string) {
  return {
    '@type': 'PropertyValue',
    name: 'Washington State DSHS adult family home license',
    value: number,
  }
}

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

// The parent corporation, which is why the site lives on kingsgateafh.org. Both homes hang off
// this as `parentOrganization`. Swap `name` for the exact registered legal name when confirmed.
const organization = {
  '@type': 'Organization',
  '@id': ORG_ID,
  name: 'Kingsgate',
  alternateName: BRAND,
  url: SITE_URL,
  logo: `${SITE_URL}/assets/favicon.svg`,
  telephone: site.phoneTel,
  email: site.email,
  areaServed: AREA_SERVED,
  founder: {
    '@type': 'Person',
    name: team.ownerName,
    jobTitle: 'Owner',
    hasCredential: {
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: team.ownerCredential,
    },
  },
  description:
    'Two licensed adult family homes providing 24-hour senior care in Lynnwood and Everett, Washington.',
}

// `geo` and `sameAs` stay absent until the values are confirmed; see data/contact.ts.
const lynnwoodHome = compact({
  '@type': 'LocalBusiness',
  '@id': LYNNWOOD_ID,
  name: 'A&D Home Care',
  alternateName: 'A&D Home Care Adult Family Home',
  description:
    'Licensed adult family home in Lynnwood, Washington, with dementia and mental health care, private rooms, family-style dining and 24-hour professional care.',
  url: `${SITE_URL}/lynnwood`,
  telephone: site.phoneTel,
  email: site.email,
  image: [
    `${SITE_URL}/assets/img/lynnwood-exterior.webp`,
    `${SITE_URL}/assets/img/living-room.webp`,
    `${SITE_URL}/assets/img/lynnwood-bedroom.webp`,
  ],
  address: {
    '@type': 'PostalAddress',
    streetAddress: site.lynnwood.street,
    addressLocality: 'Lynnwood',
    addressRegion: 'WA',
    postalCode: '98036',
    addressCountry: 'US',
  },
  geo: geoFor('lynnwood'),
  sameAs: googleBusinessProfile.lynnwood || null,
  identifier: licenseId(site.lynnwood.license),
  hasMap: site.lynnwood.mapsUrl,
  areaServed: AREA_SERVED,
  openingHoursSpecification: OPEN_ALWAYS,
  parentOrganization: { '@id': ORG_ID },
  hasOfferCatalog: offerCatalog('Care and services at A&D Home Care'),
})

const everettHome = compact({
  '@type': 'LocalBusiness',
  '@id': EVERETT_ID,
  name: 'Aging with Grace AFH',
  alternateName: 'Aging with Grace Adult Family Home',
  description:
    'Licensed adult family home in Everett, Washington, with dementia and mental health care, private rooms, roll-in showers and 24-hour professional care.',
  url: `${SITE_URL}/everett`,
  telephone: site.phoneTel,
  email: site.email,
  image: [
    `${SITE_URL}/assets/img/everett-exterior.webp`,
    `${SITE_URL}/assets/img/everett-bedroom.webp`,
    `${SITE_URL}/assets/img/everett-dining.webp`,
  ],
  address: {
    '@type': 'PostalAddress',
    streetAddress: site.everett.street,
    addressLocality: 'Everett',
    addressRegion: 'WA',
    postalCode: '98208',
    addressCountry: 'US',
  },
  geo: geoFor('everett'),
  sameAs: googleBusinessProfile.everett || null,
  identifier: licenseId(site.everett.license),
  hasMap: site.everett.mapsUrl,
  areaServed: AREA_SERVED,
  openingHoursSpecification: OPEN_ALWAYS,
  parentOrganization: { '@id': ORG_ID },
  hasOfferCatalog: offerCatalog('Care and services at Aging with Grace AFH'),
})

// Google now shows FAQ rich results almost only for government and health authorities, so the
// value here is the content itself ranking for long-tail questions and being quotable by answer
// engines. The markup costs nothing and keeps the option open.
const faqPage = {
  '@type': 'FAQPage',
  '@id': `${SITE_URL}/#faq`,
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.q,
    acceptedAnswer: { '@type': 'Answer', text: faq.a },
  })),
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
    title: 'Adult Family Homes in Lynnwood & Everett, WA | Dementia & Senior Care',
    description: `Licensed adult family homes in Lynnwood and Everett, WA. Dementia, memory and mental health care, 24-hour care, RN available as needed, private rooms. Serving Snohomish County. Call ${site.phone}.`,
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
        faqPage,
      ],
    },
  },
  {
    path: '/lynnwood',
    file: 'lynnwood.html',
    title: 'Adult Family Home in Lynnwood, WA | Dementia & Memory Care',
    description: `A&D Home Care is a licensed adult family home in Lynnwood, WA. Dementia, memory and mental health care, private rooms, 24-hour care, RN as needed, step-free showers. Call ${site.phone}.`,
    image: `${SITE_URL}/assets/og/og-lynnwood.jpg`,
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [lynnwoodHome, breadcrumb('Lynnwood Home', '/lynnwood')],
    },
  },
  {
    path: '/everett',
    file: 'everett.html',
    title: 'Adult Family Home in Everett, WA | Dementia & Memory Care',
    description: `Aging with Grace AFH is a licensed adult family home at ${site.everett.oneLine}. Dementia, memory and mental health care, private rooms, 24-hour care, roll-in showers. Call ${site.phone}.`,
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
