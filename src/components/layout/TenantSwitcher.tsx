'use client'

import { useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useQueryClient } from '@tanstack/react-query'
import { useTenantStore } from '@/stores'
import { useTenants } from '@/hooks'
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
  const { currentTenantId, tenants, setCurrentTenant, setTenants } = useTenantStore()

  const { data: tenantsData } = useTenants()

  useEffect(() => {
    if (tenantsData?.data && tenantsData.data.length > 0) {
      setTenants(tenantsData.data)
    }
  }, [tenantsData?.data, setTenants])

  function handleTenantChange(value: string) {
    setCurrentTenant(value)
    void queryClient.invalidateQueries()
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
