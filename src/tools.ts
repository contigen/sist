import { anthropic } from '@ai-sdk/anthropic'
import { google } from '@ai-sdk/google'
import { generateText, tool } from 'ai'
import { z } from 'zod'

export async function generateImage(prompt: string) {
  try {
    const { files } = await generateText({
      model: google('gemini-2.5-flash-image-preview'),
      providerOptions: {
        google: { responseModalities: ['TEXT', 'IMAGE'] },
      },
      prompt,
    })

    const image = files[0]
    const { mediaType, base64 } = image
    const imageURL = `data:${mediaType};base64,${base64}`
    return {
      success: true,
      imageURL,
    }
  } catch {
    return {
      success: false,
      imageURL: '',
    }
  }
}

export async function webSearch(query: string) {
  try {
    const result = await generateText({
      model: google('gemini-2.0-flash-exp'),
      tools: {
        google_search: google.tools.googleSearch({}),
      },
      prompt: `Search for: ${query}. Provide a summary of the top results.`,
    })

    return {
      success: true,
      results: result.text,
      sources: result.sources || [],
    }
  } catch {
    return {
      success: false,
      error: 'Search failed',
      results: '',
    }
  }
}

export async function executeCode(code: string, _language = 'python') {
  try {
    const result = await generateText({
      model: google('gemini-2.0-flash-exp'),
      tools: {
        code_execution: google.tools.codeExecution({}),
      },
      prompt: `Execute this ${_language} code and return the output:\n\n${code}`,
    })

    return {
      success: true,
      output: result.text,
      language: _language,
    }
  } catch {
    return {
      success: false,
      error: 'Code execution failed',
      output: '',
    }
  }
}

export async function retrieveKnowledge(_query: string) {
  try {
    return {
      results: [],
      message: 'Knowledge base retrieval ready for integration',
    }
  } catch {
    return {
      error: 'Retrieval service unavailable',
      results: [],
    }
  }
}

export const geminiNativeTools = {
  'google-search': google.tools.googleSearch({}),
  'code-execution': google.tools.codeExecution({}),
  'url-context': google.tools.urlContext({}),
} as const

export const claudeNativeTools = {
  'web-search-claude': anthropic.tools.webSearch_20250305({ maxUses: 5 }),
  'web-fetch': anthropic.tools.webFetch_20250910({ maxUses: 3 }),
  'code-execution-claude': anthropic.tools.codeExecution_20250825(),
} as const

export const universalTools = {
  'web-search': tool({
    description: 'Search the web for current information and facts',
    inputSchema: z.object({
      query: z.string().describe('The search query to look up'),
    }),
    execute: async ({ query }) => {
      const result = await webSearch(query)
      return JSON.stringify(result)
    },
  }),
  'code-interpreter': tool({
    description: 'Execute Python code for calculations and data analysis',
    inputSchema: z.object({
      code: z.string().describe('The Python code to execute'),
      language: z
        .string()
        .optional()
        .describe('Programming language (default: python)'),
    }),
    execute: async ({ code, language = 'python' }) => {
      const result = await executeCode(code, language)
      return JSON.stringify(result)
    },
  }),
  'image-generation': tool({
    description: 'Generate images from text descriptions using Gemini',
    inputSchema: z.object({
      prompt: z.string().describe('The prompt to generate an image from'),
    }),
    execute: async ({ prompt }) => {
      const result = await generateImage(prompt)
      return JSON.stringify(result)
    },
  }),
  retrieval: tool({
    description: 'Access and search knowledge base for relevant information',
    inputSchema: z.object({
      query: z.string().describe('The search query for the knowledge base'),
    }),
    execute: async ({ query }) => {
      const result = await retrieveKnowledge(query)
      return JSON.stringify(result)
    },
  }),
} as const

export function getToolsByProvider(
  provider: 'google' | 'anthropic',
  toolIds: string[]
) {
  const nativeTools: Record<string, unknown> = {}
  const functionTools: Record<string, unknown> = {}

  for (const toolId of toolIds) {
    if (provider === 'google') {
      if (toolId === 'web-search') {
        nativeTools.google_search = geminiNativeTools['google-search']
      } else if (toolId === 'code-interpreter') {
        nativeTools.code_execution = geminiNativeTools['code-execution']
      } else if (toolId === 'web-fetch') {
        nativeTools.url_context = geminiNativeTools['url-context']
      } else if (toolId in universalTools) {
        functionTools[toolId] =
          universalTools[toolId as keyof typeof universalTools]
      }
    } else if (provider === 'anthropic') {
      if (toolId === 'web-search') {
        nativeTools.web_search = claudeNativeTools['web-search-claude']
      } else if (toolId === 'code-interpreter') {
        nativeTools.code_execution = claudeNativeTools['code-execution-claude']
      } else if (toolId === 'web-fetch') {
        nativeTools.web_fetch = claudeNativeTools['web-fetch']
      } else if (toolId in universalTools) {
        functionTools[toolId] =
          universalTools[toolId as keyof typeof universalTools]
      }
    } else {
      if (toolId in universalTools) {
        functionTools[toolId] =
          universalTools[toolId as keyof typeof universalTools]
      }
    }
  }

  if (Object.keys(nativeTools).length > 0) {
    return nativeTools
  }

  return Object.keys(functionTools).length > 0 ? functionTools : undefined
}

export function getToolsByIds(toolIds: string[]) {
  const selectedTools: Record<
    string,
    (typeof universalTools)[keyof typeof universalTools]
  > = {}

  for (const toolId of toolIds) {
    if (toolId in universalTools) {
      selectedTools[toolId] =
        universalTools[toolId as keyof typeof universalTools]
    }
  }

  return Object.keys(selectedTools).length > 0 ? selectedTools : undefined
}

export const availableToolIds = [
  'web-search',
  'code-interpreter',
  'image-generation',
  'retrieval',
  'web-fetch',
] as const

export type ToolId = (typeof availableToolIds)[number]
