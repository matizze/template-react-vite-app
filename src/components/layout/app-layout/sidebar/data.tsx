import { BoxIcon, TaskIcon } from '@/icons'
import type { NavSection } from './types'

/**
 * Itens do menu lateral. Ao criar uma página nova, registre a rota em `App.tsx`
 * e adicione o item aqui. Itens com `subItems` viram um grupo expansível.
 */
export const navSections: NavSection[] = [
  {
    title: 'Menu',
    items: [{ label: 'Tasks', icon: <TaskIcon className="size-6" />, path: '/tasks' }],
  },
  {
    title: 'Design system',
    items: [{ label: 'Components', icon: <BoxIcon className="size-6" />, path: '/components' }],
  },
]

/** Uma rota está ativa quando é exatamente o path ou uma sub-rota dele (`/tasks/123`). */
export function isPathActive(pathname: string, path: string) {
  return pathname === path || pathname.startsWith(`${path}/`)
}
