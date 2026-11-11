import { useEffect } from 'react'
import { useLocation } from 'wouter'

/** Volta ao topo da página a cada troca de rota. */
export function ScrollToTop() {
  const [pathname] = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 })
  }, [pathname])

  return null
}
