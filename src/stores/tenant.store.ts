import { create } from 'zustand'
import type { Tenant } from '@/types'

interface TenantState {
  currentTenantId: string
  tenants: Tenant[]
  setCurrentTenant: (id: string) => void
  setTenants: (tenants: Tenant[]) => void
}

export const useTenantStore = create<TenantState>(set => ({
  currentTenantId: 'tenant-001',
  tenants: [],
  setCurrentTenant: id => set({ currentTenantId: id }),
  setTenants: tenants => set({ tenants }),
}))
