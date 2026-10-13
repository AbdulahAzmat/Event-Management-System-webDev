import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectUser } from '../store/authSlice'
import Button from '../components/Button/Button'
import styles from './Home.module.css'

// Ticketmaster's top-level "segments". Day 2 swaps this for the live classifications feed.
const CATEGORIES = [
  { name: 'Music', note: 'Gigs, tours, club nights' },
  { name: 'Sports', note: 'Matches, fights, race days' },
  { name: 'Arts & Theatre', note: 'Plays, musicals, dance, comedy' },
  { name: 'Family', note: 'Shows the kids will remember' },
  { name: 'Film', note: 'Screenings and premieres' },
  { name: 'Miscellaneous', note: 'Expos, tours and the odd one out' },
]

function thisWeek() {
  const today = new Date()
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    return {
      key: d.toDateString(),
      day: d.toLocaleDateString('en-GB', { weekday: 'short' }),
      date: d.getDate(),
      isToday: i === 0,
    }
  })
}

export default function Home() {
  const user = useSelector(selectUser)
  const [week] = useState(thisWeek)
  const [month] = useState(() => new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }))

  return (
    <>
      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <p className={`mono ${styles.edition}`}>
            <span>The programme</span>
            <span>{month}</span>
          </p>

          <h1 className={styles.headline}>
            What’s <em>on</em>
            <span className={styles.headlineDot}>.</span>
          </h1>

          <div className={styles.heroFoot}>
            <p className={styles.intro}>
              Concerts, matches, plays and everything in between. Find something worth leaving the house for,
              grab your spot, and keep every stub in one place.
            </p>
            <div className={styles.ctas}>
              <Button to="/events" size="lg" variant="signal">
                Browse events
              </Button>
              {!user && (
                <Button to="/register" size="lg" variant="ghost">
                  Create account
                </Button>
              )}
            </div>
          </div>

          <ol className={styles.week} aria-label="This week">
            {week.map((d) => (
              <li key={d.key} className={d.isToday ? styles.today : ''}>
                <span className={styles.weekDay}>{d.isToday ? 'Today' : d.day}</span>
                <span className={styles.weekDate}>{String(d.date).padStart(2, '0')}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={`container ${styles.index}`} aria-labelledby="index-title">
        <div className={styles.indexHead}>
          <h2 id="index-title">Index</h2>
          <p className="mono">Pick a section</p>
        </div>
        <ul className={styles.categoryList}>
          {CATEGORIES.map((c, i) => (
            <li key={c.name}>
              <Link to={`/events?category=${encodeURIComponent(c.name)}`} className={styles.categoryRow}>
                <span className={styles.categoryNum}>{String(i + 1).padStart(2, '0')}</span>
                <span className={styles.categoryName}>{c.name}</span>
                <span className={styles.categoryNote}>{c.note}</span>
                <span className={styles.categoryArrow} aria-hidden="true">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.band}>
        <div className={`container ${styles.bandInner}`}>
          {user ? (
            <>
              <h2>Good to see you, {user.name.split(' ')[0]}.</h2>
              <Button to="/my-events" size="lg">
                See my events
              </Button>
            </>
          ) : (
            <>
              <h2>Never lose a ticket stub again.</h2>
              <Button to="/register" size="lg">
                Sign up free
              </Button>
            </>
          )}
        </div>
      </section>
    </>
  )
}
