import { useEffect, useRef, useState } from 'react'
import { Link } from 'wouter'
import { Logo } from '@/components/layout/logo'
import { ThemeToggle } from '@/components/shared/theme-toggle'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { useSidebar } from '@/components/ui/sidebar'
import { HorizontalDotsIcon, MenuTwoIcon, SearchIcon, XIcon } from '@/icons'
import { cn } from '@/lib/utils'
import { UserDropdown } from './user-dropdown'

export function AppHeader() {
  const searchRef = useRef<HTMLInputElement>(null)
  const [isActionsOpen, setActionsOpen] = useState(false)
  const { openMobile, toggleSidebar } = useSidebar()

  // ⌘K / Ctrl+K foca a busca
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault()
        searchRef.current?.focus()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <header className="sticky top-0 z-50 flex w-full shrink-0 border-gray-200 bg-white xl:border-b dark:border-gray-800 dark:bg-gray-900">
      <div className="flex grow flex-col items-center justify-between xl:flex-row xl:px-6">
        <div className="flex w-full items-center justify-between gap-2 border-b border-gray-200 px-3 py-3 sm:gap-4 xl:justify-normal xl:border-b-0 xl:px-0 xl:py-4 dark:border-gray-800">
          <Button
            variant="outline"
            size="icon"
            className="text-gray-500 lg:size-11 dark:text-gray-400"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            {openMobile ? <XIcon className="size-6" /> : <MenuTwoIcon className="size-auto!" />}
          </Button>

          <Link href="/" className="xl:hidden" aria-label="Home">
            <Logo />
          </Link>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setActionsOpen((open) => !open)}
            aria-label="Toggle header actions"
            className="text-gray-700 xl:hidden dark:text-gray-400"
          >
            <HorizontalDotsIcon />
          </Button>

          <form className="hidden xl:block" role="search" onSubmit={(e) => e.preventDefault()}>
            <InputGroup className="border-gray-200 bg-transparent xl:w-107.5 dark:border-gray-800 dark:bg-white/3">
              <InputGroupAddon align="inline-start">
                <SearchIcon className="size-5 text-gray-500 dark:text-gray-400" />
              </InputGroupAddon>
              <InputGroupInput
                ref={searchRef}
                type="search"
                aria-label="Search"
                placeholder="Search or type command..."
                className="text-gray-800 placeholder:text-gray-400 dark:text-white/90 dark:placeholder:text-white/30"
              />
              <InputGroupAddon align="inline-end">
                <Badge
                  variant="light"
                  color="gray"
                  size="sm"
                  className="gap-0.5 rounded-lg border border-gray-200 bg-gray-50 px-1.75 py-[4.5px] text-xs tracking-[-0.2px] text-gray-500 shadow-none [text-shadow:none] dark:border-gray-800 dark:bg-white/3 dark:text-gray-400"
                >
                  <span>⌘</span>
                  <span>K</span>
                </Badge>
              </InputGroupAddon>
            </InputGroup>
          </form>
        </div>

        <div
          className={cn(
            'shadow-theme-md w-full items-center justify-between gap-4 px-5 py-4 xl:flex xl:justify-end xl:px-0 xl:shadow-none',
            isActionsOpen ? 'flex' : 'hidden',
          )}
        >
          <div className="2xsm:gap-3 flex items-center gap-2">
            <ThemeToggle />
          </div>
          <UserDropdown />
        </div>
      </div>
    </header>
  )
}
