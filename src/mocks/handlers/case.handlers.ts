import { http, HttpResponse } from 'msw'
import type { CaseStatus, CaseSeverity } from '@/enums'
import type { Case, PaginationMeta } from '@/types'
import { mockCases } from '../data/cases.data'

let cases = [...mockCases]

export const caseHandlers = [
  http.get('/api/cases', ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') ?? '1')
    const limit = Number(url.searchParams.get('limit') ?? '10')
    const statusParam = url.searchParams.get('status')
    const severityParam = url.searchParams.get('severity')
    const query = url.searchParams.get('query')

    let filtered: Case[] = [...cases]

    if (statusParam) {
      const statuses = statusParam.split(',') as CaseStatus[]
      filtered = filtered.filter(c => statuses.includes(c.status))
    }

    if (severityParam) {
      const severities = severityParam.split(',') as CaseSeverity[]
      filtered = filtered.filter(c => severities.includes(c.severity))
    }

    if (query) {
      const lowerQuery = query.toLowerCase()
      filtered = filtered.filter(
        c =>
          c.title.toLowerCase().includes(lowerQuery) ||
          c.description.toLowerCase().includes(lowerQuery) ||
          c.caseNumber.toLowerCase().includes(lowerQuery) ||
          c.assignee.toLowerCase().includes(lowerQuery)
      )
    }

    filtered.sort((a, b) => {
      const aDate = new Date(a.updatedAt).getTime()
      const bDate = new Date(b.updatedAt).getTime()
      return bDate - aDate
    })

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

  http.get('/api/cases/:id', ({ params }) => {
    const { id } = params
    const foundCase = cases.find(c => c.id === id)

    if (!foundCase) {
      return HttpResponse.json({ error: 'Case not found' }, { status: 404 })
    }

    return HttpResponse.json({ data: foundCase })
  }),

  http.post('/api/cases', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>
    const now = new Date().toISOString()
    const caseNumber = `SOC-2026-${String(cases.length + 1).padStart(3, '0')}`

    const newCase: Case = {
      id: `case-${String(cases.length + 1).padStart(3, '0')}`,
      caseNumber,
      title: body['title'] as string,
      description: body['description'] as string,
      status: 'open' as Case['status'],
      severity: body['severity'] as Case['severity'],
      assignee: body['assignee'] as string,
      createdAt: now,
      updatedAt: now,
      linkedAlertIds: (body['linkedAlertIds'] as string[] | undefined) ?? [],
      timeline: [
        {
          id: `tl-${Date.now()}`,
          timestamp: now,
          type: 'creation',
          actor: 'Current User',
          description: `Case ${caseNumber} created`,
        },
      ],
      tasks: [],
      artifacts: [],
      tenantId: 'tenant-001',
    }

    cases = [newCase, ...cases]

    return HttpResponse.json({ data: newCase }, { status: 201 })
  }),

  http.patch('/api/cases/:id', async ({ params, request }) => {
    const { id } = params
    const body = (await request.json()) as Record<string, unknown>
    const caseIndex = cases.findIndex(c => c.id === id)

    if (caseIndex === -1) {
      return HttpResponse.json({ error: 'Case not found' }, { status: 404 })
    }

    const existingCase = cases[caseIndex]
    if (!existingCase) {
      return HttpResponse.json({ error: 'Case not found' }, { status: 404 })
    }

    const now = new Date().toISOString()
    const updatedCase: Case = {
      ...existingCase,
      ...body,
      updatedAt: now,
      timeline: [
        ...existingCase.timeline,
        {
          id: `tl-${Date.now()}`,
          timestamp: now,
          type: 'update',
          actor: 'Current User',
          description: `Case updated: ${Object.keys(body).join(', ')} modified`,
        },
      ],
    }

    if (body['status'] === 'closed') {
      updatedCase.closedAt = now
    }

    cases[caseIndex] = updatedCase

    return HttpResponse.json({ data: updatedCase })
  }),
]
