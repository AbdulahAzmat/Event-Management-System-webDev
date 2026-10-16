import { useEffect } from 'react'

// Sets the text shown in the browser tab, e.g. "Log in · Stub".
export default function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · Stub` : 'Stub · Events worth leaving the house for'
  }, [title])
}
