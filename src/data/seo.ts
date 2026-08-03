// Single source of truth for per-route search metadata.
//
// Consumed twice: at runtime by <Seo> (React 19 hoists the tags into <head>) and at
// build time by the `seoHtml` plugin in vite.config.ts, which stamps the same tags into
// a static HTML file per route. The static copy is what matters for search: crawlers and
// link unfurlers see the right title, description, canonical and JSON-LD without running JS.

import { areasServed, businessIdentity, geo, googleBusinessProfile, site, team } from './contact'
import { faqs } from './site'

/**
 * Every canonical, Open Graph URL, sitemap entry and robots.txt line derives from this.
 * Changing it is the whole domain switch.
 */
export const SITE_URL = 'https://kingsgateafh.org'

export const BRAND = businessIdentity.publicName

const ORG_ID = `${SITE_URL}/#organization`
const LYNNWOOD_ID = `${SITE_URL}/lynnwood#home`
const EVERETT_ID = `${SITE_URL}/everett#home`

/** Care needs families actually search for. Mirrors `servicesFull` in site.ts. */
const CARE_SERVICES = [
  'Dementia and memory support',
  'Mental health support',
  '24-hour personal care and supervision',
  'Medication reminders and assistance',
  'Medication administration support based on assessment and caregiver scope',
  'Diabetes and insulin support based on assessment and any required nurse delegation',
  'Incontinence care',
  'Nurse-delegated support based on assessment and care plan',
  'Higher-acuity support based on assessment, care plan, scope of practice, and outside-provider coordination',
  'Hospice support and outside-provider coordination',
  'Mobility and transfer assistance',
  'Bathing, grooming and dressing',
  'Home-cooked meals',
  'Exercise and recreational music activities',
]

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const AREA_SERVED = areasServed.map((name) => ({
  '@type': name === 'Snohomish County' ? 'AdministrativeArea' : 'City',
  name: `${name}, WA`,
}))

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

function publicHours(opens: string, closes: string) {
  return {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: DAYS,
    opens,
    closes,
  }
}

const HOME_FOUNDER_ID = `${SITE_URL}/#gabriela-badet`

const homeFounder = {
  '@type': 'Person',
  '@id': HOME_FOUNDER_ID,
  name: team.ownerName,
}

// Public website publisher and legal parent, confirmed by the owner on 2026-08-02.
const organization = {
  '@type': 'Organization',
  '@id': ORG_ID,
  name: businessIdentity.publicName,
  legalName: businessIdentity.legalName,
  url: SITE_URL,
  logo: `${SITE_URL}/assets/favicon.svg`,
  telephone: site.phoneTel,
  email: site.email,
  subOrganization: [{ '@id': LYNNWOOD_ID }, { '@id': EVERETT_ID }],
  areaServed: AREA_SERVED,
  description:
    'Two licensed adult family homes providing 24-hour senior care in Lynnwood and Everett, Washington.',
}

// Location facts and public profile URLs come from the centralized contact data.
const lynnwoodHome = compact({
  '@type': 'LocalBusiness',
  '@id': LYNNWOOD_ID,
  name: 'A&D Home Care',
  description:
    'Licensed adult family home in Lynnwood, Washington, with DSHS-listed Dementia and Mental Health specialty designations, private rooms and 24-hour personal care.',
  url: `${SITE_URL}/lynnwood`,
  telephone: site.lynnwood.phoneTel,
  email: site.email,
  parentOrganization: { '@id': ORG_ID },
  founder: { '@id': HOME_FOUNDER_ID },
  openingHoursSpecification: publicHours(
    site.lynnwood.openingHours.opens,
    site.lynnwood.openingHours.closes,
  ),
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
  hasOfferCatalog: offerCatalog('Care and services at A&D Home Care'),
})

const everettHome = compact({
  '@type': 'LocalBusiness',
  '@id': EVERETT_ID,
  name: 'Aging with Grace AFH',
  description:
    'Licensed adult family home in Everett, Washington, with DSHS-listed Dementia and Mental Health specialty designations, private rooms and 24-hour personal care.',
  url: `${SITE_URL}/everett`,
  telephone: site.everett.phoneTel,
  faxNumber: site.everett.faxTel,
  email: site.email,
  parentOrganization: { '@id': ORG_ID },
  founder: { '@id': HOME_FOUNDER_ID },
  openingHoursSpecification: publicHours(
    site.everett.openingHours.opens,
    site.everett.openingHours.closes,
  ),
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
  imageAlt: string
  imageWidth: string
  imageHeight: string
  imageType: 'image/jpeg'
  jsonLd: Record<string, unknown>
}

export const routeSeo: RouteSeo[] = [
  {
    path: '/',
    file: 'index.html',
    title: 'Kingsgate AFH, Inc | Adult Family Homes in Lynnwood & Everett',
    description:
      'Two licensed adult family homes in Lynnwood and Everett, WA, with DSHS-listed dementia and mental health specialties, private rooms and tours by appointment.',
    image: `${SITE_URL}/assets/og/og-home.jpg`,
    imageAlt: 'A&D Home Care in Lynnwood and Aging with Grace AFH in Everett, Washington',
    imageWidth: '1200',
    imageHeight: '630',
    imageType: 'image/jpeg',
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
        homeFounder,
        lynnwoodHome,
        everettHome,
        faqPage,
      ],
    },
  },
  {
    path: '/lynnwood',
    file: 'lynnwood.html',
    title: 'A&D Home Care | Adult Family Home in Lynnwood, WA',
    description:
      'A&D Home Care is a licensed Lynnwood adult family home offering 24-hour care, dementia support, nurse-delegated services, hospice coordination and private rooms.',
    image: `${SITE_URL}/assets/og/og-lynnwood.jpg`,
    imageAlt: 'Exterior of A&D Home Care adult family home in Lynnwood, Washington',
    imageWidth: '1200',
    imageHeight: '630',
    imageType: 'image/jpeg',
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [organization, homeFounder, lynnwoodHome, breadcrumb('Lynnwood Home', '/lynnwood')],
    },
  },
  {
    path: '/everett',
    file: 'everett.html',
    title: 'Aging with Grace AFH | Adult Family Home in Everett, WA',
    description:
      'Aging with Grace AFH is a licensed Everett adult family home offering 24-hour care, dementia support, nurse-delegated services, hospice coordination and private rooms.',
    image: `${SITE_URL}/assets/og/og-everett.jpg`,
    imageAlt: 'Exterior of Aging with Grace AFH adult family home in Everett, Washington',
    imageWidth: '1200',
    imageHeight: '630',
    imageType: 'image/jpeg',
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [organization, homeFounder, everettHome, breadcrumb('Everett Home', '/everett')],
    },
  },
]

export function seoFor(path: string): RouteSeo {
  return routeSeo.find((r) => r.path === path) ?? routeSeo[0]
}
