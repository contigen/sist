'use client'

import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { Bot, RotateCcw, Send, Wrench } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { FileUpload } from '@/components/file-upload'
import { PageHeader } from '@/components/page-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ButtonGold } from '@/components/ui/button-gold'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { Agent, LogEntry } from '@/lib/types'

type PreviewViewProps = {
  agent: Agent | null
}

export function PreviewView({ agent }: PreviewViewProps) {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [input, setInput] = useState('')
  const [lastMessageCount, setLastMessageCount] = React.useState(0)

  const addLog = React.useCallback(
    (message: string, type: LogEntry['type']) => {
      const timestamp = new Date().toLocaleTimeString('en-US', {
        hour12: false,
      })
      setLogs(prev => [{ timestamp, message, type }, ...prev])
    },
    []
  )

  const { messages, sendMessage, status, setMessages } = useChat({
    transport: new DefaultChatTransport({
      api: agent ? `/api/agents/${agent.id}/chat` : '',
    }),
    onFinish: ({ finishReason }) => {
      addLog(`Response completed`, 'green')
      if (finishReason) {
        addLog(`  Finish reason: ${finishReason}`, 'blue')
      }
    },
    onError: (err: Error) => {
      addLog(`Error: ${err.message}`, 'red')
    },
    onToolCall: ({ toolCall }) => {
      addLog(`Tool Call: ${toolCall.toolName}`, 'yellow')
      if ('args' in toolCall && toolCall.args) {
        const argsStr = JSON.stringify(toolCall.args)
        addLog(
          `  Input: ${
            argsStr.length > 150 ? `${argsStr.substring(0, 150)}...` : argsStr
          }`,
          'yellow'
        )
      }
      if ('toolCallId' in toolCall) {
        addLog(`  Call ID: ${toolCall.toolCallId}`, 'yellow')
      }
    },
  })

  const isLoading = status === 'streaming' || status === 'submitted'

  const handleReset = () => {
    setMessages([])
    setLogs([])
    setLastMessageCount(0)
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input?.trim() && !selectedFile) return

    const messageText = input || 'Analyze this file'

    addLog(
      `Sending: "${messageText.substring(0, 50)}${
        messageText.length > 50 ? '...' : ''
      }"`,
      'blue'
    )

    if (selectedFile) {
      addLog(
        `Attached: ${selectedFile.name} (${(selectedFile.size / 1024).toFixed(
          2
        )} KB)`,
        'blue'
      )
    }

    sendMessage({
      role: 'user',
      parts: [{ type: 'text', text: messageText }],
    })

    setInput('')
    setSelectedFile(null)
  }

  useEffect(() => {
    if (!messages || messages.length === 0) return

    if (messages.length > lastMessageCount) {
      const newMessages = messages.slice(lastMessageCount)

      for (const msg of newMessages) {
        if (msg.role === 'assistant' && msg.parts) {
          const textParts = msg.parts.filter(p => p.type === 'text')
          const toolParts = msg.parts.filter(p => p.type.startsWith('tool-'))

          if (textParts.length > 0) {
            for (const part of textParts) {
              if ('text' in part && part.text) {
                const preview = part.text.substring(0, 100)
                addLog(
                  `Text: ${preview}${part.text.length > 100 ? '...' : ''}`,
                  'green'
                )
              }
            }
          }

          if (toolParts.length > 0) {
            for (const part of toolParts) {
              const toolName = part.type.replace('tool-', '')
              const state = 'state' in part ? String(part.state) : 'unknown'

              if (state === 'input-streaming') {
                addLog(`${toolName}: preparing...`, 'yellow')
              } else if (state === 'input-available') {
                addLog(`${toolName}: executing...`, 'yellow')
                if ('input' in part && part.input) {
                  const inputStr = JSON.stringify(part.input)
                  addLog(
                    `  Input: ${
                      inputStr.length > 100
                        ? `${inputStr.substring(0, 100)}...`
                        : inputStr
                    }`,
                    'yellow'
                  )
                }
              } else if (state === 'output-available') {
                addLog(`${toolName}: completed`, 'green')
                if ('output' in part && part.output) {
                  const outputStr =
                    typeof part.output === 'string'
                      ? part.output
                      : JSON.stringify(part.output)
                  addLog(
                    `  Output: ${
                      outputStr.length > 100
                        ? `${outputStr.substring(0, 100)}...`
                        : outputStr
                    }`,
                    'green'
                  )
                }
              } else if (state === 'output-error') {
                addLog(`${toolName}: error`, 'red')
                if ('errorText' in part) {
                  addLog(`  Error: ${part.errorText}`, 'red')
                }
              }
            }
          }

          if (msg.metadata && typeof msg.metadata === 'object') {
            // biome-ignore lint/suspicious/noExplicitAny: Metadata structure varies by provider
            const metadata: any = msg.metadata
            if (metadata?.usage) {
              const usage = metadata.usage
              addLog(
                `Tokens: ${usage?.totalTokens || usage?.total || '?'}`,
                'blue'
              )
            }
          }
        }
      }

      setLastMessageCount(messages.length)
    }
  }, [messages, lastMessageCount, addLog])

  useEffect(() => {
    if (status === 'streaming') {
      addLog(`Streaming response...`, 'blue')
    } else if (status === 'submitted') {
      addLog(`Request submitted`, 'blue')
    }
  }, [status, addLog])

  if (!agent) {
    return (
      <div className='flex flex-col min-h-screen'>
        <PageHeader breadcrumb='Preview Sandbox' />
        <main className='flex-1 flex items-center justify-center'>
          <Card className='p-8 border-border text-center max-w-md'>
            <h2 className='text-xl font-semibold mb-2'>No Agent Selected</h2>
            <p className='text-muted-foreground mb-4'>
              Please select an agent from the library to preview
            </p>
            <Link href='/library'>
              <ButtonGold>Go to Library</ButtonGold>
            </Link>
          </Card>
        </main>
      </div>
    )
  }

  if (!agent.isDeployed) {
    return (
      <div className='flex flex-col min-h-screen'>
        <PageHeader breadcrumb='Preview Sandbox' />
        <main className='flex-1 flex items-center justify-center'>
          <Card className='p-8 border-border text-center max-w-md'>
            <h2 className='text-xl font-semibold mb-2'>Agent Not Deployed</h2>
            <p className='text-muted-foreground mb-4'>
              This agent needs to be deployed before you can test it
            </p>
            <Link href={`/deploy/${agent.id}`}>
              <ButtonGold>Deploy Agent</ButtonGold>
            </Link>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className='flex flex-col min-h-screen'>
      <PageHeader breadcrumb='Preview Sandbox'>
        <Badge className='bg-muted'>{agent.name}</Badge>
        <Button variant='ghost' size='sm' onClick={handleReset}>
          <RotateCcw className='w-4 h-4 mr-2' />
          Reset
        </Button>
      </PageHeader>

      <main className='flex-1 py-6'>
        <div className='container py-6'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 items-start'>
            <div className='flex flex-col'>
              <Card className='flex flex-col border-border overflow-hidden h-[calc(100vh-12rem)]'>
                <div className='p-4 border-b border-border'>
                  <h2 className='font-semibold flex items-center gap-2 text-lg'>
                    <Bot className='w-5 h-5 text-gold' />
                    Chat Interface
                  </h2>
                  <p className='text-xs text-muted-foreground mt-1'>
                    Test your agent with real conversations
                  </p>
                </div>

                <div className='flex-1 overflow-y-auto p-4 space-y-4'>
                  {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-muted-foreground text-sm [font-feature-settings:'ss01']">
                      Start a conversation with your agent
                    </div>
                  ) : (
                    messages.map(msg => {
                      const textContent = msg.parts
                        .filter(
                          (p): p is typeof p & { text: string } =>
                            p.type === 'text' && 'text' in p
                        )
                        .map(p => p.text)
                        .join('')

                      const toolParts = msg.parts.filter(p =>
                        p.type.startsWith('tool-')
                      )

                      return (
                        <div
                          key={msg.id}
                          className={`flex gap-3 ${
                            msg.role === 'user' ? 'justify-end' : ''
                          }`}
                        >
                          {msg.role === 'assistant' && (
                            <div className='w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-secondary'>
                              <Bot className='size-4' />
                            </div>
                          )}
                          <div
                            className={`max-w-[80%] space-y-2 ${
                              msg.role === 'user' ? 'text-right' : ''
                            }`}
                          >
                            {textContent && (
                              <div
                                className={`inline-block p-3 rounded-lg text-left ${
                                  msg.role === 'user'
                                    ? 'bg-yellow-500/10 border border-yellow-500/20'
                                    : 'bg-secondary'
                                }`}
                              >
                                <ReactMarkdown>{textContent}</ReactMarkdown>
                              </div>
                            )}

                            {toolParts.map((part, partIndex) => {
                              const partKey = `${msg.id}-tool-${partIndex}`
                              const toolName = part.type.replace('tool-', '')
                              const state =
                                'state' in part ? part.state : 'unknown'
                              const toolInput =
                                'input' in part
                                  ? JSON.stringify(part.input, null, 2)
                                  : null
                              const toolOutput =
                                'output' in part
                                  ? typeof part.output === 'string'
                                    ? part.output
                                    : JSON.stringify(part.output, null, 2)
                                  : null

                              return (
                                <div
                                  key={partKey}
                                  className='p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-sm text-left'
                                >
                                  <div className='flex items-center gap-2 text-yellow-500 font-medium mb-2'>
                                    <Wrench className='w-4 h-4' />
                                    <span>{toolName}</span>
                                    <Badge
                                      variant='outline'
                                      className='text-xs ml-auto'
                                    >
                                      {state}
                                    </Badge>
                                  </div>
                                  {toolInput && (
                                    <div className='mt-2'>
                                      <div className='text-xs text-muted-foreground mb-1'>
                                        Input:
                                      </div>
                                      <pre className='text-xs bg-secondary p-2 rounded overflow-x-auto max-h-24'>
                                        {toolInput}
                                      </pre>
                                    </div>
                                  )}
                                  {toolOutput && (
                                    <div className='mt-2'>
                                      <div className='text-xs text-muted-foreground mb-1'>
                                        Output:
                                      </div>
                                      <pre className='text-xs bg-secondary p-2 rounded overflow-x-auto max-h-32'>
                                        {toolOutput.length > 500
                                          ? `${toolOutput.substring(0, 500)}...`
                                          : toolOutput}
                                      </pre>
                                    </div>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )
                    })
                  )}
                  {isLoading && (
                    <div className='flex gap-3'>
                      <div className='w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-secondary'>
                        <Bot className='size-4' />
                      </div>
                      <div className='flex-1'>
                        <div className='inline-block p-3 rounded-lg bg-secondary'>
                          <Spinner />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className='p-4 border-t border-border'>
                  <form onSubmit={onSubmit} className='space-y-2'>
                    <div className='flex gap-2'>
                      <FileUpload
                        onFileSelect={setSelectedFile}
                        selectedFile={selectedFile}
                        onClearFile={() => setSelectedFile(null)}
                        disabled={isLoading}
                      />
                      <Input
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault()
                            // biome-ignore lint/suspicious/noExplicitAny: Form event compatibility
                            onSubmit(e as any)
                          }
                        }}
                        placeholder={
                          selectedFile
                            ? 'Add a message (optional)...'
                            : 'Type your message...'
                        }
                        className='flex-1'
                        disabled={isLoading}
                        autoFocus
                      />
                      <ButtonGold
                        type='submit'
                        disabled={
                          isLoading || (!input?.trim() && !selectedFile)
                        }
                      >
                        <Send className='w-4 h-4' />
                      </ButtonGold>
                    </div>
                    {selectedFile && (
                      <p className='text-xs text-muted-foreground px-1'>
                        Tip: Both Gemini and Claude can analyse images, PDFs,
                        and documents
                      </p>
                    )}
                  </form>
                </div>
              </Card>
            </div>
            <div className='flex flex-col'>
              <Tabs defaultValue='logs' className='flex flex-col'>
                <Card className='flex flex-col border-border overflow-hidden h-[calc(100vh-12rem)]'>
                  <div className='p-4 border-b border-border'>
                    <TabsList>
                      <TabsTrigger value='logs'>Logs</TabsTrigger>
                      <TabsTrigger value='config'>Configuration</TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent
                    value='logs'
                    className='flex-1 overflow-y-auto p-4 m-0'
                  >
                    <div className='space-y-2 font-mono text-xs'>
                      {logs.length === 0 ? (
                        <div className='text-muted-foreground text-center py-8'>
                          No logs yet. Start chatting to see activity.
                        </div>
                      ) : (
                        logs.map(log => (
                          <div
                            key={`${log.timestamp}-${log.message}`}
                            className='flex items-start gap-2'
                          >
                            <span className='text-muted-foreground'>
                              [{log.timestamp}]
                            </span>
                            <span
                              className={
                                log.type === 'green'
                                  ? 'text-green-500'
                                  : log.type === 'blue'
                                  ? 'text-blue-500'
                                  : log.type === 'red'
                                  ? 'text-red-500'
                                  : 'text-yellow-500'
                              }
                            >
                              {log.message}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent
                    value='config'
                    className='flex-1 overflow-y-auto p-4 m-0'
                  >
                    <div className='space-y-4 text-sm'>
                      <div>
                        <div className='text-xs text-muted-foreground mb-2'>
                          Agent Name
                        </div>
                        <div className='p-2 bg-secondary rounded'>
                          {agent.name}
                        </div>
                      </div>
                      <div>
                        <div className='text-xs text-muted-foreground mb-2'>
                          Purpose
                        </div>
                        <div className='p-2 bg-secondary rounded'>
                          {agent.purpose}
                        </div>
                      </div>
                      <div>
                        <div className='text-xs text-muted-foreground mb-2'>
                          Capabilities
                        </div>
                        <div className='flex flex-wrap gap-2'>
                          {agent.capabilities.map(cap => (
                            <Badge
                              key={cap}
                              variant='outline'
                              className='bg-secondary'
                            >
                              {cap}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className='text-xs text-muted-foreground mb-2'>
                          Constraints
                        </div>
                        <div className='flex flex-wrap gap-2'>
                          {agent.constraints.map(constraint => (
                            <Badge
                              key={constraint}
                              variant='outline'
                              className='bg-secondary'
                            >
                              {constraint}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Card>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
