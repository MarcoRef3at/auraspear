import { cn } from '@/lib/utils'

interface MonoTextProps {
  children: React.ReactNode
  className?: string
}

export function MonoText({ children, className }: MonoTextProps) {
  return (
    <span
      className={cn('bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-xs', className)}
    >
      {children}
    </span>
  )
}
