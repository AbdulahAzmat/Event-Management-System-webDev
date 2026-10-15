import { Link } from 'react-router-dom'
import { dateParts, formatTime } from '../../utils/format'
import styles from './TicketCard.module.css'

// A registered event shown as a ticket on the My Events page.
export default function TicketCard({ registration, attended, onCancel }) {
  const { event, registeredAt } = registration
  const { day, month, weekday } = dateParts(event.date)
  const bookedOn = new Date(registeredAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })

  return (
    <li className={`${styles.ticket} ${attended ? styles.attended : ''}`}>
      <div className={styles.date}>
        <span className={styles.day}>{day}</span>
        <span className={styles.month}>{month}</span>
      </div>

      <div className={styles.body}>
        <p className={styles.category}>{event.category}</p>
        <h3 className={styles.name}>
          <Link to={`/events/${event.id}`}>{event.name}</Link>
        </h3>
        <p className={styles.place}>
          {weekday} {formatTime(event.time)} · {event.venue}
          {event.city && `, ${event.city}`}
        </p>
      </div>

      <div className={styles.stub}>
        <span className={styles.admit}>Admit one</span>
        <span className={styles.booked}>Booked {bookedOn}</span>
        {attended ? (
          <span className={styles.stamp}>Attended</span>
        ) : (
          <button className={styles.cancel} onClick={() => onCancel(event)}>
            Cancel
          </button>
        )}
      </div>
    </li>
  )
}
