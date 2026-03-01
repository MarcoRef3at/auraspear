'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Toast } from '@/components/common/Toast'
import { copyToClipboard } from '@/lib/utils'

interface CopyButtonProps {
  value: string
  label?: string
}

export function CopyButton({ value, label }: CopyButtonProps) {
  const t = useTranslations('common')
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await copyToClipboard(value)
      setCopied(true)
      Toast.success(t('copied'))
      setTimeout(() => setCopied(false), 2000)
    } catch {
      Toast.error(t('copyId'))
    }
  }

  return (
    <Button variant="ghost" size="icon-xs" onClick={handleCopy} aria-label={label ?? t('copyId')}>
      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
    </Button>
  )
}
