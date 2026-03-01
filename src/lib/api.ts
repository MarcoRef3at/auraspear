import axios from 'axios'

const api = axios.create({
  baseURL: process.env['NEXT_PUBLIC_API_URL'] ?? '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(config => {
  const tenantId = typeof window !== 'undefined'
    ? localStorage.getItem('currentTenantId') ?? 'tenant-1'
    : 'tenant-1'
  config.headers['X-Tenant-Id'] = tenantId
  return config
})

api.interceptors.response.use(
  response => response,
  error => {
    if (error?.response?.status === 401) {
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api
