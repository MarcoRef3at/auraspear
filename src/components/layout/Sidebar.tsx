'use client'

import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import {
  LayoutDashboard,
  Bell,
  Crosshair,
  Briefcase,
  Globe,
  Settings,
  Server,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/stores'
import { Button } from '@/components/ui/button'
import { BrandLogo } from './BrandLogo'
import { SidebarNavItem } from './SidebarNavItem'
import { SidebarHealthFooter } from './SidebarHealthFooter'

interface NavSection {
  label: string
  items: Array<{
    icon: typeof LayoutDashboard
    label: string
    href: string
    badge?: number
  }>
}

export function Sidebar() {
  const pathname = usePathname()
  const t = useTranslations()
  const { sidebarCollapsed, toggleSidebar } = useUIStore()

  const sections: NavSection[] = [
    {
      label: t('nav.main'),
      items: [
        { icon: LayoutDashboard, label: t('nav.dashboard'), href: '/dashboard' },
        { icon: Bell, label: t('nav.alerts'), href: '/alerts' },
        { icon: Crosshair, label: t('nav.hunt'), href: '/hunt' },
        { icon: Briefcase, label: t('nav.cases'), href: '/cases' },
      ],
    },
    {
      label: t('nav.intelligence'),
      items: [
        { icon: Globe, label: t('nav.intel'), href: '/intel' },
      ],
    },
    {
      label: t('nav.system'),
      items: [
        { icon: Settings, label: t('nav.tenantConfig'), href: '/admin/tenant' },
        { icon: Server, label: t('nav.systemAdmin'), href: '/admin/system' },
      ],
    },
  ]

  return (
    <aside
      className={cn(
        'flex h-screen flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300',
        sidebarCollapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className={cn(
        'flex items-center border-b border-sidebar-border p-4',
        sidebarCollapsed ? 'justify-center' : 'justify-between'
      )}>
        <BrandLogo collapsed={sidebarCollapsed} />
        {!sidebarCollapsed && (
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={toggleSidebar}
            aria-label={t('layout.collapseSidebar')}
          >
            <PanelLeftClose className="h-4 w-4 text-muted-foreground" />
          </Button>
        )}
      </div>

      {sidebarCollapsed && (
        <div className="flex justify-center py-3">
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={toggleSidebar}
            aria-label={t('layout.expandSidebar')}
          >
            <PanelLeftOpen className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
      )}

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-6">
          {sections.map(section => (
            <div key={section.label}>
              {!sidebarCollapsed && (
                <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {section.label}
                </h3>
              )}
              <div className="space-y-1">
                {section.items.map(item => (
                  <SidebarNavItem
                    key={item.href}
                    icon={item.icon}
                    label={item.label}
                    href={item.href}
                    active={pathname.startsWith(item.href)}
                    badge={item.badge}
                    collapsed={sidebarCollapsed}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </nav>

      <SidebarHealthFooter collapsed={sidebarCollapsed} />
    </aside>
  )
}
