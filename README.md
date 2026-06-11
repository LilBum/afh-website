# A&D Homecare & Aging with Grace AFH — Website

Static marketing site for two adult family homes under the same owners:
**A&D Homecare** (Lynnwood, WA) and **Aging with Grace AFH** (Everett, WA).
No build step — plain HTML/CSS/JS. Deployable to any static host (Netlify, Vercel, GitHub Pages, shared hosting).

## Pages

| Page | Status |
|---|---|
| `index.html` | Landing — hero, why-an-AFH, values, services overview, both-homes cards, contact |
| `lynnwood.html` | **A&D Homecare — fully built** — photo tour (6 photos + lightbox), quick facts, full service lists, tour CTA |
| `everett.html` | Aging with Grace AFH — stub: services + "photos coming soon" placeholder hero |

## Structure

- `css/styles.css` — single shared stylesheet (design tokens at top in `:root`)
- `js/main.js` — mobile nav, gallery lightbox, scroll-reveal, footer year
- `assets/img/` — web-optimized JPGs (resized, ~170–480 KB each)
- `assets/favicon.svg` — house+heart logo mark (also used as nav/footer logo)
- `images/` — original photos & reference screenshots (NOT used by the site; safe to keep or move out before deploy)

## Run locally

```
python -m http.server 8742
```

then open http://localhost:8742 (or use the configured `afh-site` launch config).

## Content notes

- The screenshots in `images/` are from a *reference* AFH site (iCare) and were used only as a
  template for which sections/services to include. All brand-specific text, the old tagline,
  award, phone, and address from that site have been removed.
- Service lists are the standard WA adult-family-home service menu from those references —
  trim anything these two homes don't actually offer.

## Contact info on the site

- Phone: **(425) 773-0844** (owner's number — placeholder until per-home lines exist;
  find-and-replace `+14257730844` and `(425) 773-0844` to swap)
- Email: **gabi_badet@yahoo.com**
- Street addresses: intentionally private — "exact addresses are shared when you arrange a visit"

## TODO

- [ ] **Everett photos** — replace the placeholder hero card on `everett.html` and the
      placeholder tile on the index "Our Homes" card with real photos (drop them in
      `assets/img/` and mirror the `lynnwood.html` markup).
- [ ] **Confirm photo assignment** — all 6 photos are presented as the Lynnwood home (A&D);
      if any are actually Everett, move them to the Everett page.
- [ ] **Verify service lists** — confirm both homes offer everything listed (esp. specialized
      services like tube feeding, Foley catheter, hospice).
- [ ] **Custom domain + canonical/OG tags** — once a domain is pointed at the Vercel project.
- [ ] **License numbers** — WA AFH license numbers are often shown in the footer; add if wanted.
- [ ] **Per-home phone numbers** — swap in when available.

## Deploy

Hosted on Vercel as a static site (no build). `images/` (originals + reference screenshots),
`README.md`, and `.claude/` are excluded from deployment via `.vercelignore`.
