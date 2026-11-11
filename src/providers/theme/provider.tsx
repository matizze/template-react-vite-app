import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { THEME_STORAGE_KEY, ThemeContext, type ResolvedTheme, type ThemeMode } from './context'

const DARK_QUERY = '(prefers-color-scheme: dark)'

function readStoredMode(): ThemeMode {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    if (stored === 'light' || stored === 'dark' || stored === 'system') return stored
  } catch {
    // storage indisponível (modo privado, etc.)
  }
  return 'light'
}

function systemTheme(): ResolvedTheme {
  return window.matchMedia(DARK_QUERY).matches ? 'dark' : 'light'
}

/**
 * Controla o tema claro/escuro aplicando a classe `.dark` no <html>.
 * O script inline em `index.html` aplica a mesma lógica antes do primeiro paint
 * para evitar o "flash" de tema claro.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeMode, setThemeMode] = useState<ThemeMode>(readStoredMode)
  const [system, setSystem] = useState<ResolvedTheme>(systemTheme)

  const theme: ResolvedTheme = themeMode === 'system' ? system : themeMode

  useEffect(() => {
    if (themeMode !== 'system') return
    const mql = window.matchMedia(DARK_QUERY)
    const onChange = () => setSystem(mql.matches ? 'dark' : 'light')
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [themeMode])

  useEffect(() => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, themeMode)
    } catch {
      // ignora falha de storage
    }
  }, [themeMode])

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    root.style.colorScheme = theme
  }, [theme])

  const value = useMemo(
    () => ({
      theme,
      themeMode,
      setThemeMode,
      toggleTheme: () => setThemeMode(theme === 'dark' ? 'light' : 'dark'),
    }),
    [theme, themeMode],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
