import type { ReactNode } from 'react'

export interface NavSubItem {
  label: string
  path: string
  /** Mostra o selo "new" ao lado do item. */
  new?: boolean
}

export interface NavItem {
  label: string
  icon: ReactNode
  /** Rota do item. Omitir quando o item só agrupa `subItems`. */
  path?: string
  subItems?: NavSubItem[]
}

export interface NavSection {
  title: string
  items: NavItem[]
}
