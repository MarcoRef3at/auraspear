import { http, HttpResponse } from 'msw'
import { mockAlerts } from '../data/alerts.data'
import type { Alert, AIInvestigation, PaginationMeta } from '@/types'
import type { AlertSeverity, AlertStatus } from '@/enums'

export const alertHandlers = [
  http.get('/api/alerts', ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') ?? '1')
    const limit = Number(url.searchParams.get('limit') ?? '10')
    const severityParam = url.searchParams.get('severity')
    const statusParam = url.searchParams.get('status')
    const query = url.searchParams.get('query')
    const sortBy = url.searchParams.get('sortBy') ?? 'timestamp'
    const sortOrder = url.searchParams.get('sortOrder') ?? 'desc'

    let filtered: Alert[] = [...mockAlerts]

    if (severityParam) {
      const severities = severityParam.split(',') as AlertSeverity[]
      filtered = filtered.filter(alert => severities.includes(alert.severity))
    }

    if (statusParam) {
      const statuses = statusParam.split(',') as AlertStatus[]
      filtered = filtered.filter(alert => statuses.includes(alert.status))
    }

    if (query) {
      const lowerQuery = query.toLowerCase()
      filtered = filtered.filter(
        alert =>
          alert.ruleName.toLowerCase().includes(lowerQuery) ||
          alert.description.toLowerCase().includes(lowerQuery) ||
          alert.agentName.toLowerCase().includes(lowerQuery) ||
          alert.sourceIp.includes(lowerQuery) ||
          alert.destinationIp.includes(lowerQuery)
      )
    }

    filtered.sort((a, b) => {
      const aVal = a[sortBy as keyof Alert] as string
      const bVal = b[sortBy as keyof Alert] as string
      if (sortOrder === 'asc') {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0
      }
      return aVal > bVal ? -1 : aVal < bVal ? 1 : 0
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

  http.get('/api/alerts/:id', ({ params }) => {
    const { id } = params
    const alert = mockAlerts.find(a => a.id === id)

    if (!alert) {
      return HttpResponse.json(
        { error: 'Alert not found' },
        { status: 404 }
      )
    }

    return HttpResponse.json({ data: alert })
  }),

  http.post('/api/alerts/:id/investigate', ({ params }) => {
    const { id } = params
    const alert = mockAlerts.find(a => a.id === String(id))

    if (!alert) {
      return HttpResponse.json(
        { error: 'Alert not found' },
        { status: 404 }
      )
    }

    const investigation: AIInvestigation = {
      alertId: alert.id,
      verdict: alert.severity === 'critical' ? 'True Positive' : 'Likely True Positive',
      confidence: alert.severity === 'critical' ? 92 : 78,
      reasoning: `Analysis of alert "${alert.ruleName}" on ${alert.agentName}: The observed activity from ${alert.sourceIp} to ${alert.destinationIp} matches known attack patterns for ${alert.mitreTechniques.join(', ')}. The timing, frequency, and payload characteristics are consistent with genuine threat activity rather than benign operations. Cross-referencing with threat intelligence feeds shows correlation with recently reported campaigns.`,
      recommendations: [
        `Isolate ${alert.agentName} from the network pending further investigation`,
        `Block source IP ${alert.sourceIp} at the perimeter firewall`,
        'Review logs from adjacent systems for signs of lateral movement',
        'Update detection rules to catch similar patterns with lower latency',
        'Escalate to incident response team if not already engaged',
      ],
      relatedAlerts: mockAlerts
        .filter(
          a =>
            a.id !== alert.id &&
            (a.agentName === alert.agentName || a.sourceIp === alert.sourceIp)
        )
        .slice(0, 3)
        .map(a => a.id),
      mitreTechniques: alert.mitreTechniques,
    }

    return HttpResponse.json({ data: investigation })
  }),
]
