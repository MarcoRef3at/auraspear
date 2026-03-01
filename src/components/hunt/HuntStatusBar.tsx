'use client'

import { useTranslations } from 'next-intl'
import { HuntStatus } from '@/enums'
import { cn } from '@/lib/utils'

interface HuntStatusBarProps {
  sessionId: string
  status: HuntStatus
}

const statusConfig = {
  [HuntStatus.IDLE]: {
    dotClass: 'bg-muted-foreground',
    labelKey: 'statusIdle',
    animate: false,
  },
  [HuntStatus.RUNNING]: {
    dotClass: 'bg-status-success',
    labelKey: 'statusRunning',
    animate: true,
  },
  [HuntStatus.COMPLETED]: {
    dotClass: 'bg-status-info',
    labelKey: 'statusCompleted',
    animate: false,
  },
  [HuntStatus.ERROR]: {
    dotClass: 'bg-status-error',
    labelKey: 'statusError',
    animate: false,
  },
} as const

export function HuntStatusBar({ sessionId, status }: HuntStatusBarProps) {
  const t = useTranslations('hunt')
  const config = statusConfig[status]

  return (
    <div className="border-border bg-card/50 flex items-center justify-between border-b px-4 py-2.5">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            {config.animate && (
              <span
                className={cn(
                  'absolute inline-flex h-full w-full animate-ping rounded-full opacity-75',
                  config.dotClass
                )}
              />
            )}
            <span
              className={cn('relative inline-flex h-2.5 w-2.5 rounded-full', config.dotClass)}
            />
          </span>
          <span className="text-muted-foreground text-xs">{t(config.labelKey)}</span>
        </div>
      </div>
      <span className="text-muted-foreground font-mono text-xs">{sessionId}</span>
    </div>
  )
}
