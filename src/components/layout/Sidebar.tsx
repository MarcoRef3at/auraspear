'use client'

import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Bell,
  Crosshair,
  Briefcase,
  Globe,
  Settings,
  Server,
  Plug,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/stores'
import { BrandLogo } from './BrandLogo'
import { SidebarHealthFooter } from './SidebarHealthFooter'
import { SidebarNavItem } from './SidebarNavItem'

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
      items: [{ icon: Globe, label: t('nav.intel'), href: '/intel' }],
    },
    {
      label: t('nav.system'),
      items: [
        { icon: Plug, label: t('nav.connectors'), href: '/connectors' },
        { icon: Settings, label: t('nav.tenantConfig'), href: '/admin/tenant' },
        { icon: Server, label: t('nav.systemAdmin'), href: '/admin/system' },
      ],
    },
  ]

  return (
    <aside
      className={cn(
        'border-sidebar-border bg-sidebar flex h-screen flex-col border-r transition-all duration-300',
        sidebarCollapsed ? 'w-16' : 'w-64'
      )}
    >
      <div
        className={cn(
          'border-sidebar-border flex items-center border-b p-4',
          sidebarCollapsed ? 'justify-center' : 'justify-between'
        )}
      >
        <BrandLogo collapsed={sidebarCollapsed} />
        {!sidebarCollapsed && (
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={toggleSidebar}
            aria-label={t('layout.collapseSidebar')}
          >
            <PanelLeftClose className="text-muted-foreground h-4 w-4" />
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
            <PanelLeftOpen className="text-muted-foreground h-4 w-4" />
          </Button>
        </div>
      )}

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-6">
          {sections.map(section => (
            <div key={section.label}>
              {!sidebarCollapsed && (
                <h3 className="text-muted-foreground mb-2 px-3 text-xs font-semibold tracking-wider uppercase">
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
