'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import {
  LayoutDashboard,
  Bell,
  Crosshair,
  Briefcase,
  Globe,
  Settings,
  Server,
  Search,
} from 'lucide-react'
import { useUIStore } from '@/stores'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'

export function CommandPalette() {
  const t = useTranslations()
  const router = useRouter()
  const { commandPaletteOpen, setCommandPaletteOpen } = useUIStore()

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setCommandPaletteOpen(!commandPaletteOpen)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [commandPaletteOpen, setCommandPaletteOpen])

  function handleSelect(href: string) {
    setCommandPaletteOpen(false)
    router.push(href)
  }

  const pages = [
    { icon: LayoutDashboard, label: t('nav.dashboard'), href: '/dashboard' },
    { icon: Bell, label: t('nav.alerts'), href: '/alerts' },
    { icon: Crosshair, label: t('nav.hunt'), href: '/hunt' },
    { icon: Briefcase, label: t('nav.cases'), href: '/cases' },
    { icon: Globe, label: t('nav.intel'), href: '/intel' },
    { icon: Settings, label: t('nav.tenantConfig'), href: '/admin/tenant' },
    { icon: Server, label: t('nav.systemAdmin'), href: '/admin/system' },
  ]

  return (
    <CommandDialog
      open={commandPaletteOpen}
      onOpenChange={setCommandPaletteOpen}
      title={t('layout.commandPaletteTitle')}
      description={t('layout.commandPaletteDescription')}
    >
      <CommandInput placeholder={t('layout.searchPlaceholder')} />
      <CommandList>
        <CommandEmpty>{t('layout.noResults')}</CommandEmpty>
        <CommandGroup heading={t('layout.pages')}>
          {pages.map(page => (
            <CommandItem
              key={page.href}
              onSelect={() => handleSelect(page.href)}
            >
              <page.icon className="h-4 w-4" />
              <span>{page.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading={t('layout.actions')}>
          <CommandItem onSelect={() => handleSelect('/alerts')}>
            <Search className="h-4 w-4" />
            <span>{t('layout.searchAlerts')}</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
