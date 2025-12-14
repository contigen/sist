'use client'

import { Cpu, RefreshCw, Settings, Wrench } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { use, useActionState, useEffect, useState, useTransition } from 'react'
import { toast } from 'sonner'
import {
  type CreateAgentState,
  createAgentAction,
  generateAgentSystemInstruction,
} from '@/actions'
import {
  AVAILABLE_TOOLS,
  CAPABILITIES,
  CONSTRAINTS,
  MODEL_OPTIONS,
} from '@/app/constant'
import { Button, ButtonWithSpinner } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Spinner } from '@/components/ui/spinner'
import { Textarea } from '@/components/ui/textarea'
import { estimateTokenCount } from '@/lib/utils'

const initialState: CreateAgentState = {}

export default function PlaygroundPage({
  searchParams,
}: PageProps<'/playground'>) {
  const { msg } = use(searchParams)
  const [agentName, setAgentName] = useState('Customer Support Agent')
  const [purpose, setPurpose] = useState(
    'Handle customer inquiries and support requests'
  )
  const [instructions, setInstructions] =
    useState(`You are a friendly and helpful customer support agent.
    
    Your primary goals:
    - Assist users with product questions
    - Help track orders and shipments
    - Resolve technical issues
    - Escalate complex problems to human agents
    
    Always be polite, professional, and empathetic.`)

  const [selectedCapabilities, setSelectedCapabilities] = useState<string[]>([
    'chat',
  ])
  const [selectedConstraints, setSelectedConstraints] = useState<string[]>([
    'auto-escalate',
  ])

  const [model, setModel] = useState('gemini-2.5-flash')
  const [temperature, setTemperature] = useState([0.7])
  const [maxTokens, setMaxTokens] = useState([2048])
  const [topP, setTopP] = useState([0.9])
  const [selectedTools, setSelectedTools] = useState<string[]>([])

  const [pending, startTransition] = useTransition()

  const [state, formAction, isPending] = useActionState(
    createAgentAction,
    initialState
  )

  const router = useRouter()

  const tokenCount = estimateTokenCount(instructions)

  const selectedModelData = MODEL_OPTIONS.find(m => m.value === model)

  const isToolSupported = (toolId: string) => {
    if (!selectedModelData) return false
    if (selectedModelData.supportsAllTools) return true
    return !selectedModelData.unsupportedTools?.includes(toolId)
  }

  const handleModelChange = (newModel: string) => {
    setModel(newModel)
    const newModelData = MODEL_OPTIONS.find(m => m.value === newModel)
    if (newModelData && !newModelData.supportsAllTools) {
      setSelectedTools(prev =>
        prev.filter(toolId => !newModelData.unsupportedTools?.includes(toolId))
      )
    }
  }

  const toggleTool = (toolId: string) => {
    setSelectedTools(prev =>
      prev.includes(toolId)
        ? prev.filter(id => id !== toolId)
        : [...prev, toolId]
    )
  }

  function handleSystemInstructionGeneration() {
    startTransition(async () => {
      const instruction = await generateAgentSystemInstruction(
        `agent name: ${agentName}, purpose: ${purpose}, current system instructions: ${instructions}`
      )
      instruction && setInstructions(instruction)
    })
  }

  useEffect(() => {
    if (state.success) {
      toast.success(state.message || 'Agent created successfully!')
      if (state.agentId) {
        localStorage.setItem('agentId', state.agentId)
        router.push(`/deploy/${state.agentId}`)
      }
    } else if (state.error) {
      toast.warning(state.error)
    }
  }, [state, router])

  useEffect(() => {
    if (msg) {
      toast.warning('Agent does not exist')
    }
  }, [msg])

  return (
    <div className='flex flex-col min-h-screen'>
      <header className='border-b border-border/40 backdrop-blur-sm bg-background/80'>
        <div className='container flex items-center justify-between py-4'>
          <div className='flex items-center gap-4'>
            <Link href='/' className='flex items-center gap-2'>
              <span className='text-2xl font-bold text-gold'>sist</span>
            </Link>
            <span className='text-muted-foreground'>/</span>
            <span className='text-sm text-muted-foreground'>
              Agent Generation Workspace
            </span>
          </div>
        </div>
      </header>

      <main className='flex-1 py-8'>
        <div className='container'>
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
            <form
              action={(formData: FormData) => {
                formData.append('model', model)
                formData.append('temperature', temperature[0].toString())
                formData.append('maxTokens', maxTokens[0].toString())
                formData.append('topP', topP[0].toString())
                for (const tool of selectedTools) {
                  formData.append('tools', tool)
                }
                toast.info('Creating agent...')
                formAction(formData)
              }}
              id='create-agent-form'
              className='contents'
            >
              <fieldset
                disabled={isPending}
                className='lg:col-span-2 space-y-6'
              >
                <Card className='p-6 border-border'>
                  <h2 className='text-xl font-[540] mb-4 flex items-center gap-2'>
                    Basic Information
                  </h2>
                  <div className='space-y-4'>
                    <div>
                      <Label htmlFor='agent-name'>Agent Name</Label>
                      <Input
                        id='agent-name'
                        name='name'
                        value={agentName}
                        onChange={e => setAgentName(e.target.value)}
                        placeholder='e.g., Customer Support Agent'
                        className='mt-1.5'
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor='purpose'>Purpose / Role</Label>
                      <Input
                        id='purpose'
                        name='purpose'
                        value={purpose}
                        onChange={e => setPurpose(e.target.value)}
                        placeholder='What is this agent designed to do?'
                        className='mt-1.5'
                        required
                      />
                    </div>
                  </div>
                </Card>

                <Card className='p-6 border-border'>
                  <h2 className='text-xl font-[540] mb-4 flex items-center gap-2'>
                    <Cpu className='w-5 h-5 text-gold' />
                    Model Selection
                  </h2>
                  <div className='space-y-4'>
                    <div>
                      <Label htmlFor='model'>Language Model</Label>
                      <Select value={model} onValueChange={handleModelChange}>
                        <SelectTrigger id='model' className='mt-1.5'>
                          <SelectValue placeholder='Select a model' />
                        </SelectTrigger>
                        <SelectContent>
                          {MODEL_OPTIONS.map(option => (
                            <SelectItem
                              key={option.value}
                              value={option.value}
                              disabled={!option.enabled}
                              className={!option.enabled ? 'opacity-50' : ''}
                            >
                              {option.label}
                              {!option.enabled && ' (Limited Support)'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className='text-xs text-muted-foreground mt-1.5'>
                        {selectedModelData?.description}
                      </p>
                      {selectedModelData &&
                        !selectedModelData.supportsAllTools && (
                          <p className='text-xs text-yellow-500 mt-1'>
                            Some tools are not available with this model
                          </p>
                        )}
                    </div>
                  </div>
                </Card>

                <Card className='p-6 border-border'>
                  <h2 className='text-xl font-[540] mb-4 flex items-center gap-2'>
                    <Settings className='w-5 h-5 text-gold' />
                    Model Configuration
                  </h2>
                  <div className='space-y-6'>
                    <div>
                      <div className='flex items-center justify-between mb-2'>
                        <Label htmlFor='temperature'>Temperature</Label>
                        <span className='text-sm text-muted-foreground font-mono'>
                          {temperature[0]}
                        </span>
                      </div>
                      <Slider
                        id='temperature'
                        value={temperature}
                        onValueChange={setTemperature}
                        min={0}
                        max={2}
                        step={0.1}
                        className='mt-2'
                      />
                      <p className='text-xs text-muted-foreground mt-1.5'>
                        Controls randomness. Lower values make output more
                        focused and deterministic.
                      </p>
                    </div>

                    <div>
                      <div className='flex items-center justify-between mb-2'>
                        <Label htmlFor='max-tokens'>Max Tokens</Label>
                        <span className='text-sm text-muted-foreground font-mono'>
                          {maxTokens[0]}
                        </span>
                      </div>
                      <Slider
                        id='max-tokens'
                        value={maxTokens}
                        onValueChange={setMaxTokens}
                        min={256}
                        max={8192}
                        step={256}
                        className='mt-2'
                      />
                      <p className='text-xs text-muted-foreground mt-1.5'>
                        Maximum length of the model's response.
                      </p>
                    </div>

                    <div>
                      <div className='flex items-center justify-between mb-2'>
                        <Label htmlFor='top-p'>Top P</Label>
                        <span className='text-sm text-muted-foreground font-mono'>
                          {topP[0]}
                        </span>
                      </div>
                      <Slider
                        id='top-p'
                        value={topP}
                        onValueChange={setTopP}
                        min={0}
                        max={1}
                        step={0.05}
                        className='mt-2'
                      />
                      <p className='text-xs text-muted-foreground mt-1.5'>
                        Controls diversity via nucleus sampling. Lower values
                        make output more conservative.
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className='p-6 border-border'>
                  <h2 className='text-xl font-[540] mb-4 flex items-center gap-2'>
                    <Wrench className='w-5 h-5 text-gold' />
                    Tools Configuration
                  </h2>
                  <div className='space-y-3'>
                    {AVAILABLE_TOOLS.map(tool => {
                      const supported = isToolSupported(tool.id)
                      return (
                        <div
                          key={tool.id}
                          className={`p-4 rounded-lg border transition-colors ${
                            selectedTools.includes(tool.id)
                              ? 'border-gold bg-gold/5'
                              : 'border-border bg-secondary/50'
                          } ${!supported ? 'opacity-50' : ''}`}
                        >
                          <div className='flex items-start gap-3'>
                            <Checkbox
                              id={tool.id}
                              checked={selectedTools.includes(tool.id)}
                              onCheckedChange={() => toggleTool(tool.id)}
                              disabled={!supported}
                            />
                            <div className='flex-1'>
                              <Label
                                htmlFor={tool.id}
                                className={`font-medium ${
                                  supported
                                    ? 'cursor-pointer'
                                    : 'cursor-not-allowed'
                                }`}
                              >
                                {tool.label}
                                {!supported && (
                                  <span className='text-xs text-muted-foreground ml-2'>
                                    (Not available with{' '}
                                    {selectedModelData?.label})
                                  </span>
                                )}
                              </Label>
                              <p className='text-xs text-muted-foreground mt-1'>
                                {tool.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </Card>

                <Card className='p-6 border-border'>
                  <h2 className='text-xl font-[540] mb-4'>
                    Capabilities & Tools
                  </h2>
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    {CAPABILITIES.map(capability => {
                      const isChecked = selectedCapabilities.includes(
                        capability.id
                      )
                      return (
                        <div
                          key={capability.id}
                          className='flex items-center space-x-2 p-3 bg-secondary rounded-lg'
                        >
                          <Checkbox
                            id={capability.id}
                            name='capabilities'
                            value={capability.id}
                            checked={isChecked}
                            onCheckedChange={checked => {
                              setSelectedCapabilities(prev =>
                                checked
                                  ? [...prev, capability.id]
                                  : prev.filter(id => id !== capability.id)
                              )
                            }}
                          />
                          <Label
                            htmlFor={capability.id}
                            className='flex items-center gap-2 cursor-pointer'
                          >
                            {capability.label}
                          </Label>
                        </div>
                      )
                    })}
                  </div>
                </Card>

                <Card className='p-6 border-border'>
                  <div className='flex items-center justify-between mb-4'>
                    <h2 className='text-xl font-[540]'>System Instructions</h2>
                    <Button
                      variant='ghost'
                      size='sm'
                      type='button'
                      onClick={handleSystemInstructionGeneration}
                      disabled={pending}
                    >
                      <span className='inline-flex items-center justify-center p-2 rounded-lg border border-dashed border-muted-foreground/20 bg-muted/30 text-xs font-medium text-muted-foreground hover:border-primary/40 hover:text-gold transition-colors gap-2'>
                        {pending ? (
                          <Spinner />
                        ) : (
                          <RefreshCw className='size-4  text-gold' />
                        )}
                        AI Suggest
                      </span>
                    </Button>
                  </div>
                  <Textarea
                    name='instructions'
                    value={instructions}
                    onChange={evt => setInstructions(evt.target.value)}
                    placeholder='Enter detailed instructions for your agent...'
                    className='min-h-[300px] font-mono text-sm'
                    required
                  />
                  <div className='mt-2 flex items-center justify-between text-xs text-muted-foreground'>
                    <div className='flex items-center gap-4'>
                      <span>{instructions.length} characters</span>
                      <span className='text-gold/80'>~{tokenCount} tokens</span>
                    </div>
                    <span>
                      Use clear, specific instructions for best results
                    </span>
                  </div>
                </Card>

                <Card className='p-6 border-border'>
                  <h2 className='text-xl font-[540] mb-4'>
                    Constraints & Guardrails
                  </h2>
                  <div className='space-y-3'>
                    {CONSTRAINTS.map(constraint => {
                      const isChecked = selectedConstraints.includes(
                        constraint.id
                      )
                      return (
                        <div
                          key={constraint.id}
                          className='flex items-center space-x-2'
                        >
                          <Checkbox
                            id={constraint.id}
                            name='constraints'
                            value={constraint.id}
                            checked={isChecked}
                            onCheckedChange={checked => {
                              setSelectedConstraints(prev =>
                                checked
                                  ? [...prev, constraint.id]
                                  : prev.filter(id => id !== constraint.id)
                              )
                            }}
                          />
                          <Label
                            htmlFor={constraint.id}
                            className='cursor-pointer'
                          >
                            {constraint.label}
                          </Label>
                        </div>
                      )
                    })}
                  </div>
                </Card>
              </fieldset>
            </form>
            <div className='space-y-6'>
              <Card className='p-6 border-gold/30 bg-card sticky top-6'>
                <div className='flex items-center gap-2 mb-4'>
                  <h3 className='font-[540]'>Live Summary</h3>
                </div>

                <div className='space-y-4'>
                  <div>
                    <div className='text-xs text-muted-foreground mb-1'>
                      Agent Name
                    </div>
                    <div className='text-sm font-medium'>
                      {agentName || 'Untitled Agent'}
                    </div>
                  </div>

                  <div>
                    <div className='text-xs text-muted-foreground mb-1'>
                      Purpose
                    </div>
                    <div className='text-sm'>
                      {purpose || 'No purpose defined'}
                    </div>
                  </div>

                  <div>
                    <div className='text-xs text-muted-foreground mb-1'>
                      Model
                    </div>
                    <div className='text-sm font-mono'>{model}</div>
                  </div>

                  <div>
                    <div className='text-xs text-muted-foreground mb-1'>
                      Configuration
                    </div>
                    <div className='text-sm space-y-1'>
                      <div className='flex justify-between'>
                        <span>Temperature:</span>
                        <span className='font-mono'>{temperature[0]}</span>
                      </div>
                      <div className='flex justify-between'>
                        <span>Max Tokens:</span>
                        <span className='font-mono'>{maxTokens[0]}</span>
                      </div>
                      <div className='flex justify-between'>
                        <span>Top P:</span>
                        <span className='font-mono'>{topP[0]}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className='text-xs text-muted-foreground mb-1'>
                      Tools Enabled
                    </div>
                    <div className='text-sm'>
                      {selectedTools.length > 0 ? (
                        <div className='flex flex-wrap gap-1'>
                          {selectedTools.map(toolId => {
                            const tool = AVAILABLE_TOOLS.find(
                              t => t.id === toolId
                            )
                            return (
                              <span
                                key={toolId}
                                className='px-2 py-0.5 bg-gold/10 text-gold rounded text-xs'
                              >
                                {tool?.label}
                              </span>
                            )
                          })}
                        </div>
                      ) : (
                        <span className='text-muted-foreground'>
                          No tools selected
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className='text-xs text-muted-foreground mb-1'>
                      Status
                    </div>
                    <div className='flex items-center gap-2'>
                      <div
                        className={`w-2 h-2 rounded-full ${
                          isPending ? 'bg-blue-500' : 'bg-yellow-500'
                        }`}
                      ></div>
                      <span className='text-sm'>
                        {isPending ? 'Creating...' : 'Draft'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className='text-xs text-muted-foreground mb-1'>
                      Instructions Length
                    </div>
                    <div className='text-sm flex items-center gap-2'>
                      <span>{instructions.length} characters</span>
                      <span className='text-gold/80'>•</span>
                      <span className='text-gold/80'>~{tokenCount} tokens</span>
                    </div>
                  </div>

                  <div>
                    <div className='text-xs text-muted-foreground mb-1'>
                      Selected Capabilities
                    </div>
                    <div className='text-sm'>
                      {selectedCapabilities.length} selected
                    </div>
                  </div>
                  <div>
                    <div className='text-xs text-muted-foreground mb-1'>
                      Constraints
                    </div>
                    <div className='text-sm'>
                      {selectedConstraints.length} enabled
                    </div>
                  </div>
                  <div className='pt-4 border-t border-border'>
                    <ButtonWithSpinner
                      form='create-agent-form'
                      pending={isPending}
                      type='submit'
                      className='bg-gold text-gold-foreground hover:bg-gold/80 font-medium text-center w-full'
                    >
                      <Cpu className='size-4' />
                      Generate Agent
                    </ButtonWithSpinner>
                  </div>
                  <div className='pt-4 border-t border-border'>
                    <div className='text-xs text-muted-foreground mb-2'>
                      Estimated Costs
                    </div>
                    <div className='text-sm'>
                      <div className='flex justify-between mb-1'>
                        <span>Compute:</span>
                        <span className='font-mono'>~$0.02/req</span>
                      </div>
                      <div className='flex justify-between'>
                        <span>Model ({model}):</span>
                        <span className='font-mono'>
                          {model.includes('gpt-4') && '~$0.06/req'}
                          {model.includes('gpt-3.5') && '~$0.002/req'}
                          {model.includes('claude-3-opus') && '~$0.08/req'}
                          {model.includes('claude-3-sonnet') && '~$0.03/req'}
                          {model.includes('claude-3-haiku') && '~$0.005/req'}
                          {model.includes('gemini') && '~$0.04/req'}
                          {model.includes('llama') && '~$0.01/req'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
