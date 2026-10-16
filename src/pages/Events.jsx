import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { clearFilters, fetchEvents, setFilters } from '../store/eventsSlice'
import { CATEGORIES } from '../utils/categories'
import PageHeader from '../components/PageHeader/PageHeader'
import EventFilters from '../components/EventFilters/EventFilters'
import EventRow from '../components/EventRow/EventRow'
import Loader from '../components/Loader/Loader'
import Pagination from '../components/Pagination/Pagination'
import EmptyState from '../components/EmptyState/EmptyState'
import Button from '../components/Button/Button'
import styles from './Events.module.css'
import usePageTitle from '../utils/usePageTitle'

export default function Events() {
  usePageTitle('Events')
  const dispatch = useDispatch()
  const { list, page, totalPages, totalResults, status, error, filters } = useSelector((state) => state.events)

  // The category lives in the URL (/events?category=Music) so links from the home page work.
  const [searchParams, setSearchParams] = useSearchParams()
  const categoryInUrl = searchParams.get('category') ?? ''

  // Whenever the category in the URL changes, update the filter and load page 1.
  useEffect(() => {
    dispatch(setFilters({ category: categoryInUrl }))
    dispatch(fetchEvents(0))
  }, [dispatch, categoryInUrl])

  const chooseCategory = (name) => {
    setSearchParams(name ? { category: name } : {})
  }

  const search = () => dispatch(fetchEvents(0))

  const clearAll = () => {
    dispatch(clearFilters())
    if (categoryInUrl) {
      setSearchParams({}) // the effect above reloads the list
    } else {
      dispatch(fetchEvents(0))
    }
  }

  const goToPage = (newPage) => {
    dispatch(fetchEvents(newPage))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <PageHeader eyebrow="The programme" title={filters.category || 'All events'}>
        Search what’s on, then narrow it down by category, place and date.
      </PageHeader>

      <div className="container">
        <div className={styles.chips} role="group" aria-label="Categories">
          <button className={!categoryInUrl ? styles.chipActive : styles.chip} onClick={() => chooseCategory('')}>
            Everything
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.name}
              className={categoryInUrl === c.name ? styles.chipActive : styles.chip}
              onClick={() => chooseCategory(c.name)}
            >
              {c.name}
            </button>
          ))}
        </div>

        <EventFilters onSearch={search} onClear={clearAll} />

        <section className={styles.results} aria-live="polite">
          {status === 'loading' && <Loader />}

          {status === 'failed' && (
            <EmptyState stamp="Error" title="We couldn’t load events." action={<Button onClick={search}>Try again</Button>}>
              {error}
            </EmptyState>
          )}

          {status === 'succeeded' && list.length === 0 && (
            <EmptyState
              stamp="Nothing on"
              title="No events match that."
              action={
                <Button variant="ghost" onClick={clearAll}>
                  Clear filters
                </Button>
              }
            >
              Try a different keyword, a wider date range or another city. Ticketmaster only lists events in the
              countries it sells tickets in, such as the US, Canada, the UK, Ireland, Australia and much of Europe.
            </EmptyState>
          )}

          {status === 'succeeded' && list.length > 0 && (
            <>
              <p className={styles.count}>
                <strong>{totalResults.toLocaleString()}</strong> events found
              </p>
              <ul className={styles.list}>
                {list.map((event) => (
                  <EventRow key={event.id} event={event} />
                ))}
              </ul>
              <Pagination page={page} totalPages={totalPages} onChange={goToPage} />
            </>
          )}
        </section>
      </div>
    </>
  )
}
