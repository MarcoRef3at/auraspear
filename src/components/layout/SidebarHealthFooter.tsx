'use client'

import { useTranslations } from 'next-intl'
import { Activity } from 'lucide-react'
import { Progress } from '@/components/ui/progress'

interface SidebarHealthFooterProps {
  collapsed?: boolean
  healthPercent?: number
  eps?: number
  lagMs?: number
}

export function SidebarHealthFooter({
  collapsed,
  healthPercent = 98.5,
  eps = 12400,
  lagMs = 45,
}: SidebarHealthFooterProps) {
  const t = useTranslations('layout')

  if (collapsed) {
    return (
      <div className="border-t border-sidebar-border p-3">
        <div className="flex items-center justify-center">
          <div className="relative">
            <Activity className="h-4 w-4 text-status-success" />
            <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-status-success" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="border-t border-sidebar-border p-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">
            {t('systemHealth')}
          </span>
          <span className="text-xs font-bold text-status-success">
            {healthPercent}%
          </span>
        </div>
        <Progress value={healthPercent} className="h-1.5" />
        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-status-success" />
            <span>{t('eventsPerSecond')}: {eps.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-status-info" />
            <span>{t('lag')}: {lagMs}ms</span>
          </div>
        </div>
      </div>
    </div>
  )
}
