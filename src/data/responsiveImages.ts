export type ResponsiveImageMetadata = {
  width: number
  height: number
  variants: readonly number[]
}

const manifest = {
  '/assets/img/back-deck.webp': { width: 1200, height: 900, variants: [480, 768, 960] },
  '/assets/img/celebration-table.webp': { width: 897, height: 1200, variants: [480, 768] },
  '/assets/img/dining-room.webp': { width: 554, height: 1200, variants: [480] },
  '/assets/img/everett-bathroom.webp': { width: 900, height: 1200, variants: [480, 768] },
  '/assets/img/everett-bedroom.webp': { width: 908, height: 1200, variants: [480, 768] },
  '/assets/img/everett-deck-flowers.webp': { width: 900, height: 1200, variants: [480, 768] },
  '/assets/img/everett-deck.webp': { width: 901, height: 1200, variants: [480, 768] },
  '/assets/img/everett-dining.webp': { width: 900, height: 1200, variants: [480, 768] },
  '/assets/img/everett-exterior.webp': { width: 900, height: 1200, variants: [480, 768] },
  '/assets/img/everett-garden.webp': { width: 900, height: 1200, variants: [480, 768] },
  '/assets/img/everett-holiday-meal.webp': { width: 1179, height: 891, variants: [480, 768, 960] },
  '/assets/img/everett-shower.webp': { width: 949, height: 1200, variants: [480, 768] },
  '/assets/img/kitchen.webp': { width: 896, height: 1200, variants: [480, 768] },
  '/assets/img/living-room.webp': { width: 893, height: 1200, variants: [480, 768] },
  '/assets/img/lynnwood-bathroom.webp': { width: 900, height: 1200, variants: [480, 768] },
  '/assets/img/lynnwood-bedroom.webp': { width: 1200, height: 900, variants: [480, 768, 960] },
  '/assets/img/lynnwood-exterior.webp': { width: 1184, height: 1200, variants: [480, 768, 960] },
  '/assets/img/lynnwood-fountain.webp': { width: 1080, height: 950, variants: [480, 768, 960] },
  '/assets/img/lynnwood-shower.webp': { width: 900, height: 1200, variants: [480, 768] },
} as const satisfies Record<string, ResponsiveImageMetadata>

export type ResponsiveImagePath = keyof typeof manifest

export const responsiveImageManifest: Readonly<Record<string, ResponsiveImageMetadata>> = manifest
