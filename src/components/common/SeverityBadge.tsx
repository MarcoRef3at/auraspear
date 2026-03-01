'use client'

import { Badge } from '@/components/ui/badge'
import { AlertSeverity, CaseSeverity } from '@/enums'
import { cn } from '@/lib/utils'
import { SEVERITY_TEXT_CLASSES, SEVERITY_BG_CLASSES, SEVERITY_BORDER_CLASSES } from '@/lib/constants'

interface SeverityBadgeProps {
  severity: AlertSeverity | CaseSeverity
}

function getSeverityKey(severity: AlertSeverity | CaseSeverity): keyof typeof SEVERITY_TEXT_CLASSES {
  return severity as keyof typeof SEVERITY_TEXT_CLASSES
}

export function SeverityBadge({ severity }: SeverityBadgeProps) {
  const key = getSeverityKey(severity)
  const textClass = SEVERITY_TEXT_CLASSES[key] ?? 'text-severity-info'
  const bgClass = SEVERITY_BG_CLASSES[key] ?? 'bg-severity-info'
  const borderClass = SEVERITY_BORDER_CLASSES[key] ?? 'border-severity-info'

  return (
    <Badge
      variant="outline"
      className={cn('gap-1.5 border', textClass, bgClass, borderClass)}
    >
      <span
        className={cn('inline-block h-1.5 w-1.5 rounded-full')}
        style={{ backgroundColor: `var(--severity-${severity})` }}
      />
      <span className="capitalize">{severity}</span>
    </Badge>
  )
}
