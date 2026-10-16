import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { cancelRegistration, selectMyRegistrations } from '../store/registrationsSlice'
import { showToast } from '../store/toastSlice'
import { isPast } from '../utils/dates'
import PageHeader from '../components/PageHeader/PageHeader'
import EmptyState from '../components/EmptyState/EmptyState'
import TicketCard from '../components/TicketCard/TicketCard'
import Button from '../components/Button/Button'
import styles from './MyEvents.module.css'
import usePageTitle from '../utils/usePageTitle'

export default function MyEvents() {
  usePageTitle('My events')
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)
  const registrations = useSelector(selectMyRegistrations)
  const [tab, setTab] = useState('upcoming')

  // Split into upcoming and completed (past) events.
  const upcoming = registrations
    .filter((r) => !isPast(r.event))
    .sort((a, b) => (a.event.date ?? '').localeCompare(b.event.date ?? ''))
  const completed = registrations
    .filter((r) => isPast(r.event))
    .sort((a, b) => (b.event.date ?? '').localeCompare(a.event.date ?? ''))

  const shown = tab === 'upcoming' ? upcoming : completed

  const handleCancel = (event) => {
    if (!window.confirm(`Cancel your registration for ${event.name}?`)) return
    dispatch(cancelRegistration({ userId: user.id, eventId: event.id }))
    dispatch(showToast({ message: 'Your registration has been cancelled.' }))
  }

  return (
    <>
      <PageHeader eyebrow={`${user.name} · Member`} title="My events">
        Everything you’ve signed up for, upcoming and already attended.
      </PageHeader>

      <div className="container">
        <div className={styles.tabs} role="tablist">
          <button
            role="tab"
            aria-selected={tab === 'upcoming'}
            className={tab === 'upcoming' ? styles.activeTab : styles.tab}
            onClick={() => setTab('upcoming')}
          >
            Upcoming <span>{upcoming.length}</span>
          </button>
          <button
            role="tab"
            aria-selected={tab === 'completed'}
            className={tab === 'completed' ? styles.activeTab : styles.tab}
            onClick={() => setTab('completed')}
          >
            Attended <span>{completed.length}</span>
          </button>
        </div>

        {shown.length === 0 ? (
          <EmptyState
            stamp={tab === 'upcoming' ? 'No stubs yet' : 'Nothing yet'}
            title={tab === 'upcoming' ? 'Nothing coming up.' : 'No past events yet.'}
            action={
              tab === 'upcoming' && (
                <Button to="/events" variant="signal">
                  Find something to go to
                </Button>
              )
            }
          >
            {tab === 'upcoming'
              ? 'When you register for an event it’ll show up here as a ticket.'
              : 'Events you registered for move here once their date has passed.'}
          </EmptyState>
        ) : (
          <ul className={styles.list}>
            {shown.map((r) => (
              <TicketCard key={r.event.id} registration={r} attended={tab === 'completed'} onCancel={handleCancel} />
            ))}
          </ul>
        )}
      </div>
    </>
  )
}
