import { Link } from 'wouter'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { SidebarMenuItem as UiSidebarMenuItem } from '@/components/ui/sidebar'
import { ChevronDownIcon } from '@/icons'
import { cn } from '@/lib/utils'
import { isPathActive } from './data'
import type { NavItem } from './types'

interface SidebarMenuItemProps {
  nav: NavItem
  isOpen: boolean
  showContent: boolean
  pathname: string
  onToggle: () => void
}

export function SidebarMenuItem({
  nav,
  isOpen,
  showContent,
  pathname,
  onToggle,
}: SidebarMenuItemProps) {
  const subItems = nav.subItems ?? []
  const hasSubItems = subItems.length > 0
  const hasActiveChild = subItems.some((sub) => isPathActive(pathname, sub.path))
  const isActive = hasSubItems
    ? isOpen || hasActiveChild
    : Boolean(nav.path && isPathActive(pathname, nav.path))

  const icon = (
    <span className={isActive ? 'menu-item-icon-active' : 'menu-item-icon-inactive'}>
      {nav.icon}
    </span>
  )

  if (!hasSubItems) {
    if (!nav.path) return null
    return (
      <UiSidebarMenuItem>
        <Link
          href={nav.path}
          aria-current={isActive ? 'page' : undefined}
          className={cn(
            'group menu-item',
            isActive ? 'menu-item-active' : 'menu-item-inactive',
            !showContent && 'justify-center',
          )}
        >
          {icon}
          {showContent && <span>{nav.label}</span>}
        </Link>
      </UiSidebarMenuItem>
    )
  }

  return (
    <UiSidebarMenuItem>
      <Collapsible open={showContent && isOpen} onOpenChange={onToggle}>
        <CollapsibleTrigger
          className={cn(
            'group menu-item cursor-pointer',
            isActive ? 'menu-item-active' : 'menu-item-inactive',
            !showContent && 'justify-center',
          )}
        >
          {icon}
          {showContent && <span>{nav.label}</span>}
          {showContent && (
            <ChevronDownIcon
              className={cn(
                'ms-auto size-5 transition-transform duration-200',
                isOpen && 'text-brand-500 rotate-180',
              )}
            />
          )}
        </CollapsibleTrigger>
        <CollapsibleContent>
          <ul className="ms-9 mt-2 space-y-1">
            {subItems.map((sub) => {
              const subActive = isPathActive(pathname, sub.path)
              return (
                <li key={sub.path}>
                  <Link
                    href={sub.path}
                    aria-current={subActive ? 'page' : undefined}
                    className={cn(
                      'group menu-dropdown-item',
                      subActive ? 'menu-dropdown-item-active' : 'menu-dropdown-item-inactive',
                    )}
                  >
                    {sub.label}
                    {sub.new && (
                      <span
                        className={cn(
                          'menu-dropdown-badge ms-auto',
                          subActive ? 'menu-dropdown-badge-active' : 'menu-dropdown-badge-inactive',
                        )}
                      >
                        new
                      </span>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </CollapsibleContent>
      </Collapsible>
    </UiSidebarMenuItem>
  )
}
