# Kingsgate AFH, Inc Website

Marketing site for two licensed adult family homes: **A&D Home Care** (Lynnwood, WA) and
**Aging with Grace AFH** (Everett, WA).

Built with Vite + React + TypeScript + Tailwind CSS 4, deployed as a Cloudflare Worker
serving static assets with a small API route.

Live: https://kingsgateafh.org

## Pages

Three pre-rendered routes — `/`, `/lynnwood`, `/everett` — each with its own metadata,
photo tour, service lists, and contact flows. React Router takes over after hydration.
The build emits complete HTML for all three so the pages work without JavaScript and
index cleanly. A top-level `404.html` keeps unknown URLs from falling back to the home page.

## Room availability

Availability is not baked into the pre-rendered pages. The browser reads `/api/availability`,
which the Worker validates and proxies from a Google Form + Apps Script workflow, so the
owners can update it without touching code or redeploying.

The Worker only accepts a well-formed Apps Script execution URL, caches at the edge, and
expires stale entries. Missing, invalid, expired, or unreachable data all degrade to
**Call for current availability** rather than showing something wrong.

## SEO

Per-route titles, descriptions, and social cards; LocalBusiness, FAQ, and Breadcrumb
structured data; a sitemap and robots rules; verified geo coordinates for both homes.
`npm run verify:seo` checks the built output for regressions.

## Commands

```sh
npm run dev          # dev server
npm run build        # typecheck + build + pre-render routes
npm run preview      # serve the production build
npm run lint         # eslint
npm run verify:seo   # assert built HTML metadata and structured data
```

## Layout

```
src/
  data/        content and config (contact, services, photos) - no React imports
  components/  UI
  pages/       route components
worker/
  index.ts     static assets + validated /api/availability proxy
scripts/       build-time pre-render, SEO verification, Apps Script sources
```

## Deploying

Pushes to `main` deploy through Cloudflare's git integration. The availability source URL
is set as a Worker variable in the Cloudflare dashboard, not in this repo.
