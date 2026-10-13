import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectIsLoggedIn } from '../../store/authSlice'

// Pages behind a login. Guests go to /login and come back here afterwards.
export function ProtectedRoute() {
  const isLoggedIn = useSelector(selectIsLoggedIn)
  const location = useLocation()
  if (!isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }
  return <Outlet />
}

// Login and register make no sense once you're signed in.
export function GuestRoute() {
  const isLoggedIn = useSelector(selectIsLoggedIn)
  const location = useLocation()
  if (isLoggedIn) {
    return <Navigate to={location.state?.from ?? '/events'} replace />
  }
  return <Outlet />
}
