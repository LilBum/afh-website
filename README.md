# A&D Home Care & Aging with Grace AFH — Website

Marketing site for two adult family homes under the same owners:
**A&D Home Care** (Lynnwood, WA) and **Aging with Grace AFH** (Everett, WA).
Built with **Vite + React + TypeScript + Tailwind CSS 4** (same stack as the portfolio).
Hosted on Vercel.

## Pages (client-side routes)

| Route | Status |
|---|---|
| `/` | Landing — hero, why-an-AFH, values, services overview, both-homes cards, contact |
| `/lynnwood` | **A&D Home Care — fully built** — photo tour (6 photos + lightbox), quick facts, full service lists, visit info, tour CTA |
| `/everett` | Aging with Grace AFH — services + "photos coming soon" placeholder hero |

Routing is a React Router SPA; Vercel serves `index.html` for all routes (see `vercel.json`).

## Stack & structure

- **Vite 8** + **React 19** + **TypeScript** + **Tailwind CSS 4** (`@tailwindcss/vite`)
- **framer-motion** — scroll-reveal animations (respects `prefers-reduced-motion`)
- **lucide-react** — icon set (replaced the old hand-written inline SVGs)
- Self-hosted fonts via `@fontsource-variable/fraunces` + `@fontsource-variable/nunito`

```
src/
  main.tsx              entry — fonts, MotionConfig, mounts <App>
  App.tsx               React Router routes + shared layout + scroll manager
  index.css             Tailwind import + design tokens (@theme) + base styles
  data/site.ts          all content: contact info, nav, services, values, gallery
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
  assets/img/           web-optimized JPGs (resized, ~170–480 KB each)
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
  — Phone (425) 673-0745 · Cell (425) 773-0844 · Fax (425) 673-0745
- **Aging with Grace AFH (Everett):** address intentionally private for now
  ("shared when you arrange a visit")
- **Email:** gabi_badet@yahoo.com

## Content notes

- The screenshots in `images/` are from a *reference* AFH site (iCare) and were used only as a
  template for which sections/services to include. All brand-specific text from that site has
  been removed.
- Service lists are the standard WA adult-family-home service menu from those references —
  trim anything these two homes don't actually offer.

## TODO

- [ ] **Everett photos** — replace the placeholder hero on `/everett` and the placeholder tile
      on the home "Our Homes" card with real photos (drop them in `public/assets/img/` and add
      them to `lynnwoodGallery`-style data, or mirror the Lynnwood `<Gallery>` section).
- [ ] **Everett address & phone** — published when the owners want them public.
- [ ] **Confirm photo assignment** — all 6 photos are presented as the Lynnwood home;
      if any are actually Everett, move them to the Everett page.
- [ ] **Verify service lists** — confirm both homes offer everything listed (esp. specialized
      services like tube feeding, Foley catheter, hospice).
- [ ] **Custom domain + canonical/OG tags** — once a domain is pointed at the Vercel project.
- [ ] **License numbers** — WA AFH license numbers are often shown in the footer; add if wanted.

## Deploy

Vercel auto-detects the Vite project and runs `npm run build` → `dist/`. `vercel.json` adds the
SPA rewrite (all routes → `index.html`). `images/` (originals + reference screenshots),
`README.md`, and `.claude/` are excluded via `.vercelignore`.
