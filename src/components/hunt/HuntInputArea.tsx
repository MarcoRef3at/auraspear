'use client'

import { useState, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { Send } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

interface HuntInputAreaProps {
  onSend: (message: string) => void
  disabled?: boolean
}

const QUICK_PROMPT_KEYS = [
  'detectBruteForce',
  'findLateralMovement',
  'checkDataExfiltration',
  'suspiciousProcesses',
] as const

export function HuntInputArea({ onSend, disabled = false }: HuntInputAreaProps) {
  const t = useTranslations('hunt')
  const [value, setValue] = useState('')

  const handleSend = useCallback(() => {
    const trimmed = value.trim()
    if (trimmed.length === 0) return
    onSend(trimmed)
    setValue('')
  }, [value, onSend])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSend()
      }
    },
    [handleSend]
  )

  const handleQuickPrompt = useCallback(
    (key: (typeof QUICK_PROMPT_KEYS)[number]) => {
      const prompt = t(`quickPrompts.${key}`)
      onSend(prompt)
    },
    [onSend, t]
  )

  return (
    <div className="flex flex-col gap-3 border-t border-border bg-card/50 p-4">
      <div className="flex gap-2">
        <Textarea
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t('inputPlaceholder')}
          disabled={disabled}
          className="min-h-10 max-h-32 resize-none"
        />
        <Button
          onClick={handleSend}
          disabled={disabled || value.trim().length === 0}
          className="shrink-0 shadow-[0_0_12px_hsl(var(--primary)/0.4)] transition-shadow hover:shadow-[0_0_20px_hsl(var(--primary)/0.6)]"
          size="icon"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {QUICK_PROMPT_KEYS.map(key => (
          <button
            key={key}
            type="button"
            onClick={() => handleQuickPrompt(key)}
            disabled={disabled}
            className="rounded-full border border-border bg-muted/50 px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:bg-primary/10 hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
          >
            {t(`quickPrompts.${key}`)}
          </button>
        ))}
      </div>
    </div>
  )
}
