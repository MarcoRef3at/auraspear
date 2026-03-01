'use client'

import { useTranslations } from 'next-intl'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { CaseTaskStatus } from '@/enums'
import type { CaseTask } from '@/types'

interface CaseTaskListProps {
  tasks: CaseTask[]
  onToggleTask?: (taskId: string, completed: boolean) => void
}

export function CaseTaskList({ tasks, onToggleTask }: CaseTaskListProps) {
  const t = useTranslations('cases')

  const completedCount = tasks.filter(
    task => task.status === CaseTaskStatus.COMPLETED
  ).length
  const totalCount = tasks.length
  const progressValue = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {t('tasksCompleted', { completed: completedCount, total: totalCount })}
          </span>
          <span className="font-mono text-xs text-muted-foreground">
            {Math.round(progressValue)}%
          </span>
        </div>
        <Progress value={progressValue} />
      </div>

      <div className="flex flex-col gap-2">
        {tasks.map(task => {
          const isCompleted = task.status === CaseTaskStatus.COMPLETED

          return (
            <label
              key={task.id}
              className="flex cursor-pointer items-center gap-3 rounded-lg border border-border px-3 py-2.5 transition-colors hover:bg-muted/50"
            >
              <Checkbox
                checked={isCompleted}
                onCheckedChange={checked => {
                  onToggleTask?.(task.id, Boolean(checked))
                }}
              />
              <div className="flex flex-1 items-center justify-between gap-2">
                <span
                  className={
                    isCompleted
                      ? 'text-sm text-muted-foreground line-through'
                      : 'text-sm'
                  }
                >
                  {task.title}
                </span>
                {task.assignee && (
                  <span className="text-xs text-muted-foreground">
                    {task.assignee}
                  </span>
                )}
              </div>
            </label>
          )
        })}

        {tasks.length === 0 && (
          <p className="py-4 text-center text-sm text-muted-foreground">
            {t('noTasks')}
          </p>
        )}
      </div>
    </div>
  )
}
