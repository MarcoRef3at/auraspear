'use client'

import { useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { Bot } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { HuntMessage } from '@/types'
import { ChatMessage } from './ChatMessage'
import { HuntInputArea } from './HuntInputArea'

interface HuntChatPanelProps {
  messages: HuntMessage[]
  onSend: (message: string) => void
  disabled?: boolean
}

export function HuntChatPanel({ messages, onSend, disabled = false }: HuntChatPanelProps) {
  const t = useTranslations('hunt')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="flex w-[450px] shrink-0 flex-col border-e border-border">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-primary/80 to-primary/40">
          <Bot className="h-3.5 w-3.5 text-primary-foreground" />
        </div>
        <h2 className="text-sm font-semibold">{t('chatTitle')}</h2>
      </div>

      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-1 py-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Bot className="h-6 w-6 text-primary" />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium">{t('emptyTitle')}</p>
                <p className="text-xs text-muted-foreground">{t('emptyDescription')}</p>
              </div>
            </div>
          )}
          {messages.map(message => (
            <ChatMessage key={message.id} message={message} />
          ))}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      <HuntInputArea onSend={onSend} disabled={disabled} />
    </div>
  )
}
