import api from '@/lib/api'
import type { ApiResponse, Case, CreateCaseInput } from '@/types'

interface CaseSearchParams {
  page?: number
  limit?: number
  status?: string
  severity?: string
  query?: string
}

export const caseService = {
  getCases: (params?: CaseSearchParams) =>
    api.get<ApiResponse<Case[]>>('/cases', { params }).then(r => r.data),

  getCase: (id: string) => api.get<ApiResponse<Case>>(`/cases/${id}`).then(r => r.data),

  createCase: (data: CreateCaseInput) =>
    api.post<ApiResponse<Case>>('/cases', data).then(r => r.data),

  updateCase: (id: string, data: Partial<CreateCaseInput>) =>
    api.patch<ApiResponse<Case>>(`/cases/${id}`, data).then(r => r.data),
}
