// True if the event's date is before today.
export function isPast(event) {
  if (!event.date) return false
  const today = new Date().toISOString().slice(0, 10)
  return event.date < today
}
