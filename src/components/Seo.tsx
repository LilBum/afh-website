import { SITE_URL, seoFor } from '../data/seo'

type Props = {
  /** Route path, e.g. '/everett'. Looks up the shared metadata in data/seo.ts. */
  route: string
}

/**
 * Per-route document metadata. React 19 hoists rendered <title>/<meta>/<link> into <head>.
 * The same values are baked into a static HTML file per route at build time (see the
 * `seoHtml` plugin in vite.config.ts), so crawlers get them without executing JS.
 */
export default function Seo({ route }: Props) {
  const { path, title, description, image, jsonLd } = seoFor(route)
  const url = `${SITE_URL}${path === '/' ? '' : path}`

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="A&D Home Care & Aging with Grace AFH" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  )
}
