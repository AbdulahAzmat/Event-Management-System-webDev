import { useState } from 'react'
import { Link } from 'react-router-dom'
import { dateParts, formatPrice, formatTime } from '../../utils/format'
import styles from './EventRow.module.css'

// One line of the programme: date block, picture, name, venue and category.
export default function EventRow({ event }) {
  const { day, month, weekday } = dateParts(event.date)
  const price = formatPrice(event)
  const cancelled = event.status === 'cancelled'
  const [imageFailed, setImageFailed] = useState(false)

  return (
    <li>
      <Link to={`/events/${event.id}`} className={styles.row}>
        <div className={styles.date}>
          <span className={styles.day}>{day}</span>
          <span className={styles.month}>{month}</span>
          <span className={styles.time}>
            {weekday} {formatTime(event.time)}
          </span>
        </div>

        <div className={styles.thumb}>
          {event.image && !imageFailed ? (
            <img src={event.image} alt="" loading="lazy" onError={() => setImageFailed(true)} />
          ) : (
            <span>No image</span>
          )}
        </div>

        <div className={styles.info}>
          <h3 className={styles.name}>{event.name}</h3>
          <p className={styles.place}>
            {event.venue}
            {event.city && ` · ${event.city}`}
          </p>
        </div>

        <div className={styles.meta}>
          <span className={styles.tag}>{event.genre && event.genre !== 'Undefined' ? event.genre : event.category}</span>
          {cancelled ? (
            <span className={styles.cancelled}>Cancelled</span>
          ) : (
            price && <span className={styles.price}>{price}</span>
          )}
        </div>

        <span className={styles.arrow} aria-hidden="true">
          →
        </span>
      </Link>
    </li>
  )
}
