'use client'

import { useTranslations } from 'next-intl'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { AlertSeverity } from '@/enums'
import { cn } from '@/lib/utils'

interface SeverityCount {
  severity: AlertSeverity
  count: number
}

interface AlertFilterSidebarProps {
  timeRange: string
  onTimeRangeChange: (range: string) => void
  selectedSeverities: AlertSeverity[]
  onSeverityChange: (severities: AlertSeverity[]) => void
  severityCounts: SeverityCount[]
  agentFilter: string
  onAgentFilterChange: (value: string) => void
  ruleGroup: string
  onRuleGroupChange: (value: string) => void
}

const TIME_RANGES = ['24h', '7d', '30d'] as const

function getSeverityDotClass(severity: AlertSeverity): string {
  switch (severity) {
    case AlertSeverity.CRITICAL:
      return 'bg-status-error'
    case AlertSeverity.HIGH:
      return 'bg-status-warning'
    case AlertSeverity.MEDIUM:
      return 'bg-status-info'
    case AlertSeverity.LOW:
      return 'bg-status-success'
    case AlertSeverity.INFO:
      return 'bg-status-neutral'
  }
}

export function AlertFilterSidebar({
  timeRange,
  onTimeRangeChange,
  selectedSeverities,
  onSeverityChange,
  severityCounts,
  agentFilter,
  onAgentFilterChange,
  ruleGroup,
  onRuleGroupChange,
}: AlertFilterSidebarProps) {
  const t = useTranslations('alerts')
  const tCommon = useTranslations('common')

  const handleSeverityToggle = (severity: AlertSeverity) => {
    if (selectedSeverities.includes(severity)) {
      onSeverityChange(selectedSeverities.filter((s) => s !== severity))
    } else {
      onSeverityChange([...selectedSeverities, severity])
    }
  }

  return (
    <aside className="w-64 shrink-0 space-y-6">
      <div>
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
          {t('timeRange')}
        </h3>
        <div className="flex gap-1">
          {TIME_RANGES.map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? 'default' : 'outline'}
              size="sm"
              onClick={() => onTimeRangeChange(range)}
            >
              {range}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
          {t('filterBySeverity')}
        </h3>
        <div className="space-y-2">
          {severityCounts.map(({ severity, count }) => (
            <div key={severity} className="flex items-center gap-2">
              <Checkbox
                id={`severity-${severity}`}
                checked={selectedSeverities.includes(severity)}
                onCheckedChange={() => handleSeverityToggle(severity)}
              />
              <Label
                htmlFor={`severity-${severity}`}
                className="flex flex-1 items-center gap-2 cursor-pointer text-sm"
              >
                <span
                  className={cn('h-2 w-2 rounded-full shrink-0', getSeverityDotClass(severity))}
                />
                <span className="capitalize">{severity}</span>
                <span className="ms-auto text-xs text-muted-foreground tabular-nums">
                  {count}
                </span>
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
          {t('filterByAgent')}
        </h3>
        <div className="relative">
          <Search className="absolute start-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={agentFilter}
            onChange={(e) => onAgentFilterChange(e.target.value)}
            placeholder={tCommon('search')}
            className="ps-8 text-sm"
          />
        </div>
      </div>

      <div>
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
          {t('ruleGroup')}
        </h3>
        <Input
          value={ruleGroup}
          onChange={(e) => onRuleGroupChange(e.target.value)}
          placeholder={tCommon('filter')}
          className="text-sm"
        />
      </div>
    </aside>
  )
}
