// Small helpers for showing dates and prices.

// "2026-10-18" -> { day: '18', month: 'OCT', weekday: 'Sun' }
export function dateParts(isoDate) {
  if (!isoDate) return { day: '--', month: 'TBA', weekday: '' }
  const date = new Date(isoDate + 'T00:00:00')
  return {
    day: String(date.getDate()).padStart(2, '0'),
    month: date.toLocaleDateString('en-GB', { month: 'short' }).toUpperCase(),
    weekday: date.toLocaleDateString('en-GB', { weekday: 'short' }),
  }
}

// "19:30:00" -> "19:30"
export function formatTime(time) {
  return time ? time.slice(0, 5) : 'Time TBA'
}

export function formatPrice(event) {
  if (event.priceMin === null) return null
  const money = (n) => new Intl.NumberFormat('en-GB', { style: 'currency', currency: event.currency }).format(n)
  if (event.priceMin === event.priceMax) return money(event.priceMin)
  return `${money(event.priceMin)} – ${money(event.priceMax)}`
}
