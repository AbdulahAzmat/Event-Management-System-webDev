import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { clearAuthError, registerUser, selectAuthError, selectAuthStatus } from '../store/authSlice'
import { passwordStrength, validateRegister } from '../utils/validation'
import AuthShell from '../components/AuthShell/AuthShell'
import TextField from '../components/TextField/TextField'
import Button from '../components/Button/Button'
import styles from './AuthForm.module.css'

const EMPTY = { name: '', email: '', password: '', confirm: '' }

export default function Register() {
  const dispatch = useDispatch()
  const status = useSelector(selectAuthStatus)
  const serverError = useSelector(selectAuthError)
  const [values, setValues] = useState(EMPTY)
  const [touched, setTouched] = useState({})
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => () => dispatch(clearAuthError()), [dispatch])

  const errors = useMemo(() => validateRegister(values), [values])
  const showError = (field) => (touched[field] || submitted) && errors[field]
  const strength = passwordStrength(values.password)
  // A short ticket serial derived from the email, so it changes as you type.
  const serial = String([...values.email].reduce((n, c) => (n * 31 + c.charCodeAt(0)) % 99991, 4207)).padStart(5, '0')

  const handleChange = (e) => {
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }))
    if (serverError) dispatch(clearAuthError())
  }
  const handleBlur = (e) => setTouched((t) => ({ ...t, [e.target.name]: true }))

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    if (Object.keys(errors).length) return
    dispatch(registerUser(values))
  }

  return (
    <AuthShell
      eyebrow="New here · Join the list"
      posterLine="Your name on the door."
      title="Create an account"
      ticket={{ label: 'Admit one', holder: values.name.trim() || 'Your name here', serial }}
    >
      <p className={styles.lede}>One account to save the events you’re going to and keep track of the ones you’ve been to.</p>

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        {serverError && (
          <p className={styles.banner} role="alert">
            {serverError}
          </p>
        )}
        <TextField
          label="Full name"
          name="name"
          autoComplete="name"
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
          error={showError('name')}
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          error={showError('email')}
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          autoComplete="new-password"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          error={showError('password')}
          hint="8+ characters with a letter and a number."
        >
          <div className={styles.strength} data-score={strength} aria-label={`Password strength ${strength} of 4`}>
            {[1, 2, 3, 4].map((n) => (
              <span key={n} className={n <= strength ? styles.on : ''} />
            ))}
          </div>
        </TextField>
        <TextField
          label="Confirm password"
          name="confirm"
          type="password"
          autoComplete="new-password"
          value={values.confirm}
          onChange={handleChange}
          onBlur={handleBlur}
          error={showError('confirm')}
        />
        <Button type="submit" size="lg" className={styles.submit} disabled={status === 'loading'}>
          {status === 'loading' ? 'Printing your ticket…' : 'Create account'}
        </Button>
      </form>

      <p className={styles.switch}>
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </AuthShell>
  )
}
