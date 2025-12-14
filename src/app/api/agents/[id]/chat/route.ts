import { anthropic } from '@ai-sdk/anthropic'
import { google } from '@ai-sdk/google'
import { convertToModelMessages, streamText } from 'ai'
import type { NextRequest } from 'next/server'
import { getUserId } from '@/actions'
import { findAgentById, incrementAgentRequestCount } from '@/lib/db-queries'
import { getToolsByProvider } from '@/tools'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const userId = await getUserId()
    const agent = await findAgentById(id, userId!)

    if (!agent) {
      return new Response(JSON.stringify({ error: 'Agent not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    if (!agent.isDeployed) {
      return new Response(JSON.stringify({ error: 'Agent is not deployed' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const body = await request.json()
    const { messages } = body

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'Invalid request: messages array required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    incrementAgentRequestCount(id).catch(err => {
      console.error('Failed to increment request count:', err)
    })

    const modelName = agent.model || 'gemini-2.0-flash-exp'
    const temperature = agent.temperature ?? 0.7
    const topP = agent.topP ?? 0.9

    const provider = modelName.startsWith('claude') ? 'anthropic' : 'google'
    let model: ReturnType<typeof google> | ReturnType<typeof anthropic>

    if (provider === 'anthropic') {
      model = anthropic(modelName)
    } else {
      model = google(modelName)
    }

    const selectedTools =
      agent.tools && agent.tools.length > 0
        ? getToolsByProvider(provider, agent.tools)
        : undefined

    const systemInstruction = `
    <agent-instructions>
    ${agent.instruction}

Agent Configuration:
- Name: ${agent.name}
- Purpose: ${agent.purpose}
- Capabilities: ${agent.capabilities.join(', ')}
- Constraints: ${agent.constraints.join(', ')}
${
  agent.tools && agent.tools.length > 0
    ? `- Available Tools: ${agent.tools.join(', ')}`
    : ''
}

Follow the constraints strictly and use only the specified capabilities and tools.
</agent-instructions>`

    const modelMessages = convertToModelMessages(messages)

    const result = streamText({
      model,
      system: systemInstruction,
      messages: modelMessages,
      temperature,
      topP,
      tools: selectedTools as any,
    })

    return result.toUIMessageStreamResponse()
  } catch (error) {
    console.error('Error in agent chat:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
