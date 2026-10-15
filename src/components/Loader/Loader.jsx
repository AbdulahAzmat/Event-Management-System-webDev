import styles from './Loader.module.css'

// Grey placeholder rows shown while events are loading.
export default function Loader({ rows = 5 }) {
  return (
    <ul className={styles.list} aria-label="Loading events">
      {Array.from({ length: rows }, (_, i) => (
        <li key={i} className={styles.row}>
          <span className={styles.date} />
          <span className={styles.thumb} />
          <span className={styles.lines}>
            <span />
            <span />
          </span>
        </li>
      ))}
    </ul>
  )
}
