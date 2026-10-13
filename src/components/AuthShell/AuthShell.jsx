import { useState } from 'react'
import styles from './AuthShell.module.css'

// Two-column frame for the login and register pages: a poster on the left, the form on the right.
export default function AuthShell({ eyebrow, title, posterLine, ticket, children }) {
  return (
    <section className={styles.shell}>
      <aside className={styles.poster}>
        <p className="mono">{eyebrow}</p>
        <h1 className={styles.posterTitle}>{posterLine}</h1>
        <Ticket {...ticket} />
      </aside>
      <div className={styles.panel}>
        <div className={styles.formWrap}>
          <h2 className={styles.title}>{title}</h2>
          {children}
        </div>
      </div>
    </section>
  )
}

function Ticket({ label, holder, serial }) {
  const [today] = useState(() =>
    new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase(),
  )
  return (
    <div className={styles.ticket} aria-hidden="true">
      <div className={styles.ticketMain}>
        <span className={styles.ticketLabel}>{label}</span>
        <span className={styles.ticketHolder}>{holder}</span>
        <div className={styles.ticketMeta}>
          <span>Issued {today}</span>
          <span>No. {serial}</span>
        </div>
      </div>
      <div className={styles.ticketStub}>
        <span className={styles.barcode} />
      </div>
    </div>
  )
}
