# Kingsgate AFH, Inc Website

Marketing site for two adult family homes under the legal parent **Kingsgate AFH, Inc**:
**A&D Home Care** (Lynnwood, WA) and **Aging with Grace AFH** (Everett, WA).
Owner Gabriela Badet confirmed the parent relationship and public umbrella brand on 2026-08-02.
Built with **Vite + React + TypeScript + Tailwind CSS 4** and deployed through a Cloudflare
Worker with static assets. See [docs/cloudflare-migration.md](docs/cloudflare-migration.md).

## Pages (pre-rendered routes)

| Route | Status |
|---|---|
| `/` | Landing: hero, trust strip, both-homes cards, caregiver credentials, why-an-AFH, values, services, FAQ, contact |
| `/lynnwood` | **A&D Home Care, fully built**: photo tour (10 photos + lightbox), quick facts, full service lists, visit info, tour CTA |
| `/everett` | **Aging with Grace AFH, fully built**: photo tour (8 photos + lightbox), quick facts, full service lists, visit info, tour CTA |

React Router handles navigation after hydration. The production build emits complete HTML for
all three routes, and Cloudflare serves `lynnwood.html` and `everett.html` at their clean URLs.
A top-level custom `404.html` prevents unknown URLs and missing assets from falling back to the
home page. `vercel.json` keeps only the two explicit clean-route rewrites for Vercel.

Room availability is intentionally not hardcoded into the pre-rendered pages. The browser reads
`/api/availability`, which the Cloudflare Worker validates and proxies from a dedicated Google
Form/Apps Script workflow. Missing, invalid, expired, or unreachable data becomes **Call for
current availability**. See [docs/availability-updates.md](docs/availability-updates.md).

## Search / SEO

The `prerenderSeo` build plugin in `vite.config.ts` renders each route's full body and its unique
`<title>`, description, canonical, Open Graph/Twitter tags and JSON-LD. It also emits the custom
noindex 404, `sitemap.xml`, `robots.txt`, and immutable-cache rules for fingerprinted assets.
The browser hydrates the existing body instead of replacing an empty app shell.

`src/data/seo.ts` is the single source of truth for route metadata. The build writes one marked
head set; the runtime `<Seo>` component replaces that same set after client navigation, so tags
do not duplicate or conflict. To add a route, add an entry to `routeSeo` and, if Vercel remains
in use, add its explicit clean-route rewrite to `vercel.json`.

Both homes now carry verified `geo` coordinates and full street addresses, supplied by the
owners on 2026-07-27. Public Google Business Profile URLs are also connected through `sameAs`.
`aggregateRating`/reviews and `priceRange` remain deliberately absent because they have not been
confirmed. An invented rating is worse than an omitted one, and `compact()` in `seo.ts` drops
empty keys so unconfirmed facts are never published blank.

**The website is only half of local search.** Ranking in the Google "map pack" for
*adult family home near me* comes mostly from a **Google Business Profile** for each home,
and both public profile URLs are now linked from the site. Owner access, categories, hours,
reviews and photos still need ongoing maintenance. See the checklist below.

## Stack & structure

- **Vite 8** + **React 19** + **TypeScript** + **Tailwind CSS 4** (`@tailwindcss/vite`)
- **framer-motion**: scroll-reveal animations (respects `prefers-reduced-motion`)
- **lucide-react**: icon set (replaced the old hand-written inline SVGs)
- Self-hosted fonts via `@fontsource-variable/fraunces` + `@fontsource-variable/nunito`

```
src/
  main.tsx              browser entry: fonts, MotionConfig, hydrates <App>
  entry-server.tsx      build entry: statically renders the shared route tree
  App.tsx               React Router routes + shared layout + scroll manager
  index.css             Tailwind import + design tokens (@theme) + base styles
  data/contact.ts       phone, email, addresses, areas served (no React imports, so
                        vite.config.ts can import it at build time)
  data/availability.ts  validates live status and enforces automatic expiration
  data/seo.ts           per-route title/description/canonical/OG + JSON-LD, and SITE_URL
  data/site.ts          all content: nav, services, values, chips, galleries
  lib/
    cn.ts               className joiner
    ambientMusic.ts     Web-Audio generative ambient pad engine
  components/
    Seo.tsx             updates the single marked head set after client navigation
    layout/             TopBar, Navbar, AvailabilityBanner, Footer, MusicToggle,
                        MobileCallBar
    ui/                 Button, Container, Section, ResponsiveImage, Kicker, SectionHead,
                        Card, IconBadge, ContactCard, Reveal
    sections/           Gallery (+ lightbox), Caregivers, OfficialVerification, Faq,
                        ServiceColumns, CtaBand
  pages/                Home, Lynnwood, Everett
public/
  favicon.svg           house+heart logo mark
  assets/img/           original WebP photos, EXIF stripped
  assets/img/responsive generated 480/768/960px AVIF + WebP derivatives used by picture/srcset
  assets/og/            1200x630 social previews, JPEG because some scrapers reject WebP
scripts/
  generate-responsive-images.py       rebuilds responsive photo derivatives
  create-seo-owner-google-form.gs      creates the owner questionnaire + response sheet
  create-availability-google-form.gs   creates the private recurring availability form + JSON feed
worker/
  index.ts              same-origin availability API + Cloudflare static asset handling
images/                 original photos & reference screenshots (NOT deployed)
```

The design tokens (cream / teal / coral palette, fonts, radii, shadows) live in the
`@theme` block of `src/index.css` and are used as Tailwind utilities (`bg-teal`,
`text-ink-soft`, `rounded-card`, `shadow-card`, …).

Background music: `src/lib/ambientMusic.ts` synthesizes a calming pad with the Web Audio API
(nothing copyrighted, no audio file). It is dynamically loaded only after the visitor explicitly
uses `components/layout/MusicToggle.tsx`.

## Commands

```
npm install
npm run dev       # Vite dev server (http://localhost:5173)
npm run build     # tsc + vite build → dist/
npm run preview   # preview the production build
npm run lint      # eslint
```

## Contact info on the site

- **A&D Home Care (Lynnwood):** 3111 201st Pl SW, Lynnwood, WA 98036;
  primary phone `(425) 673-0745`; public contact hours daily, 9:30 AM–7:00 PM.
- **Aging with Grace AFH (Everett):** 2825 132nd St SE, Everett, WA 98208;
  primary phone `(425) 357-8630`; fax `(425) 225-5721`; public contact hours daily,
  10:00 AM–7:00 PM.
- **Shared owner contact:** `(425) 773-0844`, approved as an additional number for both homes.
- **Email:** gabi_badet@yahoo.com
- **DSHS licences:** A&D Home Care `750676`, Aging with Grace AFH `753460`. Shown in the
  footer and as `identifier` on each LocalBusiness. No competing local site publishes theirs.
- **Care team:** Gabriela Badet founded both homes and has 21 years of senior-care and
  adult-family-home ownership experience. She is a Nursing Assistant Registered (NAR). The
  current team includes NARs, CNAs and home care aides. A registered nurse serves both homes as
  a delegating nurse and consultant. Do not write "RN on staff" or "RN on call."

## Content notes

- The screenshots in `images/` are from a *reference* AFH site (iCare) and were used only as a
  template for which sections/services to include. All brand-specific text from that site has
  been removed.
- The owner confirmed the current service selections on 2026-08-02. Transportation and clinical
  music therapy are excluded. Clinical support is always qualified by resident assessment, care
  plan, caregiver scope, required nurse delegation, and outside-provider coordination.
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
- [x] **Google Business Profile links**: both public profile URLs are in `data/contact.ts` and
      publish as `sameAs`. The setup and maintenance sheet is in
      [docs/google-business-profile.md](docs/google-business-profile.md). Both profiles are
      claimed and verified; manager access, exact selectable categories, and ongoing review/photo
      activity remain.
- [ ] **Connect live availability**: run `scripts/create-availability-google-form.gs` in the
      Google account that should own the form, deploy its read-only web app, and set the resulting
      `/exec` URL as Cloudflare's `AVAILABILITY_SOURCE_URL`. The site already degrades safely until
      this one-time connection is complete.
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
- [x] **Everett address & phone**: published with verified coordinates and its Google Business
      Profile URL.
- [ ] **Testimonials**: the owners said later. Two or three, first name and city, would
      close the largest remaining trust gap; both competing local sites have one.
- [x] **Owner identity on the site**: Gabriela Badet is named as founder of both homes. The
      verified 21 years refers to senior care and AFH ownership; A&D began under her ownership in
      2007 and Aging with Grace in 2017. Do not describe either home as 21 years old.
- [ ] **Contact form**: all three competing sites have one; this site only has tel: and
      mailto: links. Needs a form service or a Cloudflare Pages Function.
- [x] **Care-scope claims narrowed**: owner-confirmed support is presented with assessment,
      care-plan, scope-of-practice, delegation, and outside-provider qualifications. Granular
      high-acuity services remain generalized in JSON-LD and should not be copied to Google
      Business Profiles until current Disclosure of Services forms and RN-reviewed scope are on
      file.
- [x] **Custom domain + canonical/OG tags**: live at `https://kingsgateafh.org` with unique
      pre-rendered metadata on all three routes.
- [x] **License numbers**: both are shown in the footer, LocalBusiness identifiers and official
      DSHS services/report links.

## Deploy

Cloudflare runs `npm run build`; `wrangler.jsonc` deploys `worker/index.ts` with `dist/` as its
static asset binding. The output includes complete route HTML, `404.html`, `_headers`,
`robots.txt`, and `sitemap.xml`. Set `AVAILABILITY_SOURCE_URL` to the deployed Apps Script `/exec`
URL. After deployment, verify `/`, `/lynnwood`, `/everett`, and `/api/availability` return 200,
while an unknown path and missing asset return 404. `vercel.json` remains only as a portable
fallback for the two named clean routes; Vercel does not provide the live availability proxy.
