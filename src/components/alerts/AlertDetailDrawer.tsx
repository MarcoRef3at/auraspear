'use client'

import { useTranslations } from 'next-intl'
import { Brain, Briefcase, X } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { AlertSeverity } from '@/enums'
import { formatTimestamp, cn } from '@/lib/utils'
import type { Alert } from '@/types'

interface AlertDetailDrawerProps {
  alert: Alert | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onInvestigate?: (alert: Alert) => void
  onCreateCase?: (alert: Alert) => void
  onClose?: (alert: Alert) => void
}

function getSeverityClass(severity: AlertSeverity): string {
  switch (severity) {
    case AlertSeverity.CRITICAL:
      return 'bg-status-error text-status-error border-status-error'
    case AlertSeverity.HIGH:
      return 'bg-status-warning text-status-warning border-status-warning'
    case AlertSeverity.MEDIUM:
      return 'bg-status-info text-status-info border-status-info'
    case AlertSeverity.LOW:
      return 'bg-status-success text-status-success border-status-success'
    case AlertSeverity.INFO:
      return 'bg-status-neutral text-status-neutral border-status-neutral'
  }
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2">
      <span className="text-xs font-medium text-muted-foreground shrink-0">{label}</span>
      <div className="text-sm text-end">{children}</div>
    </div>
  )
}

export function AlertDetailDrawer({
  alert,
  open,
  onOpenChange,
  onInvestigate,
  onCreateCase,
  onClose,
}: AlertDetailDrawerProps) {
  const t = useTranslations('alerts')
  const tCommon = useTranslations('common')

  if (!alert) {
    return null
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg">
        <SheetHeader>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={cn('capitalize text-xs', getSeverityClass(alert.severity))}
            >
              {alert.severity}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {formatTimestamp(alert.timestamp)}
            </span>
          </div>
          <SheetTitle className="text-base">{alert.description}</SheetTitle>
          <SheetDescription className="text-xs font-mono text-muted-foreground">
            {alert.ruleId}
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 px-4">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList variant="line" className="w-full">
              <TabsTrigger value="overview">{t('viewDetail')}</TabsTrigger>
              <TabsTrigger value="mitre">{t('mitre')}</TabsTrigger>
              <TabsTrigger value="raw">{t('rawEvent')}</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-1 pt-4">
              <DetailRow label={t('agent')}>
                <span>{alert.agentName}</span>
              </DetailRow>
              <Separator />
              <DetailRow label={t('sourceIp')}>
                <span className="font-mono text-xs">{alert.sourceIp}</span>
              </DetailRow>
              <Separator />
              <DetailRow label={t('destIp')}>
                <span className="font-mono text-xs">{alert.destinationIp}</span>
              </DetailRow>
              <Separator />
              <DetailRow label={t('rule')}>
                <span>{alert.ruleName}</span>
              </DetailRow>
              <Separator />
              <DetailRow label={tCommon('status')}>
                <Badge variant="outline" className="capitalize text-xs">
                  {alert.status}
                </Badge>
              </DetailRow>
            </TabsContent>

            <TabsContent value="mitre" className="pt-4">
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  {t('mitre')}
                </h4>
                {alert.mitreTechniques.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {alert.mitreTechniques.map((technique) => (
                      <Badge key={technique} variant="outline" className="font-mono text-xs">
                        {technique}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">{tCommon('noData')}</p>
                )}

                {alert.mitreTactics.length > 0 && (
                  <>
                    <Separator />
                    <div className="flex flex-wrap gap-2">
                      {alert.mitreTactics.map((tactic) => (
                        <Badge key={tactic} variant="secondary" className="text-xs">
                          {tactic}
                        </Badge>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </TabsContent>

            <TabsContent value="raw" className="pt-4">
              <pre className="rounded-lg bg-muted p-4 text-xs font-mono overflow-auto max-h-96">
                {JSON.stringify(alert.rawEvent, null, 2)}
              </pre>
            </TabsContent>
          </Tabs>
        </ScrollArea>

        <SheetFooter className="flex-row gap-2">
          <Button
            variant="default"
            size="sm"
            onClick={() => onInvestigate?.(alert)}
            className="flex-1"
          >
            <Brain className="h-4 w-4" />
            {t('investigate')}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onCreateCase?.(alert)}
            className="flex-1"
          >
            <Briefcase className="h-4 w-4" />
            {t('createCase')}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onClose?.(alert)}
          >
            <X className="h-4 w-4" />
            {tCommon('close')}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
