import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

/**
 * tailwind-merge estendido com os tokens customizados do tema (index.css).
 * Sem isso, `text-title-lg` seria tratado como cor e removido ao lado de `text-gray-800`.
 * Ao criar uma nova `@utility` com estados mutuamente exclusivos, registre o grupo aqui.
 */
const twMerge = extendTailwindMerge<
  | 'menu-item-state'
  | 'menu-item-icon-state'
  | 'menu-dropdown-item-state'
  | 'menu-dropdown-badge-state'
>({
  extend: {
    classGroups: {
      'font-size': [
        {
          text: [
            'heading-one',
            'heading-two',
            'heading-three',
            'heading-four',
            'heading-five',
            'heading-six',
            'title-sm',
            'title-md',
            'title-lg',
            'title-2xl',
            'theme-xs',
            'theme-sm',
            'theme-xl',
          ],
        },
      ],
      shadow: [
        {
          shadow: [
            'theme-xs',
            'theme-sm',
            'theme-md',
            'theme-lg',
            'theme-xl',
            'focus-ring',
            'tooltip',
          ],
        },
      ],
      'menu-item-state': ['menu-item-active', 'menu-item-inactive'],
      'menu-item-icon-state': ['menu-item-icon-active', 'menu-item-icon-inactive'],
      'menu-dropdown-item-state': ['menu-dropdown-item-active', 'menu-dropdown-item-inactive'],
      'menu-dropdown-badge-state': ['menu-dropdown-badge-active', 'menu-dropdown-badge-inactive'],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
