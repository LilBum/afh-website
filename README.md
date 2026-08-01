# A&D Home Care & Aging with Grace AFH Website

Marketing site for two adult family homes under the same owners:
**A&D Home Care** (Lynnwood, WA) and **Aging with Grace AFH** (Everett, WA).
Both trade as **Kingsgate**, which is why the site lives on kingsgateafh.org.
Built with **Vite + React + TypeScript + Tailwind CSS 4**. Moving from Vercel to
Cloudflare Pages, see [docs/cloudflare-migration.md](docs/cloudflare-migration.md).

## Pages (client-side routes)

| Route | Status |
|---|---|
| `/` | Landing: hero, trust strip, both-homes cards, caregiver credentials, why-an-AFH, values, services, FAQ, contact |
| `/lynnwood` | **A&D Home Care, fully built**: photo tour (10 photos + lightbox), quick facts, full service lists, visit info, tour CTA |
| `/everett` | **Aging with Grace AFH, fully built**: photo tour (8 photos + lightbox), quick facts, full service lists, visit info, tour CTA |

Routing is a React Router SPA. Cloudflare serves `lynnwood.html` at `/lynnwood` through its
own clean-URL handling, so no redirect rules are needed and none are emitted; a `_redirects`
file 307-looped every route and was removed. `vercel.json` keeps its rewrites for Vercel.

## Search / SEO

The app renders on the client, so a crawler that does not execute JS would otherwise see one
generic `<head>` on every URL. The `seoHtml` plugin in `vite.config.ts` fixes that: on every
build it writes one HTML file per route with that route's `<title>`, description, canonical,
Open Graph/Twitter tags and JSON-LD already in `<head>`, and emits `sitemap.xml` + `robots.txt`.

`src/data/seo.ts` is the single source of truth, imported by both the build plugin and the
runtime `<Seo>` component, so the static and hydrated tags cannot drift. To add a route, add an
entry to `routeSeo`. Cloudflare picks the new HTML file up automatically; add a rewrite to
`vercel.json` too if Vercel is still in play.

Both homes now carry verified `geo` coordinates and full street addresses, supplied by the
owners on 2026-07-27. Still deliberately absent, because none of it is confirmed:
`aggregateRating`/reviews, `priceRange`, and `sameAs` until the Google profiles exist. An
invented rating is worse than an omitted one, and `compact()` in `seo.ts` drops empty keys
so unconfirmed facts are never published blank.

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
    layout/             TopBar, Navbar, AvailabilityBanner, Footer, MusicToggle,
                        MobileCallBar
    ui/                 Button, Container, Section, Kicker, SectionHead,
                        Card, IconBadge, ContactCard, Reveal
    sections/           Gallery (+ lightbox), Caregivers, Faq, ServiceColumns, CtaBand
  pages/                Home, Lynnwood, Everett
public/
  favicon.svg           house+heart logo mark
  assets/img/           WebP, long edge ≤1200 px, EXIF stripped, ~60–330 KB each
  assets/og/            1200x630 social previews, JPEG because some scrapers reject WebP
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
- **Aging with Grace AFH (Everett):** 2825 132nd St SE, Everett, WA 98208
  (published 2026-07-27 at the owners' request; it was withheld before that)
- **Email:** gabi_badet@yahoo.com
- **DSHS licences:** A&D Home Care `750676`, Aging with Grace AFH `753460`. Shown in the
  footer and as `identifier` on each LocalBusiness. No competing local site publishes theirs.
- **Care team:** the owner has 21 years of experience and is a Registered Nursing Assistant
  (NAR); the caregiving staff are NARs, CNAs and home care aides, with a registered nurse
  available as needed. Do not write "RN on staff": the nurse is not employed by the homes.

## Content notes

- The screenshots in `images/` are from a *reference* AFH site (iCare) and were used only as a
  template for which sections/services to include. All brand-specific text from that site has
  been removed.
- Service lists are the standard WA adult-family-home service menu from those references.
  Trim anything these two homes don't actually offer.
- **Strip EXIF from every photo before publishing it.** Phone photos carry GPS coordinates, and
  a photo can leak a location through GPS regardless of what the page says, so strip it anyway.
  Re-saving through Pillow without passing `exif=` drops all metadata (see the `everett-*.webp`
  set, all of which are clean). `scripts/process-photos.py` does this; run it when new
  photos arrive rather than converting anything by hand.

## TODO

- [x] **Everett photos**: `/everett` now has a real hero + 8-photo `<Gallery>`, and the home
      "Our Homes" card shows a real photo. Assets in `public/assets/img/everett-*.webp`,
      data in `everettGallery` (`src/data/site.ts`). Replaced with the owner's own higher-res
      set on 2026-07-26, which added a private room, two bathroom/roll-in-shower shots, and
      the front garden.
- [x] **Lynnwood photos**: replaced with the owner's own set on 2026-07-26 and grown to a
      10-photo tour. `back-deck.jpg` had been mislabelled: it is the Lynnwood deck, and was
      briefly moved to Everett before the owner corrected it.
- [ ] **Google Business Profile for each home** (highest-impact item left, and not a code
      change). Full setup sheet, with the exact strings to paste, the category decision and the
      photo lists, is in [docs/google-business-profile.md](docs/google-business-profile.md).
      Coordinates and addresses are already in, so once a profile is verified the only code
      change left is filling in `googleBusinessProfile` in `data/contact.ts`, which publishes
      it as `sameAs`. It is omitted from the structured data while empty.
- [ ] **Submit the sitemap** to Google Search Console and Bing Webmaster Tools
      (`https://kingsgateafh.org/sitemap.xml`), then request indexing for all three URLs.
- [ ] **Free AFH directory listings** with a link back: WA DSHS adult family home locator,
      Caring.com, APlaceForMom, SeniorAdvisor, Yelp. Local citations are a big local-SEO
      signal and cost nothing.
- [x] **Dementia / mental health care** confirmed by the owners on 2026-07-26 and now named in
      the titles, descriptions, chips, both service lists, the JSON-LD service catalogue, and
      the why-an-AFH copy. These are the highest-volume searches in this vertical.
- [x] **No resident photos.** Removed at the owners' request on 2026-07-26
      (`celebration-meal.jpg`, `everett-celebration.jpg`). Nothing on the site shows an
      identifiable resident. If one is ever added, get written consent from the person shown.
- [ ] **Everett address & phone**: published when the owners want them public. Publishing the
      street address would also let `geo` and a Google Business Profile be added for Everett.
- [ ] **Testimonials**: the owners said later. Two or three, first name and city, would
      close the largest remaining trust gap; both competing local sites have one.
- [ ] **Owner name on the site**: the caregiver section says "our owner" rather than
      naming her, because the name was never confirmed for publication. Confirm and add.
- [ ] **Contact form**: all three competing sites have one; this site only has tel: and
      mailto: links. Needs a form service or a Cloudflare Pages Function.
- [ ] **Verify service lists**: confirm both homes offer everything listed (esp. specialized
      services like tube feeding, Foley catheter, hospice).
- [ ] **Custom domain + canonical/OG tags**: once a domain is pointed at the Vercel project.
- [ ] **License numbers**: WA AFH license numbers are often shown in the footer; add if wanted.

## Deploy

Vercel auto-detects the Vite project and runs `npm run build` → `dist/`. `vercel.json` adds the
SPA rewrite (all routes → `index.html`). `images/` (originals + reference screenshots),
`README.md`, and `.claude/` are excluded via `.vercelignore`.
