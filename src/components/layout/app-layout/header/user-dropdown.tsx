import { useState } from 'react'
import { useLocation } from 'wouter'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown'
import { useAuth } from '@/hooks/use-auth'
import { ChevronDownIcon, LogOutIcon } from '@/icons'
import { cn } from '@/lib/utils'

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

export function UserDropdown() {
  const [, navigate] = useLocation()
  const { user, signOut, isSigningOut } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  if (!user) return null

  async function handleSignOut() {
    await signOut()
    navigate('/login', { replace: true })
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger className="flex items-center gap-3 text-gray-700 dark:text-gray-400">
        <Avatar size="lg" className="rounded-lg">
          <AvatarFallback className="bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400 rounded-lg font-medium">
            {getInitials(user.name)}
          </AvatarFallback>
        </Avatar>
        <span className="hidden text-sm font-medium sm:block">{user.name.split(' ')[0]}</span>
        <ChevronDownIcon
          className={cn(
            'size-5 text-gray-500 duration-200 dark:text-gray-400',
            isOpen && 'rotate-180',
          )}
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={12} className="w-65 p-3">
        <div className="px-3 py-2">
          <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {user.name}
          </span>
          <span className="mt-0.5 block text-xs text-gray-500 dark:text-gray-400">
            {user.email}
          </span>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem variant="destructive" disabled={isSigningOut} onClick={handleSignOut}>
          <LogOutIcon />
          {isSigningOut ? 'Signing out…' : 'Sign out'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
