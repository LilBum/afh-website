# A&D Home Care & Aging with Grace AFH — Website

Static marketing site for two adult family homes under the same owners:
**A&D Home Care** (Lynnwood, WA) and **Aging with Grace AFH** (Everett, WA).
No build step — plain HTML/CSS/JS. Hosted on Vercel.

## Pages

| Page | Status |
|---|---|
| `index.html` | Landing — hero, why-an-AFH, values, services overview, both-homes cards, contact |
| `lynnwood.html` | **A&D Home Care — fully built** — photo tour (6 photos + lightbox), quick facts, full service lists, visit info, tour CTA |
| `everett.html` | Aging with Grace AFH — stub: services + "photos coming soon" placeholder hero |

## Structure

- `css/styles.css` — single shared stylesheet (design tokens at top in `:root`)
- `js/main.js` — mobile nav, gallery lightbox, scroll-reveal, footer year
- `js/music.js` — calming background music (generative Web Audio ambient pad) + floating
  toggle button. To use a recorded track instead, set `MUSIC_FILE` at the top of the file
  to e.g. `'assets/audio/ambient.mp3'` and drop the file in.
- `assets/img/` — web-optimized JPGs (resized, ~170–480 KB each)
- `assets/favicon.svg` — house+heart logo mark (also used as nav/footer logo)
- `images/` — original photos & reference screenshots (NOT used by the site; excluded from deploy)

## Run locally

```
python -m http.server 8742
```

then open http://localhost:8742 (or use the configured `afh-site` launch config).

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

- [ ] **Everett photos** — replace the placeholder hero card on `everett.html` and the
      placeholder tile on the index "Our Homes" card with real photos (drop them in
      `assets/img/` and mirror the `lynnwood.html` markup).
- [ ] **Everett address & phone** — published when the owners want them public.
- [ ] **Confirm photo assignment** — all 6 photos are presented as the Lynnwood home;
      if any are actually Everett, move them to the Everett page.
- [ ] **Verify service lists** — confirm both homes offer everything listed (esp. specialized
      services like tube feeding, Foley catheter, hospice).
- [ ] **Custom domain + canonical/OG tags** — once a domain is pointed at the Vercel project.
- [ ] **License numbers** — WA AFH license numbers are often shown in the footer; add if wanted.

## Deploy

Vercel static deploy (no build). `images/` (originals + reference screenshots), `README.md`,
and `.claude/` are excluded from deployment via `.vercelignore`.
