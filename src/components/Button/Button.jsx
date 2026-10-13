import { Link } from 'react-router-dom'
import styles from './Button.module.css'

// One button for the whole site. Pass `to` to render a router link instead.
export default function Button({ variant = 'primary', size = 'md', to, className = '', children, ...rest }) {
  const classes = [styles.button, styles[variant], styles[size], className].join(' ')
  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {children}
      </Link>
    )
  }
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  )
}
