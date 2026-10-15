import { useDispatch, useSelector } from 'react-redux'
import { setFilters } from '../../store/eventsSlice'
import { COUNTRIES } from '../../utils/categories'
import Button from '../Button/Button'
import styles from './EventFilters.module.css'

// Used to stop people picking dates in the past.
const today = new Date().toISOString().slice(0, 10)

// The search box and filters. Every input writes straight into the Redux filters.
export default function EventFilters({ onSearch, onClear }) {
  const dispatch = useDispatch()
  const filters = useSelector((state) => state.events.filters)

  const handleChange = (e) => {
    dispatch(setFilters({ [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch()
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} role="search">
      <div className={styles.searchRow}>
        <label htmlFor="keyword" className="visually-hidden">
          Search events
        </label>
        <input
          id="keyword"
          name="keyword"
          className={styles.keyword}
          placeholder="Search artists, teams, shows…"
          value={filters.keyword}
          onChange={handleChange}
        />
        <Button type="submit" variant="signal">
          Search
        </Button>
      </div>

      <div className={styles.filterRow}>
        <label className={styles.field}>
          <span>City</span>
          <input name="city" placeholder="Any city" value={filters.city} onChange={handleChange} />
        </label>

        <label className={styles.field}>
          <span>Country</span>
          <select name="countryCode" value={filters.countryCode} onChange={handleChange}>
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.field}>
          <span>From</span>
          <input type="date" name="startDate" min={today} value={filters.startDate} onChange={handleChange} />
        </label>

        <label className={styles.field}>
          <span>To</span>
          <input
            type="date"
            name="endDate"
            min={filters.startDate || today}
            value={filters.endDate}
            onChange={handleChange}
          />
        </label>

        <label className={styles.field}>
          <span>Sort by</span>
          <select name="sort" value={filters.sort} onChange={handleChange}>
            <option value="date,asc">Date (soonest)</option>
            <option value="date,desc">Date (latest)</option>
            <option value="name,asc">Name (A–Z)</option>
            <option value="relevance,desc">Relevance</option>
          </select>
        </label>

        <button type="button" className={styles.clear} onClick={onClear}>
          Clear all
        </button>
      </div>
    </form>
  )
}
