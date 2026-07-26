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
