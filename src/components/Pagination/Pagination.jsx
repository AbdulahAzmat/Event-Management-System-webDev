import styles from './Pagination.module.css'

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null

  return (
    <nav className={styles.pagination} aria-label="Pages">
      <button onClick={() => onChange(page - 1)} disabled={page === 0}>
        ← Previous
      </button>
      <span>
        Page {page + 1} of {totalPages}
      </span>
      <button onClick={() => onChange(page + 1)} disabled={page + 1 >= totalPages}>
        Next →
      </button>
    </nav>
  )
}
