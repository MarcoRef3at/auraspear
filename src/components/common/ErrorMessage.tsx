'use client'

import { useTranslations } from 'next-intl'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ErrorMessageProps {
  message?: string
  onRetry?: () => void
  className?: string
}

export function ErrorMessage({ message, onRetry, className }: ErrorMessageProps) {
  const t = useTranslations()

  return (
    <div className={cn('flex flex-col items-center justify-center gap-4 py-12', className)}>
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-status-error">
        <AlertTriangle className="h-6 w-6 text-status-error" />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-status-error">
          {message ?? t('errors.common.unknown')}
        </p>
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          {t('common.refresh')}
        </Button>
      )}
    </div>
  )
}
