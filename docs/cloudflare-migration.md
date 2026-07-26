# Moving from Vercel to Cloudflare Pages

## Why

Vercel's [fair use guidelines](https://vercel.com/docs/limits/fair-use-guidelines) say:

> **Hobby teams** are restricted to non-commercial personal use only. All commercial usage of
> the platform requires either a Pro or Enterprise plan.

Their definition of commercial usage explicitly includes *"advertising the sale of a product or
service."* This site markets paid senior care, so on the free Hobby plan it is a terms
violation, and the penalty is suspension. That would take the site down exactly when families
are clicking through from Google.

The options are Vercel Pro at $20/month, or Cloudflare Pages, whose free tier permits
commercial use. This site is 100% static output, so Cloudflare is a straight swap.

## The build is already portable

`npm run build` emits `dist/_redirects`, which is Cloudflare's equivalent of the rewrites in
`vercel.json`:

```
/lynnwood /lynnwood.html 200
/everett /everett.html 200
/* /index.html 200
```

Status `200` makes each a rewrite rather than a redirect, so the visitor's URL does not change.
It is generated from `routeSeo` in `src/data/seo.ts`, the same source as the static HTML files
and the sitemap, so the three cannot drift apart. Vercel ignores the file, so nothing breaks
while both hosts are live.

## Steps

1. **Buy the domain** first, so you only submit one URL to Google. See the note below.
2. At <https://dash.cloudflare.com> → **Workers & Pages** → **Create** → **Pages** →
   **Connect to Git**, authorise GitHub and pick `LilBum/afh-website`.
3. Build settings:
   - Framework preset: **None** (do not pick Vite; the preset overrides the output directory)
   - Build command: `npm run build`
   - Output directory: `dist`
   - Node version: add an environment variable `NODE_VERSION` = `24`
4. Deploy, then check the temporary `*.pages.dev` URL. Verify all three routes load, not just
   `/`, since route rewrites are the one thing that differs between the hosts.
5. Add the custom domain under the project's **Custom domains** tab. If the domain is
   registered at Cloudflare the DNS is filled in automatically; otherwise point the nameservers
   at Cloudflare, or add the CNAME they give you.
6. Update `SITE_URL` in `src/data/seo.ts` to the real domain and push. That one line updates
   every canonical tag, all Open Graph URLs, `sitemap.xml` and `robots.txt`.
7. **Only now** submit to Google: put the final URLs in both Google Business Profiles, add the
   property in Search Console, and submit `https<your-domain>/sitemap.xml`.
8. Once Cloudflare has served the live domain for a few days, delete the Vercel project so
   there is no duplicate copy of the site for Google to index.

## Verifying after the move

The same checks used on Vercel, against the new host:

```bash
for p in / /lynnwood /everett /sitemap.xml /robots.txt; do
  printf "%-16s %s\n" "$p" "$(curl -s -o /dev/null -w '%{http_code}' https://YOUR-DOMAIN$p)"
done
```

All five must return `200`. `/lynnwood` and `/everett` returning `404` means the `_redirects`
file was not picked up, which usually means the output directory is set wrong.

Then confirm each route still serves its own `<title>` without JavaScript:

```bash
for p in / /lynnwood /everett; do curl -s https://YOUR-DOMAIN$p | grep -o '<title>[^<]*'; done
```

Three different titles, not three copies of the same one.

## Notes

- Cloudflare's free tier allows 500 builds/month and one custom domain, both far above what
  this site needs.
- Deploys stay git-driven: pushing to `main` builds and deploys, the same as now.
- `vercel.json` can stay in the repo harmlessly. Keeping it means the site can be redeployed to
  Vercel without rework if you ever want to.
