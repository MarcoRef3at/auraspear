'use client'

import { useTranslations } from 'next-intl'
import { MoreHorizontal, Eye, Brain, Briefcase, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Alert } from '@/types'

interface AlertRowActionsProps {
  alert: Alert
  onView?: ((alert: Alert) => void) | undefined
  onInvestigate?: ((alert: Alert) => void) | undefined
  onCreateCase?: ((alert: Alert) => void) | undefined
  onCopyId?: ((id: string) => void) | undefined
}

export function AlertRowActions({
  alert,
  onView,
  onInvestigate,
  onCreateCase,
  onCopyId,
}: AlertRowActionsProps) {
  const t = useTranslations('alerts')
  const tCommon = useTranslations('common')

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-xs">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">{tCommon('actions')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onView?.(alert)}>
          <Eye className="h-4 w-4" />
          {tCommon('view')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onInvestigate?.(alert)}>
          <Brain className="h-4 w-4" />
          {t('investigate')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onCreateCase?.(alert)}>
          <Briefcase className="h-4 w-4" />
          {t('createCase')}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onCopyId?.(alert.id)}>
          <Copy className="h-4 w-4" />
          {tCommon('copyId')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
