import { Outlet } from 'react-router-dom'
import Header from '../Header/Header'
import Footer from '../Footer/Footer'
import styles from './Layout.module.css'

export default function Layout() {
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
    </div>
  )
}
