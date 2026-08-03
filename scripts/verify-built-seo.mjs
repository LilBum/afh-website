import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const routes = {
  home: readFileSync('dist/index.html', 'utf8'),
  lynnwood: readFileSync('dist/lynnwood.html', 'utf8'),
  everett: readFileSync('dist/everett.html', 'utf8'),
}

function structuredData(html, route) {
  const match = html.match(
    /<script data-seo="route" type="application\/ld\+json">([\s\S]*?)<\/script>/,
  )
  assert.ok(match, `${route}: missing route JSON-LD`)
  return JSON.parse(match[1])
}

function entity(graph, type, route) {
  const match = graph.find((item) => item['@type'] === type)
  assert.ok(match, `${route}: missing ${type} entity`)
  return match
}

for (const [route, html] of Object.entries(routes)) {
  assert.equal((html.match(/data-seo="route" type="application\/ld\+json"/g) ?? []).length, 1)
  assert.match(html, /property="og:site_name" content="Kingsgate AFH, Inc"/)
  assert.doesNotMatch(
    html,
    /RN on call|doctor on call|clinical music therapy|transportation services|Registered Nursing Assistant|Community First Choice|Medicaid Personal Care|\bCFC\b|\bMPC\b/i,
    `${route}: contains a removed or unsupported claim`,
  )
}

const homeGraph = structuredData(routes.home, 'home')['@graph']
const organization = entity(homeGraph, 'Organization', 'home')
assert.equal(organization.name, 'Kingsgate AFH, Inc')
assert.equal(organization.legalName, 'Kingsgate AFH, Inc')
assert.equal(organization.telephone, '+14257730844')
assert.ok(!('founder' in organization), 'parent organization must not claim an unverified founder')

const expected = {
  lynnwood: {
    name: 'A&D Home Care',
    phone: '+14256730745',
    opens: '09:30',
    closes: '19:00',
  },
  everett: {
    name: 'Aging with Grace AFH',
    phone: '+14253578630',
    fax: '+14252255721',
    opens: '10:00',
    closes: '19:00',
  },
}

for (const route of ['lynnwood', 'everett']) {
  const graph = structuredData(routes[route], route)['@graph']
  const home = entity(graph, 'LocalBusiness', route)
  const person = entity(graph, 'Person', route)
  const facts = expected[route]

  assert.equal(home.name, facts.name)
  assert.equal(home.telephone, facts.phone)
  assert.equal(home.faxNumber, facts.fax)
  assert.equal(home.founder['@id'], person['@id'])
  assert.equal(home.openingHoursSpecification.opens, facts.opens)
  assert.equal(home.openingHoursSpecification.closes, facts.closes)
  assert.deepEqual(home.openingHoursSpecification.dayOfWeek, [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ])
  assert.ok(!('paymentAccepted' in home))
  assert.ok(!('currenciesAccepted' in home))
  assert.ok(!('foundingDate' in home))
}

assert.match(routes.lynnwood, /\(425\) 673-0745/)
assert.match(routes.lynnwood, /Call for current availability/)
assert.match(routes.lynnwood, /Daily, 9:30 AM–7:00 PM/)
assert.match(routes.everett, /\(425\) 357-8630/)
assert.match(routes.everett, /Call for current availability/)
assert.match(routes.everett, /Daily, 10:00 AM–7:00 PM/)
for (const [route, html] of Object.entries(routes)) {
  assert.doesNotMatch(
    html,
    /One private bedroom with a full bathroom|confirmed August 2, 2026/i,
    `${route}: contains stale hardcoded availability`,
  )
}

console.log('Built SEO verification passed for /, /lynnwood, and /everett.')
