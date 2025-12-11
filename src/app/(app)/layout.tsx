import { auth } from '@/auth'
import { Nav } from './nav'
import { SessionProvider } from 'next-auth/react'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  return (
    <SessionProvider session={session}>
      <Nav />
      {children}
    </SessionProvider>
  )
}
