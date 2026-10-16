import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { clearAuthError, loginUser, selectAuthError, selectAuthStatus } from '../store/authSlice'
import { validateLogin } from '../utils/validation'
import AuthShell from '../components/AuthShell/AuthShell'
import TextField from '../components/TextField/TextField'
import Button from '../components/Button/Button'
import styles from './AuthForm.module.css'
import usePageTitle from '../utils/usePageTitle'

export default function Login() {
  usePageTitle('Log in')
  const dispatch = useDispatch()
  const location = useLocation()
  const status = useSelector(selectAuthStatus)
  const serverError = useSelector(selectAuthError)
  const [values, setValues] = useState({ email: '', password: '' })
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => () => dispatch(clearAuthError()), [dispatch])

  const errors = useMemo(() => validateLogin(values), [values])
  const cameFromProtected = Boolean(location.state?.from)

  const handleChange = (e) => {
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }))
    if (serverError) dispatch(clearAuthError())
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    if (Object.keys(errors).length) return
    dispatch(loginUser(values))
  }

  return (
    <AuthShell
      eyebrow="Members · Re-entry"
      posterLine="Back for another night?"
      title="Log in"
      ticket={{ label: 'Re-entry pass', holder: values.email.split('@')[0] || 'Welcome back', serial: '00001' }}
    >
      <p className={styles.lede}>
        {cameFromProtected
          ? 'You’ll need to log in to see that page.'
          : 'Pick up where you left off with your saved events.'}
      </p>

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        {serverError && (
          <p className={styles.banner} role="alert">
            {serverError}
          </p>
        )}
        <TextField
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={handleChange}
          error={submitted && errors.email}
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={values.password}
          onChange={handleChange}
          error={submitted && errors.password}
        />
        <Button type="submit" size="lg" className={styles.submit} disabled={status === 'loading'}>
          {status === 'loading' ? 'Checking the list…' : 'Log in'}
        </Button>
      </form>

      <p className={styles.switch}>
        New to Stub?{' '}
        <Link to="/register" state={location.state}>
          Create an account
        </Link>
      </p>
    </AuthShell>
  )
}
