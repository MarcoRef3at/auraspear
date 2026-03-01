'use client'

import { useTranslations } from 'next-intl'
import { useQueryClient } from '@tanstack/react-query'
import { useTenantStore } from '@/stores'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function TenantSwitcher() {
  const t = useTranslations('layout')
  const queryClient = useQueryClient()
  const { currentTenantId, tenants, setCurrentTenant } = useTenantStore()

  function handleTenantChange(value: string) {
    setCurrentTenant(value)
    queryClient.invalidateQueries().catch(console.error)
  }

  if (tenants.length === 0) {
    return null
  }

  return (
    <Select value={currentTenantId} onValueChange={handleTenantChange}>
      <SelectTrigger size="sm" className="w-[160px]">
        <SelectValue placeholder={t('selectTenant')} />
      </SelectTrigger>
      <SelectContent>
        {tenants.map(tenant => (
          <SelectItem key={tenant.id} value={tenant.id}>
            {tenant.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
