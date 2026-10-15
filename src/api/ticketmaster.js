// All calls to the Ticketmaster Discovery API live in this file.
// Docs: https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2/

const BASE_URL = 'https://app.ticketmaster.com/discovery/v2'
const API_KEY = import.meta.env.VITE_TM_API_KEY

// Ticketmaster only lets you page through the first 1000 results.
const PAGE_SIZE = 20
const MAX_PAGES = Math.floor(1000 / PAGE_SIZE)

// Ticketmaster wants dates like 2026-10-15T00:00:00Z (no milliseconds).
function toApiDate(date) {
  return date.toISOString().slice(0, 19) + 'Z'
}

async function request(path, params) {
  if (!API_KEY) {
    throw new Error('No API key found. Add VITE_TM_API_KEY to your .env file and restart the dev server.')
  }

  const query = new URLSearchParams({ apikey: API_KEY })
  // Only send the filters that actually have a value.
  for (const [key, value] of Object.entries(params)) {
    if (value !== '' && value !== undefined && value !== null) {
      query.append(key, value)
    }
  }

  const response = await fetch(`${BASE_URL}${path}?${query}`)
  if (response.status === 429) {
    throw new Error('Too many requests. Wait a moment and try again.')
  }
  if (!response.ok) {
    throw new Error(`Ticketmaster returned an error (${response.status}).`)
  }
  return response.json()
}

// Turns one raw Ticketmaster event into the small object our components use.
export function simplifyEvent(raw) {
  const venue = raw._embedded?.venues?.[0]
  const classification = raw.classifications?.[0]
  const price = raw.priceRanges?.[0]

  // Pick the widest 16:9 image, or the first one if there isn't any.
  const wideImages = (raw.images ?? []).filter((img) => img.ratio === '16_9')
  const image = [...wideImages].sort((a, b) => b.width - a.width)[0] ?? raw.images?.[0]

  return {
    id: raw.id,
    name: raw.name,
    url: raw.url,
    date: raw.dates?.start?.localDate ?? null,
    time: raw.dates?.start?.localTime ?? null,
    dateTime: raw.dates?.start?.dateTime ?? null,
    status: raw.dates?.status?.code ?? 'onsale',
    image: image?.url ?? null,
    category: classification?.segment?.name ?? 'Other',
    genre: classification?.genre?.name ?? null,
    venue: venue?.name ?? 'Venue to be announced',
    city: venue?.city?.name ?? '',
    country: venue?.country?.name ?? '',
    priceMin: price?.min ?? null,
    priceMax: price?.max ?? null,
    currency: price?.currency ?? null,
  }
}

// Search events. `filters` comes straight from the Redux events slice.
export async function searchEvents(filters, page = 0) {
  const startDate = filters.startDate ? new Date(filters.startDate) : new Date()
  const endDate = filters.endDate ? new Date(filters.endDate + 'T23:59:59') : null

  const data = await request('/events.json', {
    keyword: filters.keyword.trim(),
    classificationName: filters.category,
    city: filters.city.trim(),
    countryCode: filters.countryCode,
    startDateTime: toApiDate(startDate),
    endDateTime: endDate ? toApiDate(endDate) : '',
    sort: filters.sort,
    size: PAGE_SIZE,
    page,
  })

  return {
    events: (data._embedded?.events ?? []).map(simplifyEvent),
    page: data.page.number,
    totalPages: Math.min(data.page.totalPages, MAX_PAGES),
    totalResults: data.page.totalElements,
  }
}
