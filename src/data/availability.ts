export const homeKeys = ['lynnwood', 'everett'] as const

export type HomeKey = (typeof homeKeys)[number]
export type AvailabilityStatus = 'available' | 'waitlist' | 'full' | 'call'

export type HomeAvailability = Readonly<{
  status: AvailabilityStatus
  headline: string
  detail: string
  confirmedAt: string | null
  expiresAt: string | null
  source: 'live' | 'fallback'
}>

export type AvailabilitySnapshot = Readonly<{
  homes: Readonly<Record<HomeKey, HomeAvailability>>
  updatedAt: string | null
}>

const DAY_MS = 24 * 60 * 60 * 1000
const CLOCK_SKEW_MS = 5 * 60 * 1000
const MAX_AGE_MS: Partial<Record<AvailabilityStatus, number>> = {
  available: 7 * DAY_MS,
  waitlist: 30 * DAY_MS,
  full: 30 * DAY_MS,
  call: 30 * DAY_MS,
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/
const ISO_TIMESTAMP = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?(?:Z|[+-]\d{2}:\d{2})$/
const safeHomeAvailability: HomeAvailability = {
  status: 'call',
  headline: 'Call for current availability',
  detail: 'Availability can change quickly. Please call the home to confirm current openings.',
  confirmedAt: null,
  expiresAt: null,
  source: 'fallback',
}

export const safeAvailabilitySnapshot: AvailabilitySnapshot = {
  homes: {
    lynnwood: safeHomeAvailability,
    everett: safeHomeAvailability,
  },
  updatedAt: null,
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const hasOwn = (value: Record<string, unknown>, key: string) => Object.prototype.hasOwnProperty.call(value, key)

const hasControlCharacter = (value: string) =>
  Array.from(value).some((character) => {
    const codePoint = character.codePointAt(0) ?? 0
    return codePoint <= 31 || codePoint === 127
  })

const parseText = (value: unknown, maxLength: number): string | null => {
  if (typeof value !== 'string') return null
  const text = value.trim()
  if (!text || text.length > maxLength || hasControlCharacter(text)) return null
  return text
}

const parseIsoDate = (value: unknown): string | null => {
  if (typeof value !== 'string' || (!ISO_DATE.test(value) && !ISO_TIMESTAMP.test(value))) return null

  const datePart = value.slice(0, 10)
  const calendarTime = Date.parse(`${datePart}T00:00:00Z`)
  if (!Number.isFinite(calendarTime) || new Date(calendarTime).toISOString().slice(0, 10) !== datePart) return null

  if (!ISO_DATE.test(value)) {
    const time = value.slice(11).match(/^(\d{2}):(\d{2})(?::(\d{2})(?:\.\d{1,3})?)?(?:Z|([+-])(\d{2}):(\d{2}))$/)
    if (!time) return null
    const [, hour, minute, second = '0', , offsetHour = '0', offsetMinute = '0'] = time
    if (
      Number(hour) > 23 ||
      Number(minute) > 59 ||
      Number(second) > 59 ||
      Number(offsetHour) > 23 ||
      Number(offsetMinute) > 59
    ) {
      return null
    }
  }

  return Number.isFinite(Date.parse(value)) ? value : null
}

const parseNullableIsoDate = (value: unknown): string | null | undefined => {
  if (value === null) return null
  return parseIsoDate(value) ?? undefined
}

const parseStatus = (value: unknown): AvailabilityStatus | null => {
  if (value === 'available' || value === 'waitlist' || value === 'full' || value === 'call') return value
  return null
}

const expirationTime = (
  status: AvailabilityStatus,
  confirmedAt: string | null,
  expiresAt: string | null,
): number | null => {
  const explicitExpiration = expiresAt ? Date.parse(expiresAt) : null
  const maxAge = MAX_AGE_MS[status]
  const maximumExpiration = maxAge && confirmedAt ? Date.parse(confirmedAt) + maxAge : null

  if (explicitExpiration === null) return maximumExpiration
  if (maximumExpiration === null) return explicitExpiration
  return Math.min(explicitExpiration, maximumExpiration)
}

const parseHomeAvailability = (value: unknown, now: number): HomeAvailability => {
  if (!isRecord(value) || !hasOwn(value, 'confirmedAt') || !hasOwn(value, 'expiresAt')) return safeHomeAvailability

  const status = parseStatus(value.status)
  const headline = parseText(value.headline, 90)
  const detail = parseText(value.detail, 280)
  const confirmedAt = parseNullableIsoDate(value.confirmedAt)
  const expiresAt = parseNullableIsoDate(value.expiresAt)

  if (!status || !headline || !detail || confirmedAt === undefined || expiresAt === undefined) {
    return safeHomeAvailability
  }
  if (status !== 'call' && !confirmedAt) return safeHomeAvailability
  if (expiresAt && !confirmedAt) return safeHomeAvailability
  if (confirmedAt && Date.parse(confirmedAt) > now + CLOCK_SKEW_MS) return safeHomeAvailability

  const expiresAtTime = expirationTime(status, confirmedAt, expiresAt)
  if (expiresAtTime !== null && now >= expiresAtTime) return safeHomeAvailability

  return {
    status,
    headline,
    detail,
    // Infrastructure fallbacks have no confirmation timestamp; an owner-submitted call status does.
    confirmedAt,
    expiresAt: expiresAtTime === null ? null : new Date(expiresAtTime).toISOString(),
    source: 'live',
  }
}

/** Converts untrusted API JSON into display-safe availability with per-home degradation. */
export function parseAvailabilityPayload(value: unknown, now = Date.now()): AvailabilitySnapshot {
  if (!isRecord(value) || value.schemaVersion !== 1 || !parseIsoDate(value.generatedAt) || !isRecord(value.homes)) {
    return safeAvailabilitySnapshot
  }

  const updatedAt = parseNullableIsoDate(value.updatedAt)
  if (updatedAt === undefined) return safeAvailabilitySnapshot

  return {
    homes: {
      lynnwood: parseHomeAvailability(value.homes.lynnwood, now),
      everett: parseHomeAvailability(value.homes.everett, now),
    },
    updatedAt,
  }
}

/** Rechecks a parsed snapshot so an opening cannot remain visible past expiry in a long-lived tab. */
export function enforceAvailabilityExpiry(
  snapshot: AvailabilitySnapshot,
  now = Date.now(),
): AvailabilitySnapshot {
  let changed = false
  const homes = Object.fromEntries(
    homeKeys.map((key) => {
      const home = snapshot.homes[key]
      if (home.expiresAt && now >= Date.parse(home.expiresAt)) {
        changed = true
        return [key, safeHomeAvailability]
      }
      return [key, home]
    }),
  ) as Record<HomeKey, HomeAvailability>

  return changed ? { homes, updatedAt: snapshot.updatedAt } : snapshot
}

export function formatAvailabilityDate(value: string): string {
  const isDateOnly = ISO_DATE.test(value)
  const date = new Date(isDateOnly ? `${value}T12:00:00Z` : value)
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: isDateOnly ? 'UTC' : 'America/Los_Angeles',
  }).format(date)
}
