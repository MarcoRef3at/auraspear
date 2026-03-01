'use client'

import { useTranslations } from 'next-intl'
import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ThemeSwitcher() {
  const t = useTranslations('common')
  const { theme, setTheme } = useTheme()

  const isDark = theme === 'dark'

  function handleToggle() {
    setTheme(isDark ? 'light' : 'dark')
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      aria-label={isDark ? t('lightMode') : t('darkMode')}
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-muted-foreground" />
      ) : (
        <Moon className="h-4 w-4 text-muted-foreground" />
      )}
    </Button>
  )
}
