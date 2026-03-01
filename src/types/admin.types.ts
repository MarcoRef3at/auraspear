import type { UserRole, ServiceStatus } from '@/enums'

export interface Tenant {
  id: string
  name: string
  environment: string
  alertCount: number
  userCount: number
  status: string
}

export interface TenantUser {
  id: string
  name: string
  email: string
  role: UserRole
  status: string
  lastLogin: string
  mfaEnabled: boolean
  avatar?: string
}

export interface ServiceHealth {
  id: string
  name: string
  status: ServiceStatus
  uptime: number
  version: string
  lastCheck: string
  eps?: number
  lag?: number
}

export interface AuditLogEntry {
  id: string
  timestamp: string
  actor: string
  action: string
  resource: string
  resourceId: string
  ipAddress: string
  details?: string
}
