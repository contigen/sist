'use client'

import Link from 'next/link'
import { ButtonGold } from '@/components/ui/button-gold'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { signOut, useSession } from 'next-auth/react'

export function UserProfile() {
  const { data: session } = useSession()
  const user = session?.user
  const username = user?.username
  const email = user?.email
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className='flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-accent '>
          <div className='hidden text-left md:block'>
            <p className='text-sm text-muted-foreground font-semibold'>
              {username || email?.split('@')[0] || 'Profile'}
            </p>
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className='max-w-md p-0 w-80'
        withOverlay
        align='end'
      >
        <div className='p-6 text-center space-y-4'>
          <div className='space-y-1'>
            <p className='text-sm text-muted-foreground font-medium'>
              {username}
            </p>
            <p className='text-xs text-muted-foreground font-semibold'>
              {email?.slice(0, 6)}...@{email?.split('@')[1]}
            </p>
          </div>
        </div>
        <div className='px-6 pb-6 space-y-3'>
          <Link href='/settings'>
            <span className='flex items-center justify-center p-2 rounded-lg border border-dashed border-muted-foreground/20 bg-muted/30 text-xs font-medium text-muted-foreground hover:border-gold/40 transition-colors'>
              Account Settings
            </span>
          </Link>
          <ButtonGold className='w-full' onClick={() => signOut()}>
            <span>Sign Out</span>
          </ButtonGold>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
