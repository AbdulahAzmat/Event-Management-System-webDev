import { useSelector } from 'react-redux'
import { selectUser } from '../store/authSlice'
import PageHeader from '../components/PageHeader/PageHeader'
import EmptyState from '../components/EmptyState/EmptyState'
import Button from '../components/Button/Button'

export default function MyEvents() {
  const user = useSelector(selectUser)
  return (
    <>
      <PageHeader eyebrow={`${user.name} · Member`} title="My events">
        Everything you’ve signed up for, upcoming and already attended.
      </PageHeader>
      <div className="container">
        <EmptyState
          stamp="No stubs yet"
          title="Your wallet is empty."
          action={
            <Button to="/events" variant="signal">
              Find something to go to
            </Button>
          }
        >
          When you register for an event it’ll show up here as a ticket.
        </EmptyState>
      </div>
    </>
  )
}
