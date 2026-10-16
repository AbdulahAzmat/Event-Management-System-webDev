import { useEffect } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchEventById } from '../store/eventsSlice'
import { cancelRegistration, registerForEvent, selectMyRegistrations } from '../store/registrationsSlice'
import { showToast } from '../store/toastSlice'
import { dateParts, formatPrice, formatTime } from '../utils/format'
import { isPast } from '../utils/dates'
import Button from '../components/Button/Button'
import EmptyState from '../components/EmptyState/EmptyState'
import usePageTitle from '../utils/usePageTitle'
import styles from './EventDetails.module.css'

export default function EventDetails() {
  const { id } = useParams()
  const location = useLocation()
  const dispatch = useDispatch()

  const event = useSelector((state) => state.events.current)
  const status = useSelector((state) => state.events.currentStatus)
  const error = useSelector((state) => state.events.currentError)
  const user = useSelector((state) => state.auth.user)
  const myRegistrations = useSelector(selectMyRegistrations)
  usePageTitle(event?.name ?? 'Event')

  useEffect(() => {
    dispatch(fetchEventById(id))
  }, [dispatch, id])

  if (status === 'loading' || status === 'idle') {
    return <div className={`container ${styles.loading}`}>Loading event…</div>
  }

  if (status === 'failed') {
    return (
      <div className="container">
        <EmptyState
          stamp="Error"
          title="We couldn’t load this event."
          action={<Button to="/events">Back to events</Button>}
        >
          {error}
        </EmptyState>
      </div>
    )
  }

  const { day, month, weekday } = dateParts(event.date)
  const price = formatPrice(event)
  const isRegistered = myRegistrations.some((r) => r.event.id === event.id)
  const past = isPast(event)
  const cancelled = event.status === 'cancelled'

  const handleRegister = () => {
    dispatch(registerForEvent({ userId: user.id, event }))
    dispatch(showToast({ message: `You’re registered for ${event.name}.` }))
  }

  const handleCancel = () => {
    if (!window.confirm('Cancel your registration for this event?')) return
    dispatch(cancelRegistration({ userId: user.id, eventId: event.id }))
    dispatch(showToast({ message: 'Your registration has been cancelled.' }))
  }

  // What the ticket box at the side should say.
  let action
  if (cancelled) {
    action = <p className={styles.notice}>This event has been cancelled.</p>
  } else if (past) {
    action = <p className={styles.notice}>This event has already happened.</p>
  } else if (!user) {
    action = (
      <Button to="/login" state={{ from: location.pathname }} size="lg" className={styles.fullWidth}>
        Log in to register
      </Button>
    )
  } else if (isRegistered) {
    action = (
      <>
        <p className={styles.going}>✓ You’re going</p>
        <Button variant="ghost" onClick={handleCancel} className={styles.fullWidth}>
          Cancel registration
        </Button>
      </>
    )
  } else {
    action = (
      <Button variant="signal" size="lg" onClick={handleRegister} className={styles.fullWidth}>
        Register for this event
      </Button>
    )
  }

  return (
    <article>
      <div className={`container ${styles.top}`}>
        <Link to="/events" className={`mono ${styles.back}`}>
          ← All events
        </Link>
        <p className="mono">
          {event.category}
          {event.genre && event.genre !== 'Undefined' && ` · ${event.genre}`}
        </p>
        <h1 className={styles.title}>{event.name}</h1>
      </div>

      <div className={`container ${styles.layout}`}>
        <div className={styles.main}>
          {event.image && <img src={event.image} alt={event.name} className={styles.image} />}

          {event.info && (
            <section className={styles.section}>
              <h2>About</h2>
              <p>{event.info}</p>
            </section>
          )}

          {event.lineup.length > 0 && (
            <section className={styles.section}>
              <h2>Line-up</h2>
              <ul className={styles.lineup}>
                {event.lineup.map((artist) => (
                  <li key={artist.id}>{artist.name}</li>
                ))}
              </ul>
            </section>
          )}

          <section className={styles.section}>
            <h2>Venue</h2>
            <p className={styles.venueName}>{event.venue}</p>
            {event.address && <p>{event.address}</p>}
            {event.country && <p>{event.country}</p>}
            {event.latitude && (
              <a
                href={`https://www.google.com/maps?q=${event.latitude},${event.longitude}`}
                target="_blank"
                rel="noreferrer"
                className={styles.link}
              >
                Open in Google Maps ↗
              </a>
            )}
          </section>

          {event.pleaseNote && (
            <section className={styles.section}>
              <h2>Please note</h2>
              <p>{event.pleaseNote}</p>
            </section>
          )}

          {event.seatMap && (
            <section className={styles.section}>
              <h2>Seat map</h2>
              <img src={event.seatMap} alt={`Seat map for ${event.venue}`} className={styles.seatMap} />
            </section>
          )}
        </div>

        {/* The ticket on the right with the date and the register button */}
        <aside className={styles.ticket}>
          <div className={styles.ticketDate}>
            <span className={styles.day}>{day}</span>
            <span className={styles.month}>{month}</span>
          </div>

          <dl className={styles.facts}>
            <div>
              <dt>When</dt>
              <dd>
                {weekday} {formatTime(event.time)}
              </dd>
            </div>
            <div>
              <dt>Where</dt>
              <dd>
                {event.venue}
                {event.city && `, ${event.city}`}
              </dd>
            </div>
            {price && (
              <div>
                <dt>Price</dt>
                <dd>{price}</dd>
              </div>
            )}
            {event.ticketLimit && (
              <div>
                <dt>Limit</dt>
                <dd>{event.ticketLimit}</dd>
              </div>
            )}
          </dl>

          <div className={styles.stub}>
            {action}
            {event.url && (
              <a href={event.url} target="_blank" rel="noreferrer" className={styles.link}>
                View on Ticketmaster ↗
              </a>
            )}
          </div>
        </aside>
      </div>
    </article>
  )
}
