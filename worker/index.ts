type AvailabilityStatus = 'available' | 'waitlist' | 'full' | 'call'

type HomeKey = 'lynnwood' | 'everett'

interface AvailabilityHome {
  status: AvailabilityStatus
  headline: string
  detail: string
  confirmedAt: string | null
  expiresAt: string | null
}

interface AvailabilityPayload {
  schemaVersion: 1
  generatedAt: string
  updatedAt: string | null
  homes: Record<HomeKey, AvailabilityHome>
}

interface Env {
  ASSETS: {
    fetch(request: Request): Promise<Response>
  }
  AVAILABILITY_SOURCE_URL?: string
}

interface WorkerContext {
  waitUntil(promise: Promise<unknown>): void
}

const HOME_KEYS = ['lynnwood', 'everett'] as const
const STATUS_VALUES = new Set<AvailabilityStatus>(['available', 'waitlist', 'full', 'call'])
const DAY_MS = 24 * 60 * 60 * 1_000
const MAX_FUTURE_SKEW_MS = 5 * 60 * 1_000
const FETCH_TIMEOUT_MS = 5_000
const MAX_UPSTREAM_BYTES = 32 * 1_024
const MAX_EDGE_CACHE_SECONDS = 300
const FALLBACK_CACHE_SECONDS = 60
const SAFE_HEADLINE = 'Call for current availability'
const SAFE_DETAIL = 'Please call the home to confirm current availability.'

const ROOT_KEYS = ['schemaVersion', 'generatedAt', 'updatedAt', 'homes']
const HOME_FIELDS = ['status', 'headline', 'detail', 'confirmedAt', 'expiresAt']

const worker = {
  async fetch(request: Request, env: Env, context: WorkerContext): Promise<Response> {
    const url = new URL(request.url)

    if (url.pathname !== '/api/availability') {
      if (url.pathname.startsWith('/api/')) {
        return jsonError('Not found', 404)
      }

      return env.ASSETS.fetch(request)
    }

    if (request.method !== 'GET') {
      return jsonError('Method not allowed', 405, { Allow: 'GET' })
    }

    const cache = getDefaultCache()
    const cacheKey = new Request(`${url.origin}/api/availability`, { method: 'GET' })
    const cached = await cache?.match(cacheKey)

    if (cached) {
      return cached
    }

    try {
      const sourceUrl = validateSourceUrl(env.AVAILABILITY_SOURCE_URL)
      const sourcePayload = await fetchSourcePayload(sourceUrl)
      const now = Date.now()
      const payload = normalizePayload(sourcePayload, now)
      const cacheSeconds = getSafeCacheSeconds(payload, now)
      const response = jsonResponse(payload, 'upstream', cacheSeconds)

      if (cache && cacheSeconds > 0) {
        context.waitUntil(cache.put(cacheKey, response.clone()).catch(() => undefined))
      }

      return response
    } catch (error) {
      console.warn('Availability source unavailable; serving the safe call fallback.', errorName(error))

      const payload = createFallbackPayload()
      const response = jsonResponse(payload, 'fallback', FALLBACK_CACHE_SECONDS)

      if (cache) {
        context.waitUntil(cache.put(cacheKey, response.clone()).catch(() => undefined))
      }

      return response
    }
  },
}

export default worker

function getDefaultCache(): Cache | undefined {
  return (caches as CacheStorage & { default?: Cache }).default
}

function validateSourceUrl(value: string | undefined): URL {
  if (!value) {
    throw new Error('Missing availability source configuration')
  }

  const url = new URL(value)
  const isAppsScriptExecutionUrl =
    url.protocol === 'https:' &&
    url.hostname === 'script.google.com' &&
    /^\/macros\/s\/[^/]+\/exec$/.test(url.pathname) &&
    !url.username &&
    !url.password &&
    !url.hash

  if (!isAppsScriptExecutionUrl) {
    throw new Error('Invalid availability source configuration')
  }

  return url
}

async function fetchSourcePayload(url: URL): Promise<unknown> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      redirect: 'follow',
      cache: 'no-store',
      signal: controller.signal,
    })

    if (!response.ok) {
      throw new Error('Availability source returned a non-success response')
    }

    const contentType = response.headers.get('content-type')?.toLowerCase() ?? ''
    if (!contentType.startsWith('application/json')) {
      throw new Error('Availability source returned an unexpected content type')
    }

    const body = await readBoundedText(response)
    return JSON.parse(body) as unknown
  } finally {
    clearTimeout(timeout)
  }
}

async function readBoundedText(response: Response): Promise<string> {
  const declaredLength = Number(response.headers.get('content-length'))
  if (Number.isFinite(declaredLength) && declaredLength > MAX_UPSTREAM_BYTES) {
    throw new Error('Availability source response is too large')
  }

  if (!response.body) {
    throw new Error('Availability source returned an empty response')
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let bytesRead = 0
  let body = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    bytesRead += value.byteLength
    if (bytesRead > MAX_UPSTREAM_BYTES) {
      await reader.cancel()
      throw new Error('Availability source response is too large')
    }

    body += decoder.decode(value, { stream: true })
  }

  body += decoder.decode()
  return body
}

function normalizePayload(value: unknown, now: number): AvailabilityPayload {
  if (!isRecord(value) || !hasExactKeys(value, ROOT_KEYS)) {
    throw new Error('Invalid availability payload')
  }

  if (value.schemaVersion !== 1) {
    throw new Error('Unsupported availability schema')
  }

  const generatedAt = value.generatedAt
  const generatedAtMs = parseIsoDate(generatedAt)
  if (generatedAtMs === undefined || generatedAtMs > now + MAX_FUTURE_SKEW_MS) {
    throw new Error('Invalid availability generation date')
  }

  const updatedAt = parseNullableIsoDate(value.updatedAt, now)

  if (!isRecord(value.homes) || !hasExactKeys(value.homes, HOME_KEYS)) {
    throw new Error('Availability payload must contain exactly two homes')
  }

  const homes = {} as Record<HomeKey, AvailabilityHome>
  for (const homeKey of HOME_KEYS) {
    homes[homeKey] = normalizeHome(value.homes[homeKey], now)
  }

  return {
    schemaVersion: 1,
    generatedAt: generatedAt as string,
    updatedAt,
    homes,
  }
}

function normalizeHome(value: unknown, now: number): AvailabilityHome {
  if (!isRecord(value) || !hasExactKeys(value, HOME_FIELDS)) {
    throw new Error('Invalid home availability record')
  }

  if (typeof value.status !== 'string' || !STATUS_VALUES.has(value.status as AvailabilityStatus)) {
    throw new Error('Invalid availability status')
  }

  if (!isSafeText(value.headline, 90) || !isSafeText(value.detail, 280)) {
    throw new Error('Invalid availability text')
  }

  const status = value.status as AvailabilityStatus
  const confirmedAt = parseNullableIsoDate(value.confirmedAt, now)
  const expiresAt = parseNullableIsoDate(value.expiresAt, now, true)

  if (status !== 'call' && confirmedAt === null) {
    throw new Error('A publishable status must have a confirmation date')
  }

  if (expiresAt !== null && confirmedAt === null) {
    throw new Error('An expiration date requires a confirmation date')
  }

  const confirmedAtMs = confirmedAt === null ? undefined : parseIsoDate(confirmedAt)
  const sourceExpiresAtMs = expiresAt === null ? undefined : parseIsoDate(expiresAt)

  if (
    confirmedAtMs !== undefined &&
    sourceExpiresAtMs !== undefined &&
    sourceExpiresAtMs <= confirmedAtMs
  ) {
    throw new Error('Expiration must be later than confirmation')
  }

  if (status === 'call' && confirmedAt === null) {
    return {
      status,
      headline: value.headline,
      detail: value.detail,
      confirmedAt: null,
      expiresAt: null,
    }
  }

  const maxAgeDays = status === 'available' ? 7 : 30
  const policyExpiresAtMs = (confirmedAtMs as number) + maxAgeDays * DAY_MS
  const effectiveExpiresAtMs =
    sourceExpiresAtMs === undefined
      ? policyExpiresAtMs
      : Math.min(sourceExpiresAtMs, policyExpiresAtMs)

  if (now >= effectiveExpiresAtMs) {
    return {
      status: 'call',
      headline: SAFE_HEADLINE,
      detail: SAFE_DETAIL,
      confirmedAt: null,
      expiresAt: null,
    }
  }

  return {
    status,
    headline: value.headline,
    detail: value.detail,
    confirmedAt,
    expiresAt: new Date(effectiveExpiresAtMs).toISOString(),
  }
}

function parseNullableIsoDate(
  value: unknown,
  now: number,
  allowFuture = false,
): string | null {
  if (value === null) return null

  const parsed = parseIsoDate(value)
  if (parsed === undefined || (!allowFuture && parsed > now + MAX_FUTURE_SKEW_MS)) {
    throw new Error('Invalid ISO-8601 date')
  }

  return value as string
}

function parseIsoDate(value: unknown): number | undefined {
  if (typeof value !== 'string') return undefined

  const dateOnlyMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (dateOnlyMatch) {
    const [, year, month, day] = dateOnlyMatch
    if (!isCalendarDate(Number(year), Number(month), Number(day))) return undefined
    return Date.UTC(Number(year), Number(month) - 1, Number(day))
  }

  const timestampMatch =
    /^(\d{4})-(\d{2})-(\d{2})T(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d(?:\.\d{1,9})?(?:Z|[+-](?:[01]\d|2[0-3]):[0-5]\d)$/.exec(value)

  if (!timestampMatch) return undefined

  const [, year, month, day] = timestampMatch
  if (!isCalendarDate(Number(year), Number(month), Number(day))) return undefined

  const parsed = Date.parse(value)
  return Number.isFinite(parsed) ? parsed : undefined
}

function isCalendarDate(year: number, month: number, day: number): boolean {
  if (month < 1 || month > 12 || day < 1) return false
  return day <= new Date(Date.UTC(year, month, 0)).getUTCDate()
}

function isSafeText(value: unknown, maxLength: number): value is string {
  return (
    typeof value === 'string' &&
    value.length >= 1 &&
    value.length <= maxLength &&
    value === value.trim() &&
    !hasControlCharacters(value)
  )
}

function hasControlCharacters(value: string): boolean {
  for (let index = 0; index < value.length; index += 1) {
    const codePoint = value.charCodeAt(index)
    if (codePoint <= 31 || codePoint === 127) return true
  }

  return false
}

function getSafeCacheSeconds(payload: AvailabilityPayload, now: number): number {
  let cacheSeconds = MAX_EDGE_CACHE_SECONDS

  for (const homeKey of HOME_KEYS) {
    const home = payload.homes[homeKey]
    if (home.expiresAt === null) continue

    const expiresAtMs = parseIsoDate(home.expiresAt)
    if (expiresAtMs === undefined) return 0

    cacheSeconds = Math.min(cacheSeconds, Math.max(0, Math.floor((expiresAtMs - now) / 1_000)))
  }

  return cacheSeconds
}

function createFallbackPayload(): AvailabilityPayload {
  const generatedAt = new Date().toISOString()
  const fallbackHome = (): AvailabilityHome => ({
    status: 'call',
    headline: SAFE_HEADLINE,
    detail: SAFE_DETAIL,
    confirmedAt: null,
    expiresAt: null,
  })

  return {
    schemaVersion: 1,
    generatedAt,
    updatedAt: null,
    homes: {
      lynnwood: fallbackHome(),
      everett: fallbackHome(),
    },
  }
}

function jsonResponse(
  payload: AvailabilityPayload,
  source: 'upstream' | 'fallback',
  cacheSeconds: number,
): Response {
  const sharedCacheSeconds = Math.max(0, Math.min(cacheSeconds, MAX_EDGE_CACHE_SECONDS))
  const browserCacheSeconds = Math.min(sharedCacheSeconds, 60)
  const cacheControl =
    sharedCacheSeconds > 0
      ? `public, max-age=${browserCacheSeconds}, s-maxage=${sharedCacheSeconds}`
      : 'no-store'

  return new Response(JSON.stringify(payload), {
    status: 200,
    headers: {
      'Cache-Control': cacheControl,
      'Content-Type': 'application/json; charset=utf-8',
      'X-Availability-Source': source,
      'X-Content-Type-Options': 'nosniff',
    },
  })
}

function jsonError(message: string, status: number, extraHeaders: HeadersInit = {}): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: {
      ...extraHeaders,
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json; charset=utf-8',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}

function hasExactKeys(record: Record<string, unknown>, keys: readonly string[]): boolean {
  const actualKeys = Object.keys(record)
  return actualKeys.length === keys.length && keys.every((key) => Object.hasOwn(record, key))
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function errorName(error: unknown): string {
  return error instanceof Error ? error.name : 'UnknownError'
}
