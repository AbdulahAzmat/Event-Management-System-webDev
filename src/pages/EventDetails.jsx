import { useParams } from 'react-router-dom'
import PageHeader from '../components/PageHeader/PageHeader'
import EmptyState from '../components/EmptyState/EmptyState'
import Button from '../components/Button/Button'

export default function EventDetails() {
  const { id } = useParams()
  return (
    <>
      <PageHeader eyebrow={`Event · ${id}`} title="Event details" />
      <div className="container">
        <EmptyState stamp="Soon" title="Details page coming up." action={<Button to="/events">Back to events</Button>} />
      </div>
    </>
  )
}
