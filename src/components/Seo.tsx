import { useEffect } from 'react'
import { BRAND, SITE_URL, seoFor } from '../data/seo'

type Props =
  | {
      /** Route path, e.g. '/everett'. Looks up the shared metadata in data/seo.ts. */
      route: string
      notFound?: false
    }
  | {
      /** A real HTTP 404 page: no canonical or schema, and explicitly excluded from indexing. */
      notFound: true
      route?: never
    }

export const NOT_FOUND_TITLE = `Page Not Found | ${BRAND}`
export const NOT_FOUND_DESCRIPTION =
  `That page could not be found. Visit the ${BRAND} home page or choose A&D Home Care in Lynnwood or Aging with Grace AFH in Everett.`

const SEO_SELECTOR = '[data-seo]'

function appendHeadElement(tag: string, attributes: Record<string, string>, text?: string) {
  const element = document.createElement(tag)
  element.dataset.seo = 'route'
  for (const [name, value] of Object.entries(attributes)) element.setAttribute(name, value)
  if (text !== undefined) element.textContent = text
  document.head.appendChild(element)
}

function replaceHeadMetadata(route: string | undefined, notFound: boolean) {
  document.head.querySelectorAll(SEO_SELECTOR).forEach((element) => element.remove())

  if (notFound) {
    appendHeadElement('title', {}, NOT_FOUND_TITLE)
    appendHeadElement('meta', { name: 'description', content: NOT_FOUND_DESCRIPTION })
    appendHeadElement('meta', { name: 'robots', content: 'noindex, follow' })
    return
  }

  const { path, title, description, image, imageAlt, imageWidth, imageHeight, imageType, jsonLd } = seoFor(
    route ?? '/',
  )
  const url = `${SITE_URL}${path === '/' ? '/' : path}`

  appendHeadElement('title', {}, title)
  appendHeadElement('meta', { name: 'description', content: description })
  appendHeadElement('link', { rel: 'canonical', href: url })

  appendHeadElement('meta', { property: 'og:type', content: 'website' })
  appendHeadElement('meta', { property: 'og:site_name', content: BRAND })
  appendHeadElement('meta', { property: 'og:locale', content: 'en_US' })
  appendHeadElement('meta', { property: 'og:title', content: title })
  appendHeadElement('meta', { property: 'og:description', content: description })
  appendHeadElement('meta', { property: 'og:url', content: url })
  appendHeadElement('meta', { property: 'og:image', content: image })
  appendHeadElement('meta', { property: 'og:image:alt', content: imageAlt })
  appendHeadElement('meta', { property: 'og:image:width', content: imageWidth })
  appendHeadElement('meta', { property: 'og:image:height', content: imageHeight })
  appendHeadElement('meta', { property: 'og:image:type', content: imageType })

  appendHeadElement('meta', { name: 'twitter:card', content: 'summary_large_image' })
  appendHeadElement('meta', { name: 'twitter:title', content: title })
  appendHeadElement('meta', { name: 'twitter:description', content: description })
  appendHeadElement('meta', { name: 'twitter:image', content: image })
  appendHeadElement('meta', { name: 'twitter:image:alt', content: imageAlt })

  appendHeadElement('script', { type: 'application/ld+json' }, JSON.stringify(jsonLd))
}

/** Keeps the single pre-rendered metadata set current after client-side route changes. */
export default function Seo(props: Props) {
  const route = 'route' in props ? props.route : undefined
  const notFound = props.notFound === true

  useEffect(() => {
    replaceHeadMetadata(route, notFound)
  }, [notFound, route])

  return null
}
