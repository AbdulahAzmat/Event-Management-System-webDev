import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { selectUser } from '../store/authSlice'
import { fetchUpcoming } from '../store/eventsSlice'
import { CATEGORIES } from '../utils/categories'
import Button from '../components/Button/Button'
import EventRow from '../components/EventRow/EventRow'
import Loader from '../components/Loader/Loader'
import styles from './Home.module.css'

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
  const dispatch = useDispatch()
  const user = useSelector(selectUser)
  const upcoming = useSelector((state) => state.events.upcoming)
  const upcomingStatus = useSelector((state) => state.events.upcomingStatus)
  const [week] = useState(thisWeek)
  const [month] = useState(() => new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }))

  // Load the "coming up" list once.
  useEffect(() => {
    if (upcomingStatus === 'idle') dispatch(fetchUpcoming())
  }, [dispatch, upcomingStatus])

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

      {upcomingStatus !== 'failed' && (
        <section className={`container ${styles.upcoming}`} aria-labelledby="upcoming-title">
          <div className={styles.indexHead}>
            <h2 id="upcoming-title">Coming up</h2>
            <Link to="/events" className="mono">
              See all events →
            </Link>
          </div>
          {upcomingStatus === 'loading' && <Loader rows={3} />}
          {upcomingStatus === 'succeeded' && (
            <ul className={styles.upcomingList}>
              {upcoming.map((event) => (
                <EventRow key={event.id} event={event} />
              ))}
            </ul>
          )}
        </section>
      )}

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
