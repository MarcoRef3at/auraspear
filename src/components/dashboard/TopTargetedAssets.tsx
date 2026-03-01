'use client'

import { Monitor } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { EmptyState } from '@/components/common/EmptyState'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { AssetRisk } from '@/types'
import { DashboardCard } from './DashboardCard'

interface TopTargetedAssetsProps {
  assets: AssetRisk[]
  className?: string
}

function getRiskBadgeClass(score: number): string {
  if (score > 80) {
    return 'bg-status-error text-status-error border-status-error'
  }
  if (score > 60) {
    return 'bg-status-warning text-status-warning border-status-warning'
  }
  if (score > 40) {
    return 'bg-status-info text-status-info border-status-info'
  }
  return 'bg-status-neutral text-status-neutral border-status-neutral'
}

export function TopTargetedAssets({ assets, className }: TopTargetedAssetsProps) {
  const t = useTranslations('dashboard')

  if (assets.length === 0) {
    return (
      <DashboardCard title={t('topTargetedAssets')} className={className}>
        <EmptyState
          icon={<Monitor className="h-6 w-6" />}
          title={t('assetsEmptyTitle')}
          description={t('assetsEmptyDescription')}
          className="py-6"
        />
      </DashboardCard>
    )
  }

  return (
    <DashboardCard title={t('topTargetedAssets')} className={className}>
      <div className="space-y-1">
        <div className="text-muted-foreground border-border grid grid-cols-3 gap-2 border-b pb-2 text-xs font-bold tracking-wider uppercase">
          <span>{t('asset')}</span>
          <span>{t('ip')}</span>
          <span className="text-end">{t('riskScore')}</span>
        </div>
        {assets.map(asset => (
          <div
            key={asset.id}
            className="border-border grid grid-cols-3 items-center gap-2 border-b py-2 text-sm last:border-b-0"
          >
            <span className="text-foreground truncate font-medium">{asset.name}</span>
            <span className="text-muted-foreground font-mono text-xs">{asset.ip}</span>
            <div className="flex justify-end">
              <Badge
                variant="outline"
                className={cn('text-xs tabular-nums', getRiskBadgeClass(asset.riskScore))}
              >
                {asset.riskScore}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </DashboardCard>
  )
}
