'use client'

import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import { formatTimestamp } from '@/lib/utils'
import type { CaseTimelineEntry } from '@/types'

interface CaseTimelineProps {
  entries: CaseTimelineEntry[]
}

const typeColors: Record<string, string> = {
  note: 'var(--status-info)',
  alert: 'var(--status-warning)',
  status: 'var(--status-success)',
  action: 'var(--chart-5, hsl(270 60% 60%))',
}

function getTypeColor(type: string): string {
  return typeColors[type] ?? 'var(--muted-foreground)'
}

export function CaseTimeline({ entries }: CaseTimelineProps) {
  const t = useTranslations('cases')

  if (entries.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-sm text-muted-foreground">{t('noTimeline')}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      {entries.map((entry, index) => {
        const isLast = index === entries.length - 1
        const color = getTypeColor(entry.type)

        return (
          <div key={entry.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div
                className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: color }}
              />
              {!isLast && (
                <div className="w-px flex-1 bg-border" />
              )}
            </div>

            <div className={cn('flex flex-col gap-1 pb-6', isLast && 'pb-0')}>
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-medium">{entry.actor}</span>
                <span className="text-xs text-muted-foreground">
                  {formatTimestamp(entry.timestamp)}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{entry.description}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
