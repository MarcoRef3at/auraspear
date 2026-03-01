'use client'

import { useTranslations } from 'next-intl'
import { Link2, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatRelativeTime } from '@/lib/utils'
import { CaseStatus, CaseSeverity } from '@/enums'
import { SeverityBadge } from '@/components/common/SeverityBadge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import type { Case } from '@/types'

interface CaseKanbanCardProps {
  caseItem: Case
  onClick?: ((caseItem: Case) => void) | undefined
}

const severityBorderColors: Record<CaseSeverity, string> = {
  [CaseSeverity.CRITICAL]: 'var(--severity-critical)',
  [CaseSeverity.HIGH]: 'var(--severity-high)',
  [CaseSeverity.MEDIUM]: 'var(--severity-medium)',
  [CaseSeverity.LOW]: 'var(--severity-low)',
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function CaseKanbanCard({ caseItem, onClick }: CaseKanbanCardProps) {
  const t = useTranslations('cases')
  const isClosed = caseItem.status === CaseStatus.CLOSED

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onClick?.(caseItem)}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick?.(caseItem)
        }
      }}
      className={cn(
        'group relative cursor-pointer overflow-hidden rounded-lg border border-border bg-card transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md',
        isClosed && 'opacity-60 grayscale'
      )}
    >
      <div
        className="absolute inset-y-0 start-0 w-1"
        style={{ backgroundColor: severityBorderColors[caseItem.severity] }}
      />

      <div className="flex flex-col gap-2.5 p-3 ps-4">
        <div className="flex items-start justify-between gap-2">
          <span className="font-mono text-xs text-muted-foreground">
            {caseItem.caseNumber}
          </span>
          <SeverityBadge severity={caseItem.severity} />
        </div>

        <p className="line-clamp-2 text-sm font-medium leading-snug">
          {caseItem.title}
        </p>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <Avatar size="sm">
              <AvatarFallback>{getInitials(caseItem.assignee)}</AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">
              {caseItem.assignee}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {caseItem.linkedAlertIds.length > 0 && (
              <span className="flex items-center gap-1">
                <Link2 className="h-3 w-3" />
                {t('linkedAlerts', { count: caseItem.linkedAlertIds.length })}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatRelativeTime(caseItem.createdAt)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
