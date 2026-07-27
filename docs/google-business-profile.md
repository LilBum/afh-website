# Google Business Profile setup

Ranking in the Google "map pack" for searches like *adult family home near me* or
*dementia care Lynnwood* comes mostly from a verified **Google Business Profile**, not from the
website. The site is now set up to support the profiles; these are the values to use.

Create the profiles at <https://business.google.com>. **One profile per home**, because they are two
separate locations with different names, so they need two profiles.

> **Copy the name, address and phone exactly as written below.** Google cross-checks these
> against the website and other listings; a mismatch as small as "St" vs "Street" or a different
> phone format weakens the match. These strings are the same ones in `src/data/contact.ts`.

---

## Category

Type `adult family home` into the category box first and take the closest match Google offers.
Its category list changes and is region-specific, so pick in this order:

1. **Adult family home**: use it if offered. Exact match, no ambiguity.
2. **Adult foster care service**: the usual closest match, and it maps to the same WA license class.
3. **Assisted living facility**: the highest-search-volume option, and what most competing
   AFHs use. But note that in Washington "Assisted Living Facility" is a *different* DSHS
   license class from an Adult Family Home. It is a marketing category, not a legal claim, and
   plenty of AFHs use it, so just be aware of the distinction before choosing it.

Then add these as **additional** categories if available: `Group home`, `Elder care`,
`Home health care service`.

**Use the same primary category for both homes.** Primary category is the single biggest
ranking lever in the map pack, and consistency helps both profiles.

There is usually no separate "dementia care" category. Cover it in the description and the
Services section instead.

---

## A&D Home Care (Lynnwood)

| Field | Value |
|---|---|
| Business name | `A&D Home Care` |
| Street address | `3111 201st Pl SW` |
| City / State / ZIP | `Lynnwood`, `WA`, `98036` |
| Phone | `(425) 773-0844` |
| Website | `https://kingsgateafh.org/lynnwood` |
| Hours | Open 24 hours, all 7 days |

## Aging with Grace AFH (Everett)

| Field | Value |
|---|---|
| Business name | `Aging with Grace AFH` |
| Street address | *not yet public, see note below* |
| City / State | `Everett`, `WA` |
| Phone | `(425) 773-0844` |
| Website | `https://kingsgateafh.org/everett` |
| Hours | Open 24 hours, all 7 days |

**The Everett address is deliberately not on the website.** A Google Business Profile requires a
real address, though you can set it to "I deliver goods and services to my customers" and hide
the street address publicly while still serving the local area. If you would rather publish it,
say so and it goes on the site too, along with a map pin.

Both homes share one phone number, which is fine. Google may flag two profiles with the same
number as possible duplicates. If that happens, the fix is that they have distinct names and
distinct addresses, which they do.

---

## Description

Under 750 characters, and the first sentence matters most. Lynnwood:

> A&D Home Care is a licensed adult family home in Lynnwood, WA, providing 24-hour care for
> seniors in a real house rather than a facility. We are licensed for dementia and Alzheimer's
> care and mental health care, with private rooms, a registered nurse available as needed, a
> home doctor on call, caregivers who are NARs, CNAs and home care aides, medication
> management, diabetes, stroke, wound and hospice care. Residents share home-cooked meals at a
> family table, and the home has a wheelchair-accessible entry, a step-free shower, a vaulted
> living room and a sunny back deck. We serve Lynnwood, Edmonds, Mountlake Terrace, Brier and
> the rest of Snohomish County. Tours are free and by appointment. Call (425) 773-0844.

Everett: same text with these swaps: name to `Aging with Grace AFH`, city to Everett, the
amenity clause to `roll-in showers, landscaped gardens and a sunny back deck`, and the area
served to `Everett, Mukilteo, Lynnwood and the rest of Snohomish County`.

## Services to add

Paste these individually so each becomes a searchable service. They match `servicesFull` in
`src/data/site.ts`, so keep the two lists in step:

Dementia & Alzheimer's care · Memory care & supervision · Mental health care ·
Medication management · Diabetes care · Incontinence care · Wound care · Oxygen therapy ·
Tube feeding · Stroke (CVA) care · Foley catheter · Bowel & bladder retraining · Cancer care ·
Congestive heart failure · Hospice care · 24-hour care · RN available as needed ·
Home doctor on call ·
Private rooms · Home-cooked meals · Mobility & transfer assistance · Laundry & housekeeping

## Attributes to tick

Wheelchair-accessible entrance · Wheelchair-accessible restroom · Identifies as
women-owned (if applicable) · Appointment required · On-site services

## Photos to upload

Use the same files the site uses, so the profile and the site match. From
`public/assets/img/`:

- **Lynnwood**: `lynnwood-exterior.jpg` (set as the cover), `living-room.jpg`, `kitchen.jpg`,
  `dining-room.jpg`, `lynnwood-bedroom.jpg`, `lynnwood-bathroom.jpg`, `lynnwood-shower.jpg`,
  `back-deck.jpg`, `lynnwood-fountain.jpg`, `celebration-table.jpg`
- **Everett**: `everett-exterior.jpg` (cover), `everett-garden.jpg`, `everett-bedroom.jpg`,
  `everett-dining.jpg`, `everett-deck.jpg`, `everett-deck-flowers.jpg`,
  `everett-bathroom.jpg`, `everett-shower.jpg`

No photos of residents are on the site or in these lists, by request. If you ever want to add
one, get written consent from the person shown first.

---

## After each profile is verified

1. Copy the profile's public URL into `googleBusinessProfile` in `src/data/contact.ts`. That
   publishes it as `sameAs` in the structured data, which is how Google ties the site to the
   profile.
2. Read the pin's latitude/longitude off the profile and put them in `geo` in the same file.
   Don't guess these, because a pin in the wrong place sends families to a stranger's door.
3. Redeploy (`npx vercel --prod --yes`). No other code change is needed; both fields are
   omitted from the structured data while empty, so nothing breaks before then.

## Then, in rough order of payoff

1. **Ask families for reviews.** Review count and recency are among the strongest map-pack
   signals, and this vertical runs on trust. Google supplies a short review link per profile.
2. **Submit the sitemap** (`https://kingsgateafh.org/sitemap.xml`) in Google Search Console
   and Bing Webmaster Tools, then request indexing for all three URLs.
3. **Free directory listings**, each linking back to the matching page: the WA DSHS adult
   family home locator, Caring.com, APlaceForMom, SeniorAdvisor, Yelp. Consistent citations
   are a large local signal and cost nothing.
4. **Post to the profiles** every few weeks. Active profiles outrank dormant ones, and a
   photo or a note about a holiday meal is enough.
