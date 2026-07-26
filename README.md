# A&D Home Care & Aging with Grace AFH Website

Marketing site for two adult family homes under the same owners:
**A&D Home Care** (Lynnwood, WA) and **Aging with Grace AFH** (Everett, WA).
Built with **Vite + React + TypeScript + Tailwind CSS 4** (same stack as the portfolio).
Hosted on Vercel.

## Pages (client-side routes)

| Route | Status |
|---|---|
| `/` | Landing: hero, why-an-AFH, values, services overview, both-homes cards, contact |
| `/lynnwood` | **A&D Home Care, fully built**: photo tour (10 photos + lightbox), quick facts, full service lists, visit info, tour CTA |
| `/everett` | **Aging with Grace AFH, fully built**: photo tour (8 photos + lightbox), quick facts, full service lists, visit info, tour CTA |

Routing is a React Router SPA. `vercel.json` maps `/lynnwood` and `/everett` to their own
static HTML files and everything else to `index.html`.

## Search / SEO

The app renders on the client, so a crawler that does not execute JS would otherwise see one
generic `<head>` on every URL. The `seoHtml` plugin in `vite.config.ts` fixes that: on every
build it writes one HTML file per route with that route's `<title>`, description, canonical,
Open Graph/Twitter tags and JSON-LD already in `<head>`, and emits `sitemap.xml` + `robots.txt`.

`src/data/seo.ts` is the single source of truth, imported by both the build plugin and the
runtime `<Seo>` component, so the static and hydrated tags cannot drift. To add a route, add an
entry to `routeSeo` **and** a rewrite in `vercel.json`.

Deliberately absent from the structured data, because none of it is confirmed: `geo`
coordinates, `aggregateRating`/reviews, and `priceRange`. A guessed map pin or an invented
rating is worse than an omitted one.

**The website is only half of local search.** Ranking in the Google "map pack" for
*adult family home near me* comes mostly from a **Google Business Profile** for each home,
which has to be created and verified by the owners. See the TODO below.

## Stack & structure

- **Vite 8** + **React 19** + **TypeScript** + **Tailwind CSS 4** (`@tailwindcss/vite`)
- **framer-motion**: scroll-reveal animations (respects `prefers-reduced-motion`)
- **lucide-react**: icon set (replaced the old hand-written inline SVGs)
- Self-hosted fonts via `@fontsource-variable/fraunces` + `@fontsource-variable/nunito`

```
src/
  main.tsx              entry: fonts, MotionConfig, mounts <App>
  App.tsx               React Router routes + shared layout + scroll manager
  index.css             Tailwind import + design tokens (@theme) + base styles
  data/contact.ts       phone, email, addresses, areas served (no React imports, so
                        vite.config.ts can import it at build time)
  data/seo.ts           per-route title/description/canonical/OG + JSON-LD, and SITE_URL
  data/site.ts          all content: nav, services, values, chips, galleries
  lib/
    cn.ts               className joiner
    ambientMusic.ts     Web-Audio generative ambient pad engine
  components/
    Seo.tsx             per-route <title>/<meta>/JSON-LD (React 19 hoisting)
    layout/             TopBar, Navbar, Footer, MusicToggle
    ui/                 Button, Container, Section, Kicker, SectionHead,
                        Card, IconBadge, ContactCard, Reveal
    sections/           Gallery (+ lightbox), ServiceColumns, CtaBand
  pages/                Home, Lynnwood, Everett
public/
  favicon.svg           house+heart logo mark
  assets/img/           web-optimized JPGs (long edge ≤1600 px, EXIF stripped, ~170–550 KB each)
images/                 original photos & reference screenshots (NOT deployed)
```

The design tokens (cream / teal / coral palette, fonts, radii, shadows) live in the
`@theme` block of `src/index.css` and are used as Tailwind utilities (`bg-teal`,
`text-ink-soft`, `rounded-card`, `shadow-card`, …).

Background music: `src/lib/ambientMusic.ts` synthesizes a calming pad with the Web Audio
API (nothing copyrighted, no audio file). The floating toggle is `components/layout/MusicToggle.tsx`.

## Commands

```
npm install
npm run dev       # Vite dev server (http://localhost:5173)
npm run build     # tsc + vite build → dist/
npm run preview   # preview the production build
npm run lint      # eslint
```

## Contact info on the site

- **A&D Home Care (Lynnwood):** 3111 201st Pl SW, Lynnwood, WA 98036
  Phone (425) 773-0844 (owner's cell; the old landline/fax (425) 673-0745 was retired
  from the site on 2026-07-02 at the owner's request)
- **Aging with Grace AFH (Everett):** address intentionally private for now
  ("shared when you arrange a visit")
- **Email:** gabi_badet@yahoo.com

## Content notes

- The screenshots in `images/` are from a *reference* AFH site (iCare) and were used only as a
  template for which sections/services to include. All brand-specific text from that site has
  been removed.
- Service lists are the standard WA adult-family-home service menu from those references.
  Trim anything these two homes don't actually offer.
- **Strip EXIF from every photo before publishing it.** Phone photos carry GPS coordinates, and
  the Everett address is deliberately not published, so shipping the original file would leak it.
  Re-saving through Pillow without passing `exif=` drops all metadata (see the `everett-*.jpg`
  set, all of which are clean).

## TODO

- [x] **Everett photos**: `/everett` now has a real hero + 8-photo `<Gallery>`, and the home
      "Our Homes" card shows a real photo. Assets in `public/assets/img/everett-*.jpg`,
      data in `everettGallery` (`src/data/site.ts`). Replaced with the owner's own higher-res
      set on 2026-07-26, which added a private room, two bathroom/roll-in-shower shots, and
      the front garden.
- [x] **Lynnwood photos**: replaced with the owner's own set on 2026-07-26 and grown to a
      10-photo tour. `back-deck.jpg` had been mislabelled: it is the Lynnwood deck, and was
      briefly moved to Everett before the owner corrected it.
- [ ] **Google Business Profile for each home** (highest-impact item left, and not a code
      change). Create and verify a profile per home at business.google.com, category
      "Adult family home" / "Assisted living facility", link it to the matching page on this
      site, add the same photos, and keep the name/address/phone byte-identical to
      `data/contact.ts`. Then ask satisfied families for reviews. Without this the site will
      not appear in the map pack no matter how good the on-page SEO is.
- [ ] **Submit the sitemap** to Google Search Console and Bing Webmaster Tools
      (`https://afh-kg.vercel.app/sitemap.xml`), then request indexing for all three URLs.
- [ ] **Free AFH directory listings** with a link back: WA DSHS adult family home locator,
      Caring.com, APlaceForMom, SeniorAdvisor, Yelp. Local citations are a big local-SEO
      signal and cost nothing.
- [ ] **Confirm memory / dementia care** wording. "Forgetful, needs help remembering" is on
      the home page, but *dementia* and *memory care* are never used, and those are among the
      highest-volume searches families run. Add them only if the homes genuinely provide it.
- [ ] **Resident photo consent.** `celebration-meal.jpg` and `everett-celebration.jpg` show
      identifiable residents. Confirm written consent is on file for each person shown.
- [ ] **Everett address & phone**: published when the owners want them public. Publishing the
      street address would also let `geo` and a Google Business Profile be added for Everett.
- [ ] **Verify service lists**: confirm both homes offer everything listed (esp. specialized
      services like tube feeding, Foley catheter, hospice).
- [ ] **Custom domain + canonical/OG tags**: once a domain is pointed at the Vercel project.
- [ ] **License numbers**: WA AFH license numbers are often shown in the footer; add if wanted.

## Deploy

Vercel auto-detects the Vite project and runs `npm run build` → `dist/`. `vercel.json` adds the
SPA rewrite (all routes → `index.html`). `images/` (originals + reference screenshots),
`README.md`, and `.claude/` are excluded via `.vercelignore`.
