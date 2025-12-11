import Link from 'next/link'
import { ButtonGold } from '@/components/ui/button-gold'
import { Button } from '@/components/ui/button'
import { ArrowRight, Rocket, Cpu } from 'lucide-react'
import { Card } from '@/components/ui/card'

export default function Home() {
  return (
    <div className='flex flex-col min-h-screen'>
      <header className='border-b border-border/40 backdrop-blur-sm fixed top-0 left-0 right-0 z-50 bg-background/80'>
        <div className='container flex items-center justify-between py-4'>
          <span className='text-2xl font-bold text-gold'>sist</span>
          <nav className='hidden md:flex items-center gap-8'>
            <Link
              href='/library'
              className='text-sm hover:text-gold transition-colors'
            >
              Library
            </Link>
            <Link href='/playground'>
              <ButtonGold>Open Playground</ButtonGold>
            </Link>
          </nav>
        </div>
      </header>
      <main className='flex-1 pt-20'>
        <section className='relative overflow-hidden py-20 md:py-32'>
          <div className='absolute inset-0 z-0'>
            <div className='absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(234,179,8,0.15),transparent_50%)]'></div>
            <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[radial-gradient(circle,rgba(30,41,59,0.4),transparent_50%)]'></div>
            <div className='absolute inset-0 bg-[linear-gradient(rgba(234,179,8,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(234,179,8,0.05)_1px,transparent_1px)] bg-[size:40px_40px]'></div>
          </div>

          <div className='container relative z-10'>
            <div className='max-w-3xl mx-auto text-center'>
              <div className='inline-block mb-4 px-4 py-1 rounded-full bg-gold/10 border border-gold/20'>
                <span className='text-sm font-medium text-gold'>
                  Agent Deployment Playground
                </span>
              </div>

              <h1 className='text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight tracking-tighter'>
                Generate. Deploy. <br />
                <span className='text-gold'>Preview AI Agents.</span>
              </h1>

              <p className='text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto'>
                Create AI agents instantly, deploy to multiple runtimes, and
                preview their live behavior—all in one powerful playground.
              </p>

              <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                <Link href='/playground'>
                  <ButtonGold size='lg' className='w-full sm:w-auto text-base'>
                    Create New Agent
                  </ButtonGold>
                </Link>
                <Link href='/library'>
                  <Button
                    size='lg'
                    variant='outline'
                    className='w-full sm:w-auto text-base bg-transparent'
                  >
                    Browse Library
                  </Button>
                </Link>
              </div>
            </div>

            {/* Agent Preview Card */}
            <div className='mt-20 max-w-4xl mx-auto'>
              <div className='relative'>
                <div className='absolute inset-0 bg-gradient-to-b from-transparent to-background z-10 pointer-events-none'></div>
                <div className='bg-card border border-border rounded-xl shadow-2xl overflow-hidden'>
                  <div className='p-6 border-b border-border flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                      <div className='w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center'>
                        <Cpu className='w-5 h-5 text-gold' />
                      </div>
                      <div>
                        <div className='font-medium'>
                          Customer Support Agent
                        </div>
                        <div className='text-xs text-muted-foreground'>
                          v2.1.0 • Cloud Worker
                        </div>
                      </div>
                    </div>
                    <div className='flex items-center gap-2'>
                      <span className='px-3 py-.5 rounded-full bg-green-500/10 border border-dashed border-green-500/20 text-xs font-medium text-green-500'>
                        Live
                      </span>
                      <span className='px-3 py-.5 rounded-full bg-secondary border border-border text-xs font-medium'>
                        GPT-4
                      </span>
                    </div>
                  </div>
                  <div className='p-6'>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
                      <div className='p-4 bg-secondary rounded-lg'>
                        <div className='text-xs text-muted-foreground mb-1'>
                          Requests
                        </div>
                        <div className='text-2xl font-bold'>1,247</div>
                        <div className='text-xs text-green-500'>
                          +12% this week
                        </div>
                      </div>
                      <div className='p-4 bg-secondary rounded-lg'>
                        <div className='text-xs text-muted-foreground mb-1'>
                          Avg Response
                        </div>
                        <div className='text-2xl font-bold'>1.2s</div>
                        <div className='text-xs text-muted-foreground'>
                          98% uptime
                        </div>
                      </div>
                      <div className='p-4 bg-secondary rounded-lg'>
                        <div className='text-xs text-muted-foreground mb-1'>
                          Tool Calls
                        </div>
                        <div className='text-2xl font-bold'>342</div>
                        <div className='text-xs text-muted-foreground'>
                          Database, API, Email
                        </div>
                      </div>
                    </div>
                    <div className='p-4 bg-primary rounded-lg border border-border'>
                      <div className='text-xs text-muted-foreground mb-2'>
                        System Instructions
                      </div>
                      <code className='text-xs text-foreground/80 font-mono'>
                        You are a friendly customer support agent. Help users
                        with product questions, order tracking, and technical
                        issues...
                      </code>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id='how-it-works' className='py-20 bg-primary'>
          <div className='container'>
            <div className='text-center mb-16'>
              <h2 className='text-3xl md:text-4xl font-bold mb-4'>
                Three Steps to <span className='text-gold'>Live AI Agents</span>
              </h2>
              <p className='text-muted-foreground max-w-2xl mx-auto'>
                From concept to production in minutes with our streamlined agent
                deployment workflow
              </p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
              <div className='relative'>
                <div className='relative z-10 flex flex-col items-center text-center'>
                  <h3 className='text-xl font-bold mb-2'>1. Generate</h3>
                  <p className='text-muted-foreground'>
                    Configure your agent with instructions, capabilities, tools,
                    and constraints in an intuitive workspace.
                  </p>
                </div>
              </div>

              <div className='relative'>
                <div className='relative z-10 flex flex-col items-center text-center'>
                  <h3 className='text-xl font-bold mb-2'>2. Deploy</h3>
                  <p className='text-muted-foreground'>
                    Instantly deploy to browser workers, cloud functions, edge
                    runtimes, or local sandboxes with one click.
                  </p>
                </div>
              </div>

              <div className='relative'>
                <div className='relative z-10 flex flex-col items-center text-center'>
                  <h3 className='text-xl font-bold mb-2'>3. Preview</h3>
                  <p className='text-muted-foreground'>
                    Test your agent in real-time with live chat, streaming logs,
                    and detailed reasoning traces.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className='py-20 bg-primary'>
          <div className='container'>
            <Card className='max-w-3xl mx-auto p-8 md:p-12 text-center relative overflow-hidden border-border/50'>
              <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(234,179,8,0.15),transparent_50%)]'></div>
              <h2 className='text-3xl md:text-4xl font-bold mb-6'>
                Ready to Build Your <span className='text-gold'>AI Agent</span>?
              </h2>
              <p className='text-xl text-muted-foreground mb-8'>
                Join developers deploying intelligent agents to production in
                minutes, not months.
              </p>
              <div className='flex flex-col sm:flex-row gap-4 justify-center relative'>
                <Link href='/playground'>
                  <ButtonGold size='lg' className='w-full sm:w-auto'>
                    Open Playground
                    <ArrowRight className='ml-2 size-4' />
                  </ButtonGold>
                </Link>
                <Link href='/library'>
                  <Button
                    size='lg'
                    variant='outline'
                    className='w-full sm:w-auto bg-transparent'
                  >
                    View Examples
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </section>
      </main>
    </div>
  )
}
