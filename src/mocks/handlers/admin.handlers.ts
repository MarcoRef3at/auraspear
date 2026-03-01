import { http, HttpResponse } from 'msw'
import {
  mockTenants,
  mockUsers,
  mockServiceHealth,
  mockAuditLogs,
} from '../data/admin.data'
import type { TenantUser, AuditLogEntry, PaginationMeta } from '@/types'
import type { UserRole } from '@/enums'

export const adminHandlers = [
  http.get('/api/admin/tenants', () => {
    return HttpResponse.json({ data: mockTenants })
  }),

  http.post('/api/admin/tenants', async ({ request }) => {
    const body = (await request.json()) as { name: string; environment: string }
    const newTenant = {
      id: `tenant-${String(mockTenants.length + 1).padStart(3, '0')}`,
      name: body.name,
      environment: body.environment,
      alertCount: 0,
      userCount: 0,
      status: 'active',
    }
    mockTenants.push(newTenant)
    return HttpResponse.json({ data: newTenant }, { status: 201 })
  }),

  http.get('/api/admin/tenants/:tenantId/users', ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') ?? '1')
    const limit = Number(url.searchParams.get('limit') ?? '10')
    const role = url.searchParams.get('role')
    const status = url.searchParams.get('status')
    const query = url.searchParams.get('query')

    let filtered: TenantUser[] = [...mockUsers]

    if (role) {
      const roles = role.split(',') as UserRole[]
      filtered = filtered.filter(user => roles.includes(user.role))
    }

    if (status) {
      const statuses = status.split(',')
      filtered = filtered.filter(user => statuses.includes(user.status))
    }

    if (query) {
      const lowerQuery = query.toLowerCase()
      filtered = filtered.filter(
        user =>
          user.name.toLowerCase().includes(lowerQuery) ||
          user.email.toLowerCase().includes(lowerQuery)
      )
    }

    const total = filtered.length
    const totalPages = Math.ceil(total / limit)
    const start = (page - 1) * limit
    const paginatedData = filtered.slice(start, start + limit)

    const pagination: PaginationMeta = {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    }

    return HttpResponse.json({ data: paginatedData, pagination })
  }),

  http.get('/api/admin/service-health', () => {
    return HttpResponse.json({ data: mockServiceHealth })
  }),

  http.get('/api/admin/audit-logs', ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') ?? '1')
    const limit = Number(url.searchParams.get('limit') ?? '10')
    const action = url.searchParams.get('action')
    const actor = url.searchParams.get('actor')
    const query = url.searchParams.get('query')

    let filtered: AuditLogEntry[] = [...mockAuditLogs]

    if (action) {
      const actions = action.split(',')
      filtered = filtered.filter(log => actions.includes(log.action))
    }

    if (actor) {
      filtered = filtered.filter(log =>
        log.actor.toLowerCase().includes(actor.toLowerCase())
      )
    }

    if (query) {
      const lowerQuery = query.toLowerCase()
      filtered = filtered.filter(
        log =>
          (log.details?.toLowerCase().includes(lowerQuery) ?? false) ||
          log.action.toLowerCase().includes(lowerQuery) ||
          log.actor.toLowerCase().includes(lowerQuery) ||
          log.resource.toLowerCase().includes(lowerQuery)
      )
    }

    const total = filtered.length
    const totalPages = Math.ceil(total / limit)
    const start = (page - 1) * limit
    const paginatedData = filtered.slice(start, start + limit)

    const pagination: PaginationMeta = {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    }

    return HttpResponse.json({ data: paginatedData, pagination })
  }),
]
