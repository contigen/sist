'use server'

import { google } from '@ai-sdk/google'
import { embed, embedMany, generateObject } from 'ai'
import { cacheTag, updateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import z, { ZodError } from 'zod'
import { AGENT_TAG, SYSTEM_INSTRUCTION } from './app/constant'
import { auth } from './auth'
import {
  createAgent,
  findAgentById,
  getAgentsByUserId,
  updateAgent,
} from './lib/db-queries'
import { agentSchema } from './lib/schema'

export async function getUserSession() {
  const session = await auth()
  if (!session) redirect('/')
  return session
}

export async function getUserId() {
  const session = await getUserSession()
  return session.user?.id
}

export async function generateAgentSystemInstruction(input: string) {
  await getUserSession()
  try {
    const {
      object: { instruction },
    } = await generateObject({
      model: google('gemini-2.5-flash-lite'),
      system: SYSTEM_INSTRUCTION,
      prompt: `Generate a system instruction for an agent. Agent details: ${input} `,
      schema: z.object({
        instruction: z.string(),
      }),
    })
    return instruction
  } catch {
    return ''
  }
}

export type CreateAgentState = {
  success?: boolean
  message?: string
  error?: string
  agentId?: string
}

export async function createAgentAction(
  _: CreateAgentState,
  formData: FormData
): Promise<CreateAgentState> {
  try {
    const userId = await getUserId()
    if (!userId) {
      return { error: 'Unauthorized. Please sign in.' }
    }
    const name = formData.get('name')
    const purpose = formData.get('purpose')
    const instructions = formData.get('instructions')
    const capabilities = formData.getAll('capabilities')
    const constraints = formData.getAll('constraints')
    const tools = formData.getAll('tools')
    const model = formData.get('model')
    const temperature = formData.get('temperature')
    const maxTokens = formData.get('maxTokens')
    const topP = formData.get('topP')

    const validation = agentSchema.parse({
      name,
      purpose,
      instructions,
      capabilities,
      constraints,
      tools,
      model,
      temperature: temperature ? parseFloat(temperature.toString()) : 0.7,
      maxTokens: maxTokens ? parseInt(maxTokens.toString(), 10) : 2048,
      topP: topP ? parseFloat(topP.toString()) : 0.9,
    })
    {
      const {
        name,
        purpose,
        instructions,
        capabilities,
        constraints,
        tools,
        model,
        temperature,
        maxTokens,
        topP,
      } = validation
      const agent = await createAgent({
        userId,
        name,
        purpose,
        instruction: instructions,
        capabilities,
        constraints,
        tools,
        model,
        temperature,
        maxTokens,
        topP,
      })
      if (!agent) {
        return { error: 'Failed to create agent. Please try again.' }
      }
      updateTag(AGENT_TAG)
      return {
        success: true,
        message: 'Agent created successfully!',
        agentId: agent.id,
      }
    }
  } catch (err) {
    if (err instanceof ZodError) {
      return { error: err.message }
    }
    console.error('Error creating agent:', err)
    return { error: 'An unexpected error occurred. Please try again.' }
  }
}

export type DeployAgentState = {
  success?: boolean
  message?: string
  error?: string
}

export async function deployAgent(agentId: string): Promise<DeployAgentState> {
  try {
    const userId = await getUserId()
    if (!userId) {
      return { error: 'Unauthorized. Please sign in.' }
    }

    const agent = await findAgentById(agentId, userId!)
    if (!agent) {
      return { error: 'Agent not found or access denied.' }
    }

    const updatedAgent = await updateAgent(agentId, {
      isDeployed: true,
      deployedAt: new Date(),
    })

    if (!updatedAgent) {
      return { error: 'Failed to deploy agent. Please try again.' }
    }

    updateTag(AGENT_TAG)

    return {
      success: true,
      message: 'Agent deployed successfully!',
    }
  } catch (err) {
    console.error('Error deploying agent:', err)
    return { error: 'An unexpected error occurred. Please try again.' }
  }
}

export async function undeployAgent(
  agentId: string
): Promise<DeployAgentState> {
  try {
    const userId = await getUserId()
    if (!userId) {
      return { error: 'Unauthorized. Please sign in.' }
    }
    const agent = await findAgentById(agentId, userId!)
    if (!agent) {
      return { error: 'Agent not found or access denied.' }
    }

    const updatedAgent = await updateAgent(agentId, {
      isDeployed: false,
      deployedAt: null,
    })

    if (!updatedAgent) {
      return { error: 'Failed to undeploy agent. Please try again.' }
    }

    updateTag(AGENT_TAG)

    return {
      success: true,
      message: 'Agent undeployed successfully!',
    }
  } catch (err) {
    console.error('Error undeploying agent:', err)
    return { error: 'An unexpected error occurred. Please try again.' }
  }
}

export async function getCachedAgentsByUserId(userId: string) {
  'use cache'
  cacheTag(AGENT_TAG)

  const cachedAgents = await getAgentsByUserId(userId)
  return cachedAgents
}

export async function generateUserInputEmbedding(input: string) {
  const model = google.textEmbedding('gemini-embedding-001')

  const { embedding } = await embed({
    model,
    value: input,
    providerOptions: {
      google: {
        outputDimensionality: 1024,
      },
    },
  })
  return embedding
}

export async function generateEmbeddings(queries: string[]) {
  const model = google.textEmbedding('gemini-embedding-001')

  const { embeddings } = await embedMany({
    model,
    values: queries,
    providerOptions: {
      google: {
        outputDimensionality: 1024,
        taskType: 'RETRIEVAL_QUERY',
      },
    },
  })

  return embeddings
}
