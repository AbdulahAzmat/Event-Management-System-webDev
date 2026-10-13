import styles from './PageHeader.module.css'

export default function PageHeader({ eyebrow, title, children }) {
  return (
    <header className={styles.header}>
      <div className="container">
        {eyebrow && <p className="mono">{eyebrow}</p>}
        <h1 className={styles.title}>{title}</h1>
        {children && <div className={styles.body}>{children}</div>}
      </div>
    </header>
  )
}
