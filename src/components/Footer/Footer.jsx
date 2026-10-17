import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <p className={styles.mark}>
          Stub<span>.</span>
        </p>
        <p className={styles.tag}>Events worth leaving the house for.</p>
        <nav className={styles.links} aria-label="Footer">
          <Link to="/events">Events</Link>
          <Link to="/my-events">My events</Link>
          <Link to="/register">Sign up</Link>
        </nav>
      </div>
    </footer>
  )
}
