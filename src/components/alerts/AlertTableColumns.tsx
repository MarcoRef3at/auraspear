'use client'

import { Badge } from '@/components/ui/badge'
import { AlertSeverity } from '@/enums'
import { formatTimestamp, cn } from '@/lib/utils'
import { AlertRowActions } from './AlertRowActions'
import type { Column, Alert } from '@/types'

function getSeverityVariant(severity: AlertSeverity): string {
  switch (severity) {
    case AlertSeverity.CRITICAL:
      return 'bg-status-error text-status-error border-status-error'
    case AlertSeverity.HIGH:
      return 'bg-status-warning text-status-warning border-status-warning'
    case AlertSeverity.MEDIUM:
      return 'bg-status-info text-status-info border-status-info'
    case AlertSeverity.LOW:
      return 'bg-status-success text-status-success border-status-success'
    case AlertSeverity.INFO:
      return 'bg-status-neutral text-status-neutral border-status-neutral'
  }
}

function SeverityBadge({ severity }: { severity: AlertSeverity }) {
  return (
    <Badge variant="outline" className={cn('capitalize text-xs', getSeverityVariant(severity))}>
      {severity}
    </Badge>
  )
}

function MITREBadge({ techniques }: { techniques: string[] }) {
  const first = techniques[0]
  if (!first) {
    return <span className="text-xs text-muted-foreground">-</span>
  }

  return (
    <div className="flex items-center gap-1">
      <Badge variant="outline" className="font-mono text-xs">
        {first}
      </Badge>
      {techniques.length > 1 && (
        <span className="text-xs text-muted-foreground">
          +{techniques.length - 1}
        </span>
      )}
    </div>
  )
}

interface AlertColumnTranslations {
  alerts: (key: string) => string
  common: (key: string) => string
}

interface GetAlertColumnsOptions {
  onView?: (alert: Alert) => void
  onInvestigate?: (alert: Alert) => void
  onCreateCase?: (alert: Alert) => void
  onCopyId?: (id: string) => void
}

export function getAlertColumns(
  t: AlertColumnTranslations,
  options?: GetAlertColumnsOptions
): Column<Alert>[] {
  return [
    {
      key: 'timestamp',
      label: t.common('timestamp'),
      render: (value) => (
        <span className="font-mono text-xs text-muted-foreground whitespace-nowrap">
          {formatTimestamp(String(value))}
        </span>
      ),
    },
    {
      key: 'severity',
      label: t.common('severity'),
      render: (value) => <SeverityBadge severity={value as AlertSeverity} />,
    },
    {
      key: 'description',
      label: t.alerts('rule'),
      className: 'max-w-xs',
      render: (value) => (
        <span className="text-sm truncate block">{String(value)}</span>
      ),
    },
    {
      key: 'agentName',
      label: t.alerts('agent'),
      render: (value) => <span className="text-sm">{String(value)}</span>,
    },
    {
      key: 'sourceIp',
      label: t.alerts('sourceIp'),
      render: (value) => (
        <span className="font-mono text-xs">{String(value)}</span>
      ),
    },
    {
      key: 'mitreTechniques',
      label: t.alerts('mitre'),
      render: (value) => <MITREBadge techniques={value as string[]} />,
    },
    {
      key: 'actions',
      label: '',
      render: (_value, row) => (
        <AlertRowActions
          alert={row}
          onView={options?.onView}
          onInvestigate={options?.onInvestigate}
          onCreateCase={options?.onCreateCase}
          onCopyId={options?.onCopyId}
        />
      ),
    },
  ]
}
