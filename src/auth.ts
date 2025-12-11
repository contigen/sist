import NextAuth from 'next-auth'
import GitHub from 'next-auth/providers/github'
import { NextResponse } from 'next/server'
import { User } from 'next-auth'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { JWT } from 'next-auth/jwt'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub],
  callbacks: {
    async authorized({ request: req, auth }) {
      const PUBLIC_ROUTES = ['/', '/auth']
      const isLoggedIn = !!auth?.user
      const { pathname } = req.nextUrl
      const isAPublicRoute = PUBLIC_ROUTES.some(path => path === pathname)
      console.log(isLoggedIn, pathname, isAPublicRoute)
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
