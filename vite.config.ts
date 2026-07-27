import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { SITE_URL, routeSeo, type RouteSeo } from './src/data/seo'

const escapeAttr = (value: string) => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;')
const escapeText = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;')

const OG_SITE_NAME = 'A&D Home Care & Aging with Grace AFH'

function headFor(route: RouteSeo): string {
  const url = `${SITE_URL}${route.path === '/' ? '' : route.path}`
  return [
    `<title>${escapeText(route.title)}</title>`,
    `<meta name="description" content="${escapeAttr(route.description)}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${escapeAttr(OG_SITE_NAME)}" />`,
    `<meta property="og:locale" content="en_US" />`,
    `<meta property="og:title" content="${escapeAttr(route.title)}" />`,
    `<meta property="og:description" content="${escapeAttr(route.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${route.image}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeAttr(route.title)}" />`,
    `<meta name="twitter:description" content="${escapeAttr(route.description)}" />`,
    `<meta name="twitter:image" content="${route.image}" />`,
    `<script type="application/ld+json">${JSON.stringify(route.jsonLd).replace(/</g, '\\u003c')}</script>`,
  ]
    .map((tag) => `    ${tag}`)
    .join('\n')
}

/**
 * Emits one static HTML file per route, each with that route's title, description,
 * canonical, Open Graph tags and JSON-LD already in <head>, plus sitemap.xml and robots.txt.
 *
 * The app is a client-rendered SPA, so without this every URL served the same generic
 * <head> and a crawler had to execute JS to find anything page-specific. vercel.json maps
 * each route to its file; the SPA still boots and renders the right route from the URL.
 */
function seoHtml(): Plugin {
  return {
    name: 'afh-seo-html',
    apply: 'build',
    enforce: 'post',
    generateBundle(_options, bundle) {
      const shell = bundle['index.html']
      if (!shell || shell.type !== 'asset') {
        this.warn('index.html missing from the bundle, skipped SEO head generation')
        return
      }

      // Drop the placeholder tags from index.html; every route supplies its own.
      const template = String(shell.source)
        .replace(/[ \t]*<title>[\s\S]*?<\/title>\n?/, '')
        .replace(/[ \t]*<meta\s+name="description"[\s\S]*?\/>\n?/, '')

      for (const route of routeSeo) {
        const source = template.replace('</head>', `${headFor(route)}\n  </head>`)
        if (route.file === 'index.html') {
          shell.source = source
        } else {
          this.emitFile({ type: 'asset', fileName: route.file, source })
        }
      }

      const sitemap = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        ...routeSeo.map((route) => {
          const loc = `${SITE_URL}${route.path === '/' ? '/' : route.path}`
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

      // Cloudflare Pages equivalent of the rewrites in vercel.json. Status 200 makes each a
      // rewrite rather than a redirect, so the URL the visitor sees does not change. Harmless
      // on Vercel, which ignores the file, so the build stays portable between both hosts.
      //
      // Deliberately no `/* /index.html 200` catch-all: Cloudflare rejects it at build time,
      // because its clean-URL handling strips `/index` and the rewrite re-enters its own rule.
      // Unmatched paths are handled by 404.html below instead, which is the better behaviour
      // anyway. The old catch-all answered every typo with 200 and a page, which is a soft 404.
      this.emitFile({
        type: 'asset',
        fileName: '_redirects',
        source: [
          ...routeSeo.filter((r) => r.file !== 'index.html').map((r) => `${r.path} /${r.file} 200`),
          '',
        ].join('\n'),
      })

      // Unknown paths: Cloudflare Pages serves this with a 404 status, and Vercel's catch-all
      // rewrite means it never fires there. The app boots and its `path="*"` route sends the
      // visitor to the home page, so a mistyped URL still lands somewhere useful.
      this.emitFile({
        type: 'asset',
        fileName: '404.html',
        source: template.replace('</head>', `${headFor(routeSeo[0])}\n  </head>`),
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), seoHtml()],
})
