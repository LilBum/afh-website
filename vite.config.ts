import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { NOT_FOUND_DESCRIPTION, NOT_FOUND_TITLE, renderRoute } from './src/entry-server'
import { BRAND, SITE_URL, routeSeo, type RouteSeo } from './src/data/seo'

const escapeAttr = (value: string) => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;')
const escapeText = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;')

const SEO_ATTR = 'data-seo="route"'

const urlFor = (route: RouteSeo) => `${SITE_URL}${route.path === '/' ? '/' : route.path}`

function headFor(route: RouteSeo): string {
  const url = urlFor(route)
  return [
    `<title ${SEO_ATTR}>${escapeText(route.title)}</title>`,
    `<meta ${SEO_ATTR} name="description" content="${escapeAttr(route.description)}" />`,
    `<link ${SEO_ATTR} rel="canonical" href="${url}" />`,
    `<meta ${SEO_ATTR} property="og:type" content="website" />`,
    `<meta ${SEO_ATTR} property="og:site_name" content="${escapeAttr(BRAND)}" />`,
    `<meta ${SEO_ATTR} property="og:locale" content="en_US" />`,
    `<meta ${SEO_ATTR} property="og:title" content="${escapeAttr(route.title)}" />`,
    `<meta ${SEO_ATTR} property="og:description" content="${escapeAttr(route.description)}" />`,
    `<meta ${SEO_ATTR} property="og:url" content="${url}" />`,
    `<meta ${SEO_ATTR} property="og:image" content="${route.image}" />`,
    `<meta ${SEO_ATTR} property="og:image:alt" content="${escapeAttr(route.imageAlt)}" />`,
    `<meta ${SEO_ATTR} property="og:image:width" content="${route.imageWidth}" />`,
    `<meta ${SEO_ATTR} property="og:image:height" content="${route.imageHeight}" />`,
    `<meta ${SEO_ATTR} property="og:image:type" content="${route.imageType}" />`,
    `<meta ${SEO_ATTR} name="twitter:card" content="summary_large_image" />`,
    `<meta ${SEO_ATTR} name="twitter:title" content="${escapeAttr(route.title)}" />`,
    `<meta ${SEO_ATTR} name="twitter:description" content="${escapeAttr(route.description)}" />`,
    `<meta ${SEO_ATTR} name="twitter:image" content="${route.image}" />`,
    `<meta ${SEO_ATTR} name="twitter:image:alt" content="${escapeAttr(route.imageAlt)}" />`,
    `<script ${SEO_ATTR} type="application/ld+json">${JSON.stringify(route.jsonLd).replace(/</g, '\\u003c')}</script>`,
  ]
    .map((tag) => `    ${tag}`)
    .join('\n')
}

function notFoundHead(): string {
  return [
    `<title ${SEO_ATTR}>${escapeText(NOT_FOUND_TITLE)}</title>`,
    `<meta ${SEO_ATTR} name="description" content="${escapeAttr(NOT_FOUND_DESCRIPTION)}" />`,
    `<meta ${SEO_ATTR} name="robots" content="noindex, follow" />`,
  ]
    .map((tag) => `    ${tag}`)
    .join('\n')
}

function renderDocument(template: string, head: string, body: string): string {
  const root = '<div id="root"></div>'
  if (!template.includes(root)) throw new Error('index.html is missing the empty #root marker')
  return template.replace(root, `<div id="root">${body}</div>`).replace('</head>', `${head}\n  </head>`)
}

/** Emits complete static HTML for every route and the crawl-control deployment files. */
function prerenderSeo(): Plugin {
  return {
    name: 'afh-prerender-seo',
    apply: 'build',
    enforce: 'post',
    generateBundle(_options, bundle) {
      const shell = bundle['index.html']
      if (!shell || shell.type !== 'asset') {
        this.error('index.html missing from the bundle; route pre-rendering cannot continue')
      }

      const template = String(shell.source)
        .replace(/[ \t]*<title>[\s\S]*?<\/title>\n?/, '')
        .replace(/[ \t]*<meta\s+name="description"[\s\S]*?\/>\n?/, '')

      for (const route of routeSeo) {
        const source = renderDocument(template, headFor(route), renderRoute(route.path))
        if (route.file === 'index.html') shell.source = source
        else this.emitFile({ type: 'asset', fileName: route.file, source })
      }

      const sitemap = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        ...routeSeo.map((route) => {
          const loc = urlFor(route)
          return `  <url>\n    <loc>${loc}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>${route.path === '/' ? '1.0' : '0.9'}</priority>\n  </url>`
        }),
        '</urlset>',
        '',
      ].join('\n')

      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemap })
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: ['User-agent: *', 'Allow: /', '', `Sitemap: ${SITE_URL}/sitemap.xml`, ''].join('\n'),
      })
      this.emitFile({
        type: 'asset',
        fileName: '_headers',
        source: [
          '/assets/*.js',
          '  Cache-Control: public, max-age=31536000, immutable',
          '',
          '/assets/*.css',
          '  Cache-Control: public, max-age=31536000, immutable',
          '',
          '/assets/*.woff2',
          '  Cache-Control: public, max-age=31536000, immutable',
          '',
        ].join('\n'),
      })
      this.emitFile({
        type: 'asset',
        fileName: '404.html',
        source: renderDocument(template, notFoundHead(), renderRoute('/404')),
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), prerenderSeo()],
})
