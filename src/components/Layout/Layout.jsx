import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from '../Header/Header'
import Footer from '../Footer/Footer'
import Toast from '../Toast/Toast'
import styles from './Layout.module.css'

export default function Layout() {
  const { pathname } = useLocation()

  // Start each new page at the top instead of where the last one was scrolled to.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className={styles.shell}>
      <a href="#main" className={styles.skip}>
        Skip to content
      </a>
      <Header />
      <main id="main" className={styles.main}>
        <Outlet />
      </main>
      <Footer />
      <Toast />
    </div>
  )
}
