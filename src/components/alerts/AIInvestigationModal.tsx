'use client'

import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import type { AIInvestigation } from '@/types'

interface AIInvestigationModalProps {
  investigation: AIInvestigation | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

function getVerdictConfig(verdict: string) {
  const normalized = verdict.toLowerCase()
  if (normalized.includes('true') || normalized.includes('positive')) {
    return {
      icon: XCircle,
      label: verdict,
      colorClass: 'text-status-error',
      bgClass: 'bg-status-error',
      borderClass: 'border-status-error',
    }
  }
  if (normalized.includes('false')) {
    return {
      icon: CheckCircle,
      label: verdict,
      colorClass: 'text-status-success',
      bgClass: 'bg-status-success',
      borderClass: 'border-status-success',
    }
  }
  return {
    icon: AlertTriangle,
    label: verdict,
    colorClass: 'text-status-warning',
    bgClass: 'bg-status-warning',
    borderClass: 'border-status-warning',
  }
}

function getConfidenceColor(confidence: number): string {
  if (confidence >= 80) return 'text-status-success'
  if (confidence >= 50) return 'text-status-warning'
  return 'text-status-error'
}

export function AIInvestigationModal({
  investigation,
  open,
  onOpenChange,
}: AIInvestigationModalProps) {
  const t = useTranslations('alerts')

  if (!investigation) {
    return null
  }

  const verdictConfig = getVerdictConfig(investigation.verdict)
  const VerdictIcon = verdictConfig.icon

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-primary/20 shadow-[0_0_40px_-10px_hsl(var(--primary)/0.3)] sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">{t('aiInvestigation')}</DialogTitle>
          <DialogDescription className="font-mono text-xs">
            {investigation.alertId}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh]">
          <div className="space-y-6 pe-4">
            <div
              className={cn(
                'flex items-center gap-3 rounded-lg border p-4',
                verdictConfig.bgClass,
                verdictConfig.borderClass
              )}
            >
              <VerdictIcon className={cn('h-6 w-6 shrink-0', verdictConfig.colorClass)} />
              <div>
                <p className={cn('text-sm font-bold', verdictConfig.colorClass)}>{t('verdict')}</p>
                <p className={cn('text-lg font-semibold', verdictConfig.colorClass)}>
                  {verdictConfig.label}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                  {t('confidence')}
                </span>
                <span
                  className={cn(
                    'text-sm font-bold tabular-nums',
                    getConfidenceColor(investigation.confidence)
                  )}
                >
                  {investigation.confidence}%
                </span>
              </div>
              <Progress value={investigation.confidence} className="h-2" />
            </div>

            <Separator />

            <div className="space-y-2">
              <h4 className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                {t('reasoning')}
              </h4>
              <p className="text-foreground text-sm leading-relaxed">{investigation.reasoning}</p>
            </div>

            <Separator />

            <div className="space-y-2">
              <h4 className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                {t('recommendations')}
              </h4>
              <ul className="space-y-1.5">
                {investigation.recommendations.map((rec, index) => (
                  <li
                    key={`rec-${String(index)}`}
                    className="text-foreground flex items-start gap-2 text-sm"
                  >
                    <span className="bg-primary mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" />
                    {rec}
                  </li>
                ))}
              </ul>
            </div>

            {investigation.relatedAlerts.length > 0 && (
              <>
                <Separator />
                <div className="space-y-2">
                  <h4 className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                    {t('relatedAlerts')}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {investigation.relatedAlerts.map(alertId => (
                      <Badge key={alertId} variant="outline" className="font-mono text-xs">
                        {alertId}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}

            {investigation.mitreTechniques.length > 0 && (
              <>
                <Separator />
                <div className="space-y-2">
                  <h4 className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                    MITRE
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {investigation.mitreTechniques.map(technique => (
                      <Badge key={technique} variant="outline" className="font-mono text-xs">
                        {technique}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
