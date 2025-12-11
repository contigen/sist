import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import type { ButtonProps } from '@/components/ui/button'

export function ButtonGold({ className, children, ...props }: ButtonProps) {
  return (
    <Button
      className={cn(
        'bg-[hsl(var(--gold))] text-[hsl(var(--gold-foreground))] hover:bg-[hsl(var(--gold)/0.8)] font-medium',
        className
      )}
      {...props}
    >
      {children}
    </Button>
  )
}
