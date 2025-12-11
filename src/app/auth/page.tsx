import { ButtonGold } from '@/components/ui/button-gold'
import { Github } from 'lucide-react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { signIn } from '@/auth'

export default function AuthPage() {
  return (
    <div className='min-h-screen bg-background flex items-center justify-center'>
      <div className='w-full max-w-md space-y-8'>
        <div className='text-center space-y-2'>
          <Link href='/' className='inline-block'>
            <h1 className='text-4xl font-bold tracking-tight bg-gradient-to-r from-gold to-gold/70 bg-clip-text text-transparent'>
              Sist.
            </h1>
          </Link>
          <p className='text-muted-foreground text-lg [font-feature-settings:"ss01","ss03"] tracking-tight'>
            Agent Deployment Playground
          </p>
        </div>
        <Card className='p-8 space-y-6 relative overflow-hidden border-border/50 rounded-2xl'>
          <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(234,179,8,0.15),transparent_50%)]'></div>
          <div className='space-y-2 text-center relative'>
            <h2 className='text-2xl font-[650] text-foreground tracking-tighter'>
              Welcome back
            </h2>
            <p className='text-sm text-muted-foreground'>
              Sign in to continue to your agent workspace
            </p>
          </div>
          <form
            className='space-y-4 relative'
            action={async () => {
              'use server'
              await signIn('github')
            }}
          >
            <ButtonGold className='w-full'>
              <Github className='mr-2 h-5 w-5' />
              Continue with GitHub
            </ButtonGold>
          </form>
        </Card>
      </div>
    </div>
  )
}
