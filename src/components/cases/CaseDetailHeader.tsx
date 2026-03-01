'use client'

import { useTranslations } from 'next-intl'
import { Calendar, User, Edit, Trash2, ExternalLink } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { SeverityBadge } from '@/components/common/SeverityBadge'
import { formatDate } from '@/lib/utils'
import { CaseStatus } from '@/enums'
import type { Case } from '@/types'

interface CaseDetailHeaderProps {
  caseItem: Case
  onEdit?: () => void
  onDelete?: () => void
  onEscalate?: () => void
}

const statusVariantMap: Record<CaseStatus, 'default' | 'secondary' | 'outline'> = {
  [CaseStatus.OPEN]: 'default',
  [CaseStatus.IN_PROGRESS]: 'secondary',
  [CaseStatus.CLOSED]: 'outline',
}

export function CaseDetailHeader({
  caseItem,
  onEdit,
  onDelete,
  onEscalate,
}: CaseDetailHeaderProps) {
  const t = useTranslations('cases')

  return (
    <div className="flex flex-col gap-4 border-b border-border pb-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm text-muted-foreground">
              {caseItem.caseNumber}
            </span>
            <Badge variant={statusVariantMap[caseItem.status]} className="capitalize">
              {t(`status${caseItem.status === CaseStatus.OPEN ? 'Open' : caseItem.status === CaseStatus.IN_PROGRESS ? 'InProgress' : 'Closed'}`)}
            </Badge>
            <SeverityBadge severity={caseItem.severity} />
          </div>
          <h1 className="text-xl font-bold">{caseItem.title}</h1>
        </div>

        <div className="flex items-center gap-2">
          {onEscalate && caseItem.status !== CaseStatus.CLOSED && (
            <Button variant="outline" size="sm" onClick={onEscalate}>
              <ExternalLink className="h-4 w-4" />
              {t('escalate')}
            </Button>
          )}
          {onEdit && (
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit className="h-4 w-4" />
              {t('edit')}
            </Button>
          )}
          {onDelete && (
            <Button variant="destructive" size="sm" onClick={onDelete}>
              <Trash2 className="h-4 w-4" />
              {t('delete')}
            </Button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-6 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <User className="h-3.5 w-3.5" />
          {caseItem.assignee}
        </span>
        <span className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5" />
          {t('created')}: {formatDate(caseItem.createdAt)}
        </span>
        <span className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5" />
          {t('updated')}: {formatDate(caseItem.updatedAt)}
        </span>
        {caseItem.closedAt && (
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            {t('closed')}: {formatDate(caseItem.closedAt)}
          </span>
        )}
      </div>
    </div>
  )
}
