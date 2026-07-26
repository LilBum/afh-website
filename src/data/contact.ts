// Contact + location facts. Kept free of React/icon imports so the Vite config can
// import this at build time to generate per-route HTML, the sitemap, and robots.txt.

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

/**
 * Google Business Profile URLs, one per home. Fill these in after each profile is created and
 * verified: they become `sameAs` in the structured data, which is how Google ties this site to
 * the profile. An empty string is omitted rather than published as a dead link.
 * See docs/google-business-profile.md.
 */
export const googleBusinessProfile = {
  lynnwood: '',
  everett: '',
}

/**
 * Verified coordinates, for `geo` in the structured data. Read them off the finished Google
 * Business Profile (the pin's lat/long) rather than guessing: a pin in the wrong place sends
 * families to a stranger's door. Left null until confirmed, and omitted while null.
 */
export const geo: Record<'lynnwood' | 'everett', { latitude: number; longitude: number } | null> = {
  lynnwood: null,
  everett: null,
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
