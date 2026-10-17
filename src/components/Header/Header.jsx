import { useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout, selectUser } from '../../store/authSlice'
import Button from '../Button/Button'
import styles from './Header.module.css'

export default function Header() {
  const user = useSelector(selectUser)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  // The mobile menu remembers which page it was opened on, so navigating closes it.
  const [menuOpenOn, setMenuOpenOn] = useState(null)
  const menuOpen = menuOpenOn === location.pathname

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  const navClass = ({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`

  return (
    <header className={styles.header}>
      <div className={`container ${styles.bar}`}>
        <Link to="/" className={styles.logo} aria-label="Stub home">
          Stub<span className={styles.logoDot}>.</span>
        </Link>

        <button
          className={styles.menuToggle}
          aria-expanded={menuOpen}
          aria-controls="site-nav"
          onClick={() => setMenuOpenOn(menuOpen ? null : location.pathname)}
        >
          {menuOpen ? 'Close' : 'Menu'}
        </button>

        <nav id="site-nav" className={`${styles.nav} ${menuOpen ? styles.open : ''}`}>
          <NavLink to="/events" className={navClass}>
            Events
          </NavLink>
          <NavLink to="/my-events" className={navClass}>
            My events
          </NavLink>

          <div className={styles.account}>
            {user ? (
              <>
                <span className={styles.greeting}>
                  <span className={styles.avatar} aria-hidden="true">
                    {user.name.charAt(0)}
                  </span>
                  {user.name.split(' ')[0]}
                </span>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  Log out
                </Button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={navClass}>
                  Log in
                </NavLink>
                <Button to="/register" size="sm">
                  Sign up
                </Button>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}
