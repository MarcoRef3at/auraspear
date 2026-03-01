'use client'

import { useTranslations } from 'next-intl'
import { Bot, User } from 'lucide-react'
import { formatTimestamp } from '@/lib/utils'
import { MessageRole } from '@/enums'
import type { HuntMessage } from '@/types'
import { ReasoningSteps } from './ReasoningSteps'
import { Button } from '@/components/ui/button'

interface ChatMessageProps {
  message: HuntMessage
}

export function ChatMessage({ message }: ChatMessageProps) {
  const t = useTranslations('hunt')

  if (message.role === MessageRole.SYSTEM) {
    return (
      <div className="flex justify-center px-4 py-2">
        <div className="max-w-md rounded-lg bg-muted/50 px-4 py-2 text-center text-xs text-muted-foreground">
          {message.content}
        </div>
      </div>
    )
  }

  if (message.role === MessageRole.USER) {
    return (
      <div className="flex justify-end gap-3 px-4 py-2">
        <div className="flex max-w-[80%] flex-col items-end gap-1">
          <div className="rounded-2xl rounded-tr-none bg-primary px-4 py-3 text-sm text-primary-foreground shadow-[0_0_12px_hsl(var(--primary)/0.3)]">
            {message.content}
          </div>
          <span className="text-[10px] text-muted-foreground">
            {formatTimestamp(message.timestamp)}
          </span>
        </div>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
          <User className="h-4 w-4 text-primary" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-3 px-4 py-2">
      <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/80 to-primary/40">
        <Bot className="h-4 w-4 text-primary-foreground" />
      </div>
      <div className="flex max-w-[80%] flex-col gap-1">
        <div className="relative overflow-hidden rounded-2xl rounded-tl-none border border-primary/20 bg-card px-4 py-3 text-sm">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
          <div className="relative">
            {message.content}
          </div>
          {message.reasoningSteps && message.reasoningSteps.length > 0 && (
            <div className="mt-3 border-t border-border/50 pt-3">
              <ReasoningSteps steps={message.reasoningSteps} />
            </div>
          )}
          {message.actions && message.actions.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2 border-t border-border/50 pt-3">
              {message.actions.map(action => (
                <Button
                  key={action}
                  variant="outline"
                  size="xs"
                  className="text-xs"
                >
                  {action}
                </Button>
              ))}
            </div>
          )}
        </div>
        <span className="text-[10px] text-muted-foreground">
          {t('aiAssistant')} &middot; {formatTimestamp(message.timestamp)}
        </span>
      </div>
    </div>
  )
}
