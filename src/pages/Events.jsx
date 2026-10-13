import PageHeader from '../components/PageHeader/PageHeader'
import EmptyState from '../components/EmptyState/EmptyState'

export default function Events() {
  return (
    <>
      <PageHeader eyebrow="The programme" title="All events">
        Search what’s on near you, filter by category, city and date.
      </PageHeader>
      <div className="container">
        <EmptyState stamp="Soon" title="Listings are on their way.">
          The live Ticketmaster feed plugs in here next.
        </EmptyState>
      </div>
    </>
  )
}
