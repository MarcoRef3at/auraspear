import { cn } from '@/lib/utils'

interface MonoTextProps {
  children: React.ReactNode
  className?: string
}

export function MonoText({ children, className }: MonoTextProps) {
  return (
    <span
      className={cn(
        'rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground',
        className
      )}
    >
      {children}
    </span>
  )
}
