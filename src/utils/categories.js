// Ticketmaster groups every event under one of these top-level "segments".
// The name is sent to the API as `classificationName` to filter by category.
export const CATEGORIES = [
  { name: 'Music', note: 'Gigs, tours, club nights' },
  { name: 'Sports', note: 'Matches, fights, race days' },
  { name: 'Arts & Theatre', note: 'Plays, musicals, dance, comedy' },
  { name: 'Family', note: 'Shows the kids will remember' },
  { name: 'Film', note: 'Screenings and premieres' },
  { name: 'Miscellaneous', note: 'Expos, tours and the odd one out' },
]

export const COUNTRIES = [
  { code: '', name: 'Any country' },
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'IE', name: 'Ireland' },
  { code: 'DE', name: 'Germany' },
  { code: 'ES', name: 'Spain' },
  { code: 'NL', name: 'Netherlands' },
]
