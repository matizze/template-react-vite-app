import { createContext } from 'react'

export type ThemeMode = 'light' | 'dark' | 'system'
export type ResolvedTheme = 'light' | 'dark'

export interface ThemeContextValue {
  /** Tema efetivamente aplicado. */
  theme: ResolvedTheme
  /** Preferência escolhida pelo usuário. */
  themeMode: ThemeMode
  setThemeMode: (mode: ThemeMode) => void
  toggleTheme: () => void
}

export const THEME_STORAGE_KEY = 'theme-mode'

export const ThemeContext = createContext<ThemeContextValue | null>(null)
