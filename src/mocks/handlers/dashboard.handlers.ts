import { http, HttpResponse } from 'msw'
import {
  mockKPIs,
  mockAlertTrends,
  mockMITRETechniques,
  mockAssetRisks,
  mockPipelineServices,
} from '../data/dashboard.data'

export const dashboardHandlers = [
  http.get('/api/dashboard/kpis', () => {
    return HttpResponse.json({ data: mockKPIs })
  }),

  http.get('/api/dashboard/alert-trends', () => {
    return HttpResponse.json({ data: mockAlertTrends })
  }),

  http.get('/api/dashboard/mitre-stats', () => {
    return HttpResponse.json({ data: mockMITRETechniques })
  }),

  http.get('/api/dashboard/asset-risks', () => {
    return HttpResponse.json({ data: mockAssetRisks })
  }),

  http.get('/api/dashboard/pipeline-health', () => {
    return HttpResponse.json({ data: mockPipelineServices })
  }),
]
