// Small wrapper around localStorage so a blocked or full storage never crashes the app.
const PREFIX = 'stub.'

export function load(key, fallback) {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function save(key, value) {
  try {
    if (value === null || value === undefined) {
      localStorage.removeItem(PREFIX + key)
    } else {
      localStorage.setItem(PREFIX + key, JSON.stringify(value))
    }
  } catch {
    // Storage unavailable (private mode, quota). The app still works for this visit.
  }
}
