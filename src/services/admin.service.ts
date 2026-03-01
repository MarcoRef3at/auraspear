import api from '@/lib/api'
import type { ApiResponse, Tenant, TenantUser, ServiceHealth, AuditLogEntry } from '@/types'

interface AuditLogParams {
  page?: number
  limit?: number
  actor?: string
  action?: string
}

export interface CreateTenantInput {
  name: string
  environment: string
}

export const adminService = {
  getTenants: () =>
    api.get<ApiResponse<Tenant[]>>('/admin/tenants').then(r => r.data),

  createTenant: (data: CreateTenantInput) =>
    api.post<ApiResponse<Tenant>>('/admin/tenants', data).then(r => r.data),

  getUsers: (tenantId: string) =>
    api.get<ApiResponse<TenantUser[]>>(`/admin/tenants/${tenantId}/users`).then(r => r.data),

  getServiceHealth: () =>
    api.get<ApiResponse<ServiceHealth[]>>('/admin/health').then(r => r.data),

  getAuditLogs: (params?: AuditLogParams) =>
    api.get<ApiResponse<AuditLogEntry[]>>('/admin/audit-logs', { params }).then(r => r.data),
}
