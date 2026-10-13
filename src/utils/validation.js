const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function validateRegister({ name, email, password, confirm }) {
  const errors = {}
  if (name.trim().length < 2) errors.name = 'Tell us your name (at least 2 letters).'
  if (!EMAIL_PATTERN.test(email.trim())) errors.email = 'That email doesn’t look right.'
  if (password.length < 8) errors.password = 'Use at least 8 characters.'
  else if (!/\d/.test(password) || !/[a-zA-Z]/.test(password))
    errors.password = 'Mix in at least one letter and one number.'
  if (confirm !== password) errors.confirm = 'Passwords don’t match.'
  return errors
}

export function validateLogin({ email, password }) {
  const errors = {}
  if (!EMAIL_PATTERN.test(email.trim())) errors.email = 'Enter the email you signed up with.'
  if (!password) errors.password = 'Enter your password.'
  return errors
}

export function passwordStrength(password) {
  let score = 0
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/\d/.test(password) && /[a-zA-Z]/.test(password)) score++
  if (/[^a-zA-Z0-9]/.test(password) || /[A-Z]/.test(password)) score++
  return score
}
