'use client'

import { PanelLeftOpen, Search } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useUIStore } from '@/stores'
import { LayoutBreadcrumb } from './Breadcrumb'
import { LanguageSwitcher } from './LanguageSwitcher'
import { NotificationBell } from './NotificationBell'
import { TenantSwitcher } from './TenantSwitcher'
import { ThemeSwitcher } from './ThemeSwitcher'
import { UserMenu } from './UserMenu'

export function Topbar() {
  const t = useTranslations('layout')
  const { sidebarCollapsed, toggleSidebar, setCommandPaletteOpen } = useUIStore()

  return (
    <header className="border-border bg-background/90 sticky top-0 z-30 flex h-14 items-center gap-4 border-b px-4 backdrop-blur-md">
      {sidebarCollapsed && (
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={toggleSidebar}
          aria-label={t('expandSidebar')}
        >
          <PanelLeftOpen className="text-muted-foreground h-4 w-4" />
        </Button>
      )}

      <LayoutBreadcrumb />

      <div className="flex flex-1 items-center justify-center">
        <Button
          variant="outline"
          size="sm"
          className="text-muted-foreground w-64 justify-start gap-2"
          onClick={() => setCommandPaletteOpen(true)}
        >
          <Search className="h-3.5 w-3.5" />
          <span className="flex-1 text-start text-xs">{t('searchPlaceholder')}</span>
          <kbd className="border-border bg-muted text-muted-foreground pointer-events-none hidden rounded border px-1.5 py-0.5 text-[10px] font-medium sm:inline-block">
            ⌘K
          </kbd>
        </Button>
      </div>

      <div className="flex items-center gap-1">
        <LanguageSwitcher />
        <TenantSwitcher />
        <ThemeSwitcher />
        <NotificationBell />
        <Separator orientation="vertical" className="mx-1 h-6" />
        <UserMenu />
      </div>
    </header>
  )
}
