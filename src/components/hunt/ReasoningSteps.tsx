'use client'

import { CheckCircle2, Loader2, Circle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ReasoningStepStatus } from '@/enums'
import type { ReasoningStep } from '@/types'

interface ReasoningStepsProps {
  steps: ReasoningStep[]
}

const stepConfig = {
  [ReasoningStepStatus.COMPLETED]: {
    icon: CheckCircle2,
    iconClass: 'text-status-success',
    textClass: 'text-foreground',
    animate: false,
  },
  [ReasoningStepStatus.IN_PROGRESS]: {
    icon: Loader2,
    iconClass: 'text-status-info',
    textClass: 'text-status-info',
    animate: true,
  },
  [ReasoningStepStatus.PENDING]: {
    icon: Circle,
    iconClass: 'text-muted-foreground/50',
    textClass: 'text-muted-foreground',
    animate: false,
  },
  [ReasoningStepStatus.ERROR]: {
    icon: Circle,
    iconClass: 'text-status-error',
    textClass: 'text-status-error',
    animate: false,
  },
} as const

export function ReasoningSteps({ steps }: ReasoningStepsProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {steps.map(step => {
        const config = stepConfig[step.status]
        const Icon = config.icon

        return (
          <div key={step.id} className="flex items-center gap-2">
            <Icon
              className={cn(
                'h-3.5 w-3.5 shrink-0',
                config.iconClass,
                config.animate && 'animate-spin'
              )}
            />
            <span className={cn('text-xs', config.textClass)}>
              {step.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
