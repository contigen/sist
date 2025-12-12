import 'server-only'
import { withTryCatch } from './utils'
import { prisma } from './prisma'

export async function createorGetUser(email: string, name: string) {
  return withTryCatch(async () => {
    return prisma.user.upsert({
      where: { email },
      update: {},
      create: { email, name },
    })
  })
}

export function createAgent() {
  return withTryCatch(async () => {})
}
