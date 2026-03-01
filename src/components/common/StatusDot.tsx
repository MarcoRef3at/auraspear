import { cn } from '@/lib/utils'

type StatusDotStatus = 'healthy' | 'degraded' | 'down'
type StatusDotSize = 'sm' | 'md'

interface StatusDotProps {
  status: StatusDotStatus
  size?: StatusDotSize
}

const STATUS_COLOR_MAP: Record<StatusDotStatus, string> = {
  healthy: 'bg-status-success',
  degraded: 'bg-status-warning',
  down: 'bg-status-error',
}

const PING_COLOR_MAP: Record<StatusDotStatus, string> = {
  healthy: 'bg-status-success',
  degraded: 'bg-status-warning',
  down: 'bg-status-error',
}

const SIZE_MAP: Record<StatusDotSize, string> = {
  sm: 'h-2 w-2',
  md: 'h-3 w-3',
}

export function StatusDot({ status, size = 'sm' }: StatusDotProps) {
  return (
    <span className="relative inline-flex">
      <span
        className={cn(
          'animate-ping absolute inline-flex rounded-full opacity-75',
          SIZE_MAP[size],
          PING_COLOR_MAP[status]
        )}
      />
      <span
        className={cn(
          'relative inline-flex rounded-full',
          SIZE_MAP[size],
          STATUS_COLOR_MAP[status]
        )}
      />
    </span>
  )
}
