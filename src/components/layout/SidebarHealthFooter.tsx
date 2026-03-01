'use client'

import { Activity } from 'lucide-react'
import { useTranslations } from 'next-intl'
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
      <div className="border-sidebar-border border-t p-3">
        <div className="flex items-center justify-center">
          <div className="relative">
            <Activity className="text-status-success h-4 w-4" />
            <span className="bg-status-success absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="border-sidebar-border border-t p-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-xs font-medium">{t('systemHealth')}</span>
          <span className="text-status-success text-xs font-bold">{healthPercent}%</span>
        </div>
        <Progress value={healthPercent} className="h-1.5" />
        <div className="text-muted-foreground flex items-center justify-between text-[10px]">
          <div className="flex items-center gap-1.5">
            <span className="bg-status-success h-1.5 w-1.5 rounded-full" />
            <span>
              {t('eventsPerSecond')}: {eps.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="bg-status-info h-1.5 w-1.5 rounded-full" />
            <span>
              {t('lag')}: {lagMs}ms
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
