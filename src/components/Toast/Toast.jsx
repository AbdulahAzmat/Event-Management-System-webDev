import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { hideToast } from '../../store/toastSlice'
import styles from './Toast.module.css'

export default function Toast() {
  const dispatch = useDispatch()
  const { message, type, id } = useSelector((state) => state.toast)

  // Hide the message automatically after a few seconds.
  useEffect(() => {
    if (!message) return
    const timer = setTimeout(() => dispatch(hideToast()), 3500)
    return () => clearTimeout(timer)
  }, [dispatch, message, id])

  if (!message) return null

  return (
    <div className={`${styles.toast} ${styles[type]}`} role="status">
      <span>{message}</span>
      <button onClick={() => dispatch(hideToast())} aria-label="Close message">
        ×
      </button>
    </div>
  )
}
