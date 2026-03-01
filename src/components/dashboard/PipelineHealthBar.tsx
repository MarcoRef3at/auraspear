'use client'

import { Activity } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { EmptyState } from '@/components/common/EmptyState'
import { cn } from '@/lib/utils'
import type { PipelineService } from '@/types'
import { DashboardCard } from './DashboardCard'

interface PipelineHealthBarProps {
  services: PipelineService[]
  className?: string
}

function StatusDot({ healthy }: { healthy: boolean }) {
  return (
    <span
      className={cn(
        'inline-block h-2 w-2 shrink-0 rounded-full',
        healthy ? 'bg-status-success' : 'bg-status-error'
      )}
    />
  )
}

export function PipelineHealthBar({ services, className }: PipelineHealthBarProps) {
  const t = useTranslations('dashboard')

  if (services.length === 0) {
    return (
      <DashboardCard title={t('pipelineHealth')} className={className}>
        <EmptyState
          icon={<Activity className="h-6 w-6" />}
          title={t('pipelineEmptyTitle')}
          description={t('pipelineEmptyDescription')}
          className="py-6"
        />
      </DashboardCard>
    )
  }

  return (
    <DashboardCard title={t('pipelineHealth')} className={className}>
      <div className="flex flex-wrap gap-4">
        {services.map(service => (
          <div key={service.name} className="flex items-center gap-2">
            <StatusDot healthy={service.healthy} />
            <span className="text-foreground text-sm">{service.name}</span>
          </div>
        ))}
      </div>
    </DashboardCard>
  )
}
