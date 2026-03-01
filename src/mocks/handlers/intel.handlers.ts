import { http, HttpResponse } from 'msw'
import { mockMISPEvents, mockIOCCorrelations } from '../data/intel.data'
import type { MISPEvent, IOCCorrelation, PaginationMeta } from '@/types'

export const intelHandlers = [
  http.get('/api/intel/misp-events', ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') ?? '1')
    const limit = Number(url.searchParams.get('limit') ?? '10')
    const threatLevel = url.searchParams.get('threatLevel')
    const query = url.searchParams.get('query')

    let filtered: MISPEvent[] = [...mockMISPEvents]

    if (threatLevel) {
      const levels = threatLevel.split(',')
      filtered = filtered.filter(event => levels.includes(event.threatLevel))
    }

    if (query) {
      const lowerQuery = query.toLowerCase()
      filtered = filtered.filter(
        event =>
          event.info.toLowerCase().includes(lowerQuery) ||
          event.organization.toLowerCase().includes(lowerQuery) ||
          event.tags.some(tag => tag.name.toLowerCase().includes(lowerQuery))
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

  http.get('/api/intel/ioc-search', ({ request }) => {
    const url = new URL(request.url)
    const query = url.searchParams.get('query')
    const iocType = url.searchParams.get('type')

    let filtered: IOCCorrelation[] = [...mockIOCCorrelations]

    if (query) {
      const lowerQuery = query.toLowerCase()
      filtered = filtered.filter(ioc =>
        ioc.iocValue.toLowerCase().includes(lowerQuery)
      )
    }

    if (iocType) {
      const types = iocType.split(',')
      filtered = filtered.filter(ioc => types.includes(ioc.iocType))
    }

    return HttpResponse.json({ data: filtered })
  }),

  http.get('/api/intel/correlations', ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') ?? '1')
    const limit = Number(url.searchParams.get('limit') ?? '10')
    const severity = url.searchParams.get('severity')

    let filtered: IOCCorrelation[] = [...mockIOCCorrelations]

    if (severity) {
      const severities = severity.split(',')
      filtered = filtered.filter(ioc => severities.includes(ioc.severity))
    }

    filtered.sort((a, b) => b.hitCount - a.hitCount)

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
