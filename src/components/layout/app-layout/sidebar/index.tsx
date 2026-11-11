import { useState } from 'react'
import { Link, useLocation } from 'wouter'
import { Logo } from '@/components/layout/logo'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  useSidebar,
} from '@/components/ui/sidebar'
import { HorizontalDotsIcon } from '@/icons'
import { cn } from '@/lib/utils'
import { isPathActive, navSections } from './data'
import { SidebarMenuItem } from './sidebar-menu-item'

/** Chave do submenu aberto: `${índiceDaSeção}-${índiceDoItem}`. */
function findActiveSubmenu(pathname: string): string | null {
  for (const [s, section] of navSections.entries()) {
    for (const [i, item] of section.items.entries()) {
      if (item.subItems?.some((sub) => isPathActive(pathname, sub.path))) return `${s}-${i}`
    }
  }
  return null
}

export function AppSidebar() {
  const { open, isMobile, isHovered } = useSidebar()
  const [pathname] = useLocation()
  const showContent = open || isHovered || isMobile

  const [openSubmenu, setOpenSubmenu] = useState(() => findActiveSubmenu(pathname))
  const [prevPathname, setPrevPathname] = useState(pathname)
  if (prevPathname !== pathname) {
    setPrevPathname(pathname)
    setOpenSubmenu(findActiveSubmenu(pathname))
  }

  return (
    <Sidebar side="left" collapsible="icon">
      <SidebarHeader className={cn('px-5 py-8', !showContent && 'items-center')}>
        <Link href="/" aria-label="Home">
          <Logo variant={showContent ? 'full' : 'icon'} />
        </Link>
      </SidebarHeader>

      <SidebarContent className="overflow-y-auto px-5 duration-300 ease-linear">
        <nav className="mb-6 flex flex-col gap-4">
          {navSections.map((section, s) => (
            <SidebarGroup key={section.title} className="p-0">
              <SidebarGroupLabel
                className={cn(
                  'mb-4 flex h-auto p-0 text-xs leading-5 text-gray-400 uppercase',
                  showContent ? 'justify-start' : 'justify-center',
                )}
              >
                {showContent ? section.title : <HorizontalDotsIcon />}
              </SidebarGroupLabel>
              <SidebarMenu className="gap-1">
                {section.items.map((item, i) => {
                  const key = `${s}-${i}`
                  return (
                    <SidebarMenuItem
                      key={item.label}
                      nav={item}
                      isOpen={openSubmenu === key}
                      showContent={showContent}
                      pathname={pathname}
                      onToggle={() => setOpenSubmenu((curr) => (curr === key ? null : key))}
                    />
                  )
                })}
              </SidebarMenu>
            </SidebarGroup>
          ))}
        </nav>
      </SidebarContent>
    </Sidebar>
  )
}
