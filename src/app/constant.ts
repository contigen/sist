export const SYSTEM_INSTRUCTION = `
<system-instruction>
You are the core orchestration model for the Agent Deployment Playground.
Your responsibility is to turn user intent into fully structured, deployable AI agents; assist with configuration, versioning, testing, and runtime behaviour; and provide deterministic, auditable outputs.
Maintain consistency, correctness, and operational clarity at all times.
Your duties:

Agent Synthesis
Translate short user inputs into complete agent definitions: name, purpose, capabilities, constraints, toolsets, environmental assumptions, memory strategy, safety boundaries, input/output schema, and behaviour loop.
Ensure every agent you generate is well-structured, deterministic, and can execute consistently on browser, edge, or cloud runtimes.
Improve underspecified inputs with reasonable defaults while preserving user intent.

Operational Precision
Produce stable instructions free from hallucinations, vague behaviours, over-assertive claims, or conflicts.
Prefer explicit procedures and ordered steps.
Avoid extraneous explanation. Everything must be concise, executable, and source-controlled.

Preview & Simulation Support
Respond in a way that allows the preview sandbox to display internal reasoning traces abstractly without revealing unsafe hidden chain-of-thought.
Provide high-level explanation of decisions while keeping internal reasoning private and secure.

Safety & Guardrails
Enforce safe behaviour at all times.
Reject harmful or insecure agent configurations with actionable guidance.
Use precise, compact language appropriate for engineers.
Honour user terminology, user intent, and the technical context of the platform.

Your overarching purpose is to ensure that any agent created, modified, deployed, or previewed within the Playground is reliable, safe, versioned, deterministic, auditable, and production-ready.
</system-instruction>
`

import type { ModelOption, ToolOption } from '@/lib/types'

export const CAPABILITIES = [
  { id: 'database', label: 'Database Access' },
  { id: 'api', label: 'API Integration' },
  { id: 'email', label: 'Email Sending' },
  { id: 'documents', label: 'Document Generation' },
  { id: 'calculations', label: 'Calculations' },
  { id: 'chat', label: 'Chat Interface' },
]

export const CONSTRAINTS = [
  { id: 'no-pii', label: 'Do not process or store PII' },
  { id: 'timeout', label: 'Timeout after 30 seconds' },
  { id: 'cost-limit', label: 'Limit token usage for cost control' },
  { id: 'auto-escalate', label: 'Auto-escalate complex requests to human' },
]

export const AVAILABLE_TOOLS: ToolOption[] = [
  {
    id: 'web-search',
    label: 'Web Search',
    description: 'Search the web for current information (uses native tools)',
  },
  {
    id: 'code-interpreter',
    label: 'Code Interpreter',
    description: 'Execute Python code for calculations (uses native tools)',
  },
  {
    id: 'image-generation',
    label: 'Image Generation',
    description: 'Generate images from text descriptions (Gemini)',
  },
  {
    id: 'retrieval',
    label: 'Retrieval',
    description: 'Access and search knowledge base',
  },
  {
    id: 'web-fetch',
    label: 'Web Fetch',
    description: 'Fetch content from specific URLs (uses native tools)',
  },
]

export const MODEL_OPTIONS: ModelOption[] = [
  {
    value: 'gemini-3-pro-preview',
    label: 'Gemini 3 Pro',
    description: "Google's advanced multimodal model",
    enabled: true,
    supportsAllTools: true,
  },
  {
    value: 'gemini-2.5-pro',
    label: 'Gemini 2.5 Pro',
    description: "Google's advanced multimodal model",
    enabled: true,
    supportsAllTools: true,
  },
  {
    value: 'gemini-2.5-flash',
    label: 'Gemini 2.5 Flash',
    description: 'Fast and efficient multimodal model',
    enabled: true,
    supportsAllTools: true,
  },
  {
    value: 'claude-opus-4-20250514',
    label: 'Claude Opus 4.5',
    description: "Anthropic's most capable model",
    enabled: true,
    supportsAllTools: true,
  },
  {
    value: 'claude-sonnet-4-20250514',
    label: 'Claude Sonnet 4.5',
    description: 'Balanced performance with advanced reasoning',
    enabled: true,
    supportsAllTools: true,
  },
  {
    value: 'claude-3-7-sonnet-20250219',
    label: 'Claude 3.7 Sonnet',
    description: 'Enhanced reasoning and tool use',
    enabled: true,
    supportsAllTools: true,
  },
  {
    value: 'claude-3-5-sonnet-20241022',
    label: 'Claude 3.5 Sonnet',
    description: 'Excellent balance of intelligence and speed',
    enabled: true,
    supportsAllTools: false,
    unsupportedTools: ['image-generation'],
  },
  {
    value: 'gpt-4-turbo',
    label: 'GPT-4 Turbo',
    description: 'Limited tool support',
    enabled: false,
    supportsAllTools: false,
  },
  {
    value: 'gpt-4',
    label: 'GPT-4',
    description: 'Limited tool support',
    enabled: false,
    supportsAllTools: false,
  },
  {
    value: 'gpt-3.5-turbo',
    label: 'GPT-3.5 Turbo',
    description: 'Limited tool support',
    enabled: false,
    supportsAllTools: false,
  },
  {
    value: 'llama-3-70b',
    label: 'Llama 3 70B',
    description: 'Limited tool support',
    enabled: false,
    supportsAllTools: false,
  },
]

export const AGENT_TAG = `agents`
