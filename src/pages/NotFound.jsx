import EmptyState from '../components/EmptyState/EmptyState'
import Button from '../components/Button/Button'

export default function NotFound() {
  return (
    <div className="container">
      <EmptyState
        stamp="404 · Sold out"
        title="This page isn’t on the programme."
        action={<Button to="/">Back to the front page</Button>}
      >
        The link may be old, or the page never existed.
      </EmptyState>
    </div>
  )
}
