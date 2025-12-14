import 'server-only'
import type { Prisma } from '@/generated/prisma/client'
import { prisma } from './prisma'
import { withTryCatch } from './utils'

export async function createorGetUser(email: string, name: string) {
  return withTryCatch(async () => {
    return prisma.user.upsert({
      where: { email },
      update: {},
      create: { email, name },
    })
  })
}

export async function createAgent(data: Prisma.AgentUncheckedCreateInput) {
  return withTryCatch(async () => {
    return prisma.agent.create({
      data,
    })
  })
}

export async function findAgentById(id: string, userId: string) {
  return withTryCatch(async () => {
    return prisma.agent.findFirst({
      where: {
        id,
        userId,
      },
    })
  })
}

export async function getAgentsByUserId(userId: string) {
  return withTryCatch(async () => {
    return prisma.agent.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })
  })
}

export async function updateAgent(id: string, data: Prisma.AgentUpdateInput) {
  return withTryCatch(async () => {
    return prisma.agent.update({
      where: { id },
      data,
    })
  })
}

export async function incrementAgentRequestCount(id: string) {
  return withTryCatch(async () => {
    return prisma.agent.update({
      where: { id },
      data: {
        requestCount: {
          increment: 1,
        },
      },
    })
  })
}
