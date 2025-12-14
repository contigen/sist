import { NextResponse } from 'next/server'
import NextAuth, { type User } from 'next-auth'
import GitHub from 'next-auth/providers/github'
import { createorGetUser } from './lib/db-queries'

declare module 'next-auth' {
  interface User {
    username?: string
  }

  interface Session {
    user: User
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends User {
    username?: string
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub],
  callbacks: {
    async authorized({ request: req, auth }) {
      const PUBLIC_ROUTES = ['/', '/auth']
      const isLoggedIn = !!auth?.user
      const { pathname } = req.nextUrl
      const isAPublicRoute = PUBLIC_ROUTES.some(path => path === pathname)
      if (isLoggedIn && isAPublicRoute) {
        const searchParams = req.nextUrl.searchParams
        const callbackURL = searchParams.get('callbackUrl')
        if (callbackURL) {
          return NextResponse.redirect(new URL(callbackURL, req.url))
        }
        return NextResponse.redirect(new URL(`/playground`, req.url))
      }
      return isLoggedIn || isAPublicRoute
    },
    async signIn({ user, profile, account }) {
      if (account?.provider === 'github' && profile) {
        const { email, name, login } = profile
        if (!email || !name) return false
        const dbUser = await createorGetUser(email, name)
        if (!dbUser) return false
        const { id } = dbUser
        user.id = id
        user.username = login as string
        return true
      } else return false
    },
    async jwt({ token, user }) {
      if (user) {
        token = { ...token, ...user }
      }
      return token
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          ...token,
        },
      }
    },
  },
  pages: {
    signIn: `/auth`,
    newUser: `/playground`,
    signOut: `/`,
    error: `/auth`,
  },
})
