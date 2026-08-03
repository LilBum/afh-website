// Contact + location facts. Kept free of React/icon imports so the Vite config can
// import this at build time to generate per-route HTML, the sitemap, and robots.txt.

const confirmedPayment = {
  acceptedPrograms: [
    'Private pay',
    'Medicaid',
    'long-term care insurance',
  ],
  medicaidIntake: 'Conditional or waitlist',
  privatePayMonthsBeforeMedicaid: 24,
  clientResponsibility: 'Room and board and other client responsibility are confirmed individually.',
  ratesPublished: false,
  confirmedBy: 'Gabriela Badet, provider',
} as const

export const businessIdentity = {
  legalName: 'Kingsgate AFH, Inc',
  publicName: 'Kingsgate AFH, Inc',
  relationship: 'Legal parent of A&D Home Care and Aging with Grace AFH',
  founder: 'Gabriela Badet',
} as const

export const site = {
  name: businessIdentity.publicName,
  /** Shared owner contact approved for both homes. Each location also has a primary number. */
  phone: '(425) 773-0844',
  phoneTel: '+14257730844',
  email: 'gabi_badet@yahoo.com',
  lynnwood: {
    name: 'A&D Home Care',
    street: '3111 201st Pl SW',
    cityState: 'Lynnwood, WA 98036',
    oneLine: '3111 201st Pl SW, Lynnwood, WA 98036',
    phone: '(425) 673-0745',
    phoneTel: '+14256730745',
    publicContactHours: 'Daily, 9:30 AM–7:00 PM',
    openingHours: { opens: '09:30', closes: '19:00' },
    callsAnswered24Hours: true,
    caregivingCoverage24Hours: true,
    tourPolicy: 'Daily, by appointment',
    licensedCapacity: 6,
    founded: 2007,
    payment: confirmedPayment,
    mapsUrl: 'https://maps.google.com/?q=3111+201st+Pl+SW,+Lynnwood,+WA+98036',
    license: '750676',
    dshsServicesUrl: 'https://fortress.wa.gov/dshs/adsaapps/lookup/AFHServices.aspx?ref=pub&Lic=750676',
    dshsReportsUrl: 'https://fortress.wa.gov/dshs/adsaapps/lookup/AFHForms.aspx?ref=pub&Lic=750676',
  },
  everett: {
    name: 'Aging with Grace AFH',
    street: '2825 132nd St SE',
    cityState: 'Everett, WA 98208',
    oneLine: '2825 132nd St SE, Everett, WA 98208',
    phone: '(425) 357-8630',
    phoneTel: '+14253578630',
    fax: '(425) 225-5721',
    faxTel: '+14252255721',
    publicContactHours: 'Daily, 10:00 AM–7:00 PM',
    openingHours: { opens: '10:00', closes: '19:00' },
    callsAnswered24Hours: true,
    caregivingCoverage24Hours: true,
    tourPolicy: 'Daily, by appointment only',
    licensedCapacity: 5,
    founded: 2017,
    payment: confirmedPayment,
    mapsUrl: 'https://maps.google.com/?q=2825+132nd+St+SE,+Everett,+WA+98208',
    license: '753460',
    dshsServicesUrl: 'https://fortress.wa.gov/dshs/adsaapps/lookup/AFHServices.aspx?ref=pub&Lic=753460',
    dshsReportsUrl: 'https://fortress.wa.gov/dshs/adsaapps/lookup/AFHForms.aspx?ref=pub&Lic=753460',
  },
} as const

/**
 * Who actually provides the care. None of the competing local sites name a credential, and it
 * is the thing families are really deciding on, so it is worth stating plainly.
 *
 * The registered nurse is a delegating nurse and consultant rather than a confirmed employee,
 * so no RN headcount is recorded here and nothing on the site says "on staff" or "on call".
 */
export const team = {
  ownerName: 'Gabriela Badet',
  ownerYears: 21,
  ownerExperience: 'senior care and adult family home ownership',
  ownerCredential: 'Nursing Assistant Registered (NAR)',
  rnRelationship: 'delegating nurse and consultant for both homes',
  /** Credentials the caregiving staff hold, per the owners. No headcounts: those change. */
  staffCredentials: ['NARs', 'CNAs', 'home care aides'],
} as const

/**
 * Public Google Business Profile URLs, one per home. These become `sameAs` in the structured
 * data, tying each location page to its corresponding Google local entity.
 * See docs/google-business-profile.md.
 */
export const googleBusinessProfile = {
  lynnwood:
    'https://www.google.com/maps/search/?api=1&query=A%26D+Home+Care%2C+3111+201st+Pl+SW%2C+Lynnwood%2C+WA+98036&query_place_id=ChIJaxJvgigFkFQRKmnvYcpcDls',
  everett:
    'https://www.google.com/maps/search/?api=1&query=Aging+with+Grace+AFH%2C+2825+132nd+St+SE%2C+Everett%2C+WA+98208&query_place_id=ChIJd1Trjb8HkFQRccCFBlr-GLg',
}

/**
 * Verified coordinates, for `geo` in the structured data. Read them off the finished Google
 * Business Profile (the pin's lat/long) rather than guessing: a pin in the wrong place sends
 * families to a stranger's door. Left null until confirmed, and omitted while null.
 */
export const geo: Record<'lynnwood' | 'everett', { latitude: number; longitude: number } | null> = {
  lynnwood: { latitude: 47.81636, longitude: -122.275212 },
  everett: { latitude: 47.878331, longitude: -122.193748 },
}

/** Cities both homes draw families from, used in copy and in `areaServed`. */
export const areasServed = [
  'Lynnwood',
  'Everett',
  'Edmonds',
  'Mountlake Terrace',
  'Mukilteo',
  'Brier',
  'Bothell',
  'Snohomish County',
] as const
