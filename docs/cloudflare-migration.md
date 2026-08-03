# Moving from Vercel to Cloudflare Workers

## Why

Vercel's [fair use guidelines](https://vercel.com/docs/limits/fair-use-guidelines) say:

> **Hobby teams** are restricted to non-commercial personal use only. All commercial usage of
> the platform requires either a Pro or Enterprise plan.

Their definition of commercial usage explicitly includes *"advertising the sale of a product or
service."* This site markets paid senior care, so on the free Hobby plan it is a terms
violation, and the penalty is suspension. That would take the site down exactly when families
are clicking through from Google.

The options are a paid commercial Vercel plan or Cloudflare Workers. The site's page assets are
static; a small Worker adds the read-only availability API while continuing to serve those
assets directly.

## The build is already portable

`npm run build` emits complete `index.html`, `lynnwood.html`, and `everett.html` documents.
Cloudflare static assets serves the latter two at extensionless URLs through its clean-URL
handling. The build also emits a top-level `404.html`; do not add a `/* /index.html 200`
fallback, because that changes missing pages and assets into duplicate 200 home pages.

`wrangler.jsonc` binds `dist/` as `ASSETS`, runs `worker/index.ts` first only for `/api/*`, and
keeps `not_found_handling` set to `404-page`.

`routeSeo` in `src/data/seo.ts` remains the source for route metadata and the sitemap.
`vercel.json` contains only the two explicit clean-route mappings needed by Vercel.

## Steps

1. **Buy the domain** first, so you only submit one URL to Google. See the note below.
2. At <https://dash.cloudflare.com> → **Workers & Pages** → **Create application** →
   **Import a repository**, authorize GitHub and pick `LilBum/afh-website`.
3. Build settings:
   - Build command: `npm run build`
   - Deploy command: `npx wrangler deploy`
   - Node version: add an environment variable `NODE_VERSION` = `24`
   - Worker name: `afh-website`, matching `wrangler.jsonc`
4. Deploy, then check the temporary `*.workers.dev` URL. Verify all three routes load,
   `/api/availability` returns JSON, and an unknown path returns the custom page with HTTP 404.
5. After deploying the Google availability web app, set `AVAILABILITY_SOURCE_URL` to its `/exec`
   URL under the Worker's runtime variables. Until then, the API deliberately returns the safe
   call-for-current-availability fallback. The Wrangler configuration keeps dashboard-managed
   variables across future Git deployments.
6. Add the custom domain under the project's **Custom domains** tab. If the domain is
   registered at Cloudflare the DNS is filled in automatically; otherwise point the nameservers
   at Cloudflare, or add the CNAME they give you.
7. Update `SITE_URL` in `src/data/seo.ts` to the real domain and push. That one line updates
   every canonical tag, all Open Graph URLs, `sitemap.xml` and `robots.txt`.
8. **Only now** submit to Google: put the final URLs in both Google Business Profiles, add the
   property in Search Console, and submit `https<your-domain>/sitemap.xml`.
9. Once Cloudflare has served the live domain for a few days, delete the Vercel project so
   there is no duplicate copy of the site for Google to index.

## Verifying after the move

The same checks used on Vercel, against the new host:

```bash
for p in / /lynnwood /everett /sitemap.xml /robots.txt; do
  printf "%-16s %s\n" "$p" "$(curl -s -o /dev/null -w '%{http_code}' https://YOUR-DOMAIN$p)"
done
```

All five must return `200`. Then verify the not-found behavior separately:

```bash
curl -s -o /dev/null -w '%{http_code}\n' https://YOUR-DOMAIN/definitely-not-a-page
curl -s -o /dev/null -w '%{http_code}\n' https://YOUR-DOMAIN/assets/definitely-not-a-file.js
```

Both must return `404`, not `200`.

Then confirm each route still serves its own `<title>` without JavaScript:

```bash
for p in / /lynnwood /everett; do curl -s https://YOUR-DOMAIN$p | grep -o '<title>[^<]*'; done
```

Three different titles, not three copies of the same one.

## Notes

- Deploys stay git-driven: pushing to `main` builds and deploys, the same as now.
- `vercel.json` can stay in the repo harmlessly. Keeping it means the site can be redeployed to
  Vercel without rework if you ever want to.
