'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { UserProfile } from './user-profile'

const navItems = ['Playground', 'Deploy', 'Preview', 'Library', 'Settings']

export function Nav() {
  const pathname = usePathname()

  return (
    <header className='border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='container flex h-16 items-center'>
        <Link href='/' className='mr-8 flex items-center space-x-2'>
          <div className='flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-gold-400 to-gold-600'>
            <span className='text-lg font-bold text-background'>S</span>
          </div>
          <span className='text-xl font-bold'>Sist</span>
        </Link>

        <nav className='flex items-center space-x-1'>
          {navItems.map(item => {
            const href = `/${item.toLowerCase()}`
            const isActive = pathname === href

            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                  isActive
                    ? 'bg-accent text-foreground'
                    : 'text-muted-foreground'
                )}
              >
                {item}
              </Link>
            )
          })}
        </nav>
        <div className='ml-auto'>
          <UserProfile />
        </div>
      </div>
    </header>
  )
}
