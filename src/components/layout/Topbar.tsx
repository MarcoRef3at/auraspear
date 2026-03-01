'use client'

import { useTranslations } from 'next-intl'
import { PanelLeftOpen, Search } from 'lucide-react'
import { useUIStore } from '@/stores'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { LayoutBreadcrumb } from './Breadcrumb'
import { TenantSwitcher } from './TenantSwitcher'
import { ThemeSwitcher } from './ThemeSwitcher'
import { NotificationBell } from './NotificationBell'
import { UserMenu } from './UserMenu'

export function Topbar() {
  const t = useTranslations('layout')
  const { sidebarCollapsed, toggleSidebar, setCommandPaletteOpen } = useUIStore()

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-border bg-background/90 px-4 backdrop-blur-md">
      {sidebarCollapsed && (
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={toggleSidebar}
          aria-label={t('expandSidebar')}
        >
          <PanelLeftOpen className="h-4 w-4 text-muted-foreground" />
        </Button>
      )}

      <LayoutBreadcrumb />

      <div className="flex flex-1 items-center justify-center">
        <Button
          variant="outline"
          size="sm"
          className="w-64 justify-start gap-2 text-muted-foreground"
          onClick={() => setCommandPaletteOpen(true)}
        >
          <Search className="h-3.5 w-3.5" />
          <span className="flex-1 text-start text-xs">{t('searchPlaceholder')}</span>
          <kbd className="pointer-events-none hidden rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline-block">
            ⌘K
          </kbd>
        </Button>
      </div>

      <div className="flex items-center gap-1">
        <TenantSwitcher />
        <ThemeSwitcher />
        <NotificationBell />
        <Separator orientation="vertical" className="mx-1 h-6" />
        <UserMenu />
      </div>
    </header>
  )
}
