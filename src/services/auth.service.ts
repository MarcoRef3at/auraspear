import api from '@/lib/api'
import type { ApiResponse } from '@/types'

interface AuthUser {
  id: string
  name: string
  email: string
  role: string
  tenantId: string
}

interface LoginResponse {
  token: string
  user: AuthUser
}

export const authService = {
  login: (email: string, password: string) =>
    api.post<ApiResponse<LoginResponse>>('/auth/login', { email, password }).then(r => r.data),

  logout: () => api.post<ApiResponse<null>>('/auth/logout').then(r => r.data),

  getMe: () => api.get<ApiResponse<AuthUser>>('/auth/me').then(r => r.data),
}
