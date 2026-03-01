'use client'

import { Link2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { DataTable } from '@/components/common/DataTable'
import { SeverityBadge } from '@/components/common/SeverityBadge'
import type { AlertSeverity } from '@/enums'
import { formatRelativeTime } from '@/lib/utils'
import type { IOCCorrelation, Column } from '@/types'

interface WazuhCorrelationPanelProps {
  correlations: IOCCorrelation[]
  loading?: boolean
}

export function WazuhCorrelationPanel({
  correlations,
  loading = false,
}: WazuhCorrelationPanelProps) {
  const t = useTranslations('intel')

  const columns: Column<IOCCorrelation>[] = [
    {
      key: 'iocValue',
      label: t('correlation.iocValue'),
      className: 'font-mono text-xs',
    },
    {
      key: 'iocType',
      label: t('correlation.type'),
      render: value => (
        <span className="text-sm tracking-wide uppercase">{String(value ?? '')}</span>
      ),
    },
    {
      key: 'source',
      label: t('correlation.source'),
    },
    {
      key: 'hitCount',
      label: t('correlation.hitCount'),
      className: 'text-center',
      render: value => (
        <span className="font-mono text-sm font-semibold">{String(value ?? '0')}</span>
      ),
    },
    {
      key: 'lastSeen',
      label: t('correlation.lastSeen'),
      render: value => (
        <span className="text-muted-foreground text-sm">
          {formatRelativeTime(String(value ?? ''))}
        </span>
      ),
    },
    {
      key: 'severity',
      label: t('correlation.severity'),
      render: value => <SeverityBadge severity={String(value ?? 'info') as AlertSeverity} />,
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={correlations}
      loading={loading}
      emptyMessage={t('correlation.noMatches')}
      emptyIcon={<Link2 className="h-6 w-6" />}
      emptyDescription={t('correlation.noMatchesDescription')}
    />
  )
}
