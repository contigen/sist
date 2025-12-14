'use client'

import { Check, Copy, Download, Image as ImageIcon } from 'lucide-react'
import { useState } from 'react'
import { Button } from './ui/button'

type MessagePart =
  | { type: 'text'; text: string }
  | { type: 'image'; data: string; mimeType?: string }
  | { type: 'code'; code: string; language?: string; output?: string }
  | { type: 'tool-call'; toolName: string; args: Record<string, unknown> }
  | { type: 'tool-result'; toolName: string; result: string }

type MessageRendererProps = {
  content: string | MessagePart[]
  role: 'user' | 'assistant' | 'system'
}

export function MessageRenderer({ content, role }: MessageRendererProps) {
  if (typeof content === 'string') {
    return <TextMessage content={content} role={role} />
  }

  return (
    <div className='space-y-3'>
      {content.map((part, idx) => (
        <MessagePart key={idx} part={part} />
      ))}
    </div>
  )
}

function TextMessage({
  content,
  role,
}: {
  content: string
  role: 'user' | 'assistant' | 'system'
}) {
  return (
    <div
      className={`rounded-lg p-4 ${
        role === 'user'
          ? 'bg-primary/10 text-primary-foreground'
          : role === 'assistant'
          ? 'bg-secondary'
          : 'bg-muted'
      }`}
    >
      <div className='prose prose-sm dark:prose-invert max-w-none'>
        <p className='whitespace-pre-wrap'>{content}</p>
      </div>
    </div>
  )
}

function MessagePart({ part }: { part: MessagePart }) {
  switch (part.type) {
    case 'text':
      return <TextPartRenderer text={part.text} />
    case 'image':
      return <ImagePartRenderer data={part.data} mimeType={part.mimeType} />
    case 'code':
      return (
        <CodePartRenderer
          code={part.code}
          language={part.language}
          output={part.output}
        />
      )
    case 'tool-call':
      return <ToolCallRenderer toolName={part.toolName} args={part.args} />
    case 'tool-result':
      return (
        <ToolResultRenderer toolName={part.toolName} result={part.result} />
      )
    default:
      return null
  }
}

function TextPartRenderer({ text }: { text: string }) {
  return (
    <div className='rounded-lg p-4 bg-secondary'>
      <div className='prose prose-sm dark:prose-invert max-w-none'>
        <p className='whitespace-pre-wrap'>{text}</p>
      </div>
    </div>
  )
}

function ImagePartRenderer({ data }: { data: string; mimeType?: string }) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = data
    link.download = `image-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className='rounded-lg border border-border overflow-hidden bg-card'>
      <div className='p-3 border-b border-border flex items-center justify-between bg-muted/50'>
        <div className='flex items-center gap-2'>
          <ImageIcon className='w-4 h-4 text-primary' />
          <span className='text-sm font-medium'>Generated Image</span>
        </div>
        <Button
          variant='ghost'
          size='sm'
          onClick={handleDownload}
          className='h-8 w-8 p-0'
        >
          <Download className='w-4 h-4' />
        </Button>
      </div>
      <div className='p-4 bg-muted/20'>
        {error ? (
          <div className='text-sm text-muted-foreground'>
            Failed to load image
          </div>
        ) : (
          <img
            src={data}
            alt='Generated'
            className={`max-w-full h-auto rounded-lg ${
              isLoading ? 'opacity-0' : 'opacity-100'
            } transition-opacity`}
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false)
              setError(true)
            }}
          />
        )}
      </div>
    </div>
  )
}

function CodePartRenderer({
  code,
  language,
  output,
}: {
  code: string
  language?: string
  output?: string
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className='rounded-lg border border-border overflow-hidden bg-card'>
      <div className='p-3 border-b border-border flex items-center justify-between bg-muted/50'>
        <div className='flex items-center gap-2'>
          <span className='text-xs font-mono text-primary'>
            {language || 'code'}
          </span>
        </div>
        <Button
          variant='ghost'
          size='sm'
          onClick={handleCopy}
          className='h-8 w-8 p-0'
        >
          {copied ? (
            <Check className='w-4 h-4' />
          ) : (
            <Copy className='w-4 h-4' />
          )}
        </Button>
      </div>
      <div className='p-4 bg-muted/20'>
        <pre className='text-sm overflow-x-auto'>
          <code>{code}</code>
        </pre>
      </div>
      {output && (
        <>
          <div className='px-3 py-2 border-t border-border bg-muted/30'>
            <span className='text-xs font-medium text-muted-foreground'>
              Output:
            </span>
          </div>
          <div className='p-4 bg-muted/10'>
            <pre className='text-sm text-muted-foreground overflow-x-auto'>
              {output}
            </pre>
          </div>
        </>
      )}
    </div>
  )
}

function ToolCallRenderer({
  toolName,
  args,
}: {
  toolName: string
  args: Record<string, unknown>
}) {
  return (
    <div className='rounded-lg border border-dashed border-primary/30 p-3 bg-primary/5'>
      <div className='text-xs font-medium text-primary mb-2'>
        Tool Call: {toolName}
      </div>
      <div className='text-xs text-muted-foreground'>
        <pre className='overflow-x-auto'>{JSON.stringify(args, null, 2)}</pre>
      </div>
    </div>
  )
}

function ToolResultRenderer({
  toolName,
  result,
}: {
  toolName: string
  result: string
}) {
  let parsedResult: unknown
  try {
    parsedResult = JSON.parse(result)
  } catch {
    parsedResult = result
  }

  return (
    <div className='rounded-lg border border-dashed border-green-500/30 p-3 bg-green-500/5'>
      <div className='text-xs font-medium text-green-600 dark:text-green-400 mb-2'>
        Tool Result: {toolName}
      </div>
      <div className='text-xs text-muted-foreground'>
        {typeof parsedResult === 'object' ? (
          <pre className='overflow-x-auto whitespace-pre-wrap'>
            {JSON.stringify(parsedResult, null, 2)}
          </pre>
        ) : (
          <p className='whitespace-pre-wrap'>{String(parsedResult)}</p>
        )}
      </div>
    </div>
  )
}
