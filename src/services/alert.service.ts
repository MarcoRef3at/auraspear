import api from '@/lib/api'
import type { ApiResponse, Alert, AlertSearchParams, AIInvestigation } from '@/types'

export const alertService = {
  getAlerts: (params?: AlertSearchParams) =>
    api.get<ApiResponse<Alert[]>>('/alerts', { params }).then(r => r.data),

  getAlertById: (id: string) => api.get<ApiResponse<Alert>>(`/alerts/${id}`).then(r => r.data),

  investigateAlert: (id: string) =>
    api.post<ApiResponse<AIInvestigation>>(`/alerts/${id}/investigate`).then(r => r.data),
}
