'use client'

import { Badge } from '@/components/ui/badge'
import type { ConnectorStatus } from '@/lib/types/connectors'

const STATUS_CONFIG: Record<ConnectorStatus, { label: string; className: string }> = {
  not_configured: {
    label: 'Not Configured',
    className: 'bg-muted text-muted-foreground',
  },
  connected: {
    label: 'Connected',
    className: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  },
  disconnected: {
    label: 'Disconnected',
    className: 'bg-destructive/15 text-destructive',
  },
  testing: {
    label: 'Testing...',
    className: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 animate-pulse',
  },
}

interface StatusBadgeProps {
  status: ConnectorStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const cfg = STATUS_CONFIG[status]
  return (
    <Badge variant="outline" className={cfg.className}>
      {cfg.label}
    </Badge>
  )
}
