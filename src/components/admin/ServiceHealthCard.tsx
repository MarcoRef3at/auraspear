'use client'

import { useTranslations } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn, formatPercentage, formatRelativeTime } from '@/lib/utils'
import { ServiceStatus } from '@/enums'
import type { ServiceHealth } from '@/types'

interface ServiceHealthCardProps {
  service: ServiceHealth
}

function getStatusDotClass(status: ServiceStatus): string {
  switch (status) {
    case ServiceStatus.HEALTHY:
      return 'bg-status-success'
    case ServiceStatus.DEGRADED:
      return 'bg-status-warning'
    case ServiceStatus.DOWN:
      return 'bg-status-error'
    case ServiceStatus.MAINTENANCE:
      return 'bg-status-info'
    default:
      return 'bg-status-neutral'
  }
}

function getStatusBgHint(status: ServiceStatus): string {
  switch (status) {
    case ServiceStatus.HEALTHY:
      return 'border-status-success/30'
    case ServiceStatus.DEGRADED:
      return 'border-status-warning/30'
    case ServiceStatus.DOWN:
      return 'border-status-error/30'
    case ServiceStatus.MAINTENANCE:
      return 'border-status-info/30'
    default:
      return ''
  }
}

export function ServiceHealthCard({ service }: ServiceHealthCardProps) {
  const t = useTranslations('admin')

  return (
    <Card className={cn('transition-colors', getStatusBgHint(service.status))}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <span
            className={cn('inline-block h-2.5 w-2.5 rounded-full', getStatusDotClass(service.status))}
          />
          {service.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
          <span className="text-muted-foreground">{t('services.uptime')}</span>
          <span className="font-medium">{formatPercentage(service.uptime)}</span>

          <span className="text-muted-foreground">{t('services.version')}</span>
          <span className="font-mono text-xs">{service.version}</span>

          <span className="text-muted-foreground">{t('services.lastCheck')}</span>
          <span className="text-xs">{formatRelativeTime(service.lastCheck)}</span>

          {service.eps !== undefined && (
            <>
              <span className="text-muted-foreground">{t('services.eps')}</span>
              <span className="font-mono text-xs">{service.eps}</span>
            </>
          )}

          {service.lag !== undefined && (
            <>
              <span className="text-muted-foreground">{t('services.lag')}</span>
              <span className="font-mono text-xs">{`${service.lag}ms`}</span>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
