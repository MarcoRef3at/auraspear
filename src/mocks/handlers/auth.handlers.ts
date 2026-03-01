import { http, HttpResponse } from 'msw'
import { mockUsers } from '../data/admin.data'

const currentUser = mockUsers[0]

export const authHandlers = [
  http.post('/api/auth/login', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>
    const email = body['email'] as string | undefined
    const password = body['password'] as string | undefined

    if (!email || !password) {
      return HttpResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const user = mockUsers.find(u => u.email === email)

    if (!user) {
      return HttpResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    return HttpResponse.json({
      data: {
        token: 'mock-jwt-token-auraspear-soc-2026',
        refreshToken: 'mock-refresh-token-auraspear-soc-2026',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
        },
      },
    })
  }),

  http.post('/api/auth/logout', () => {
    return HttpResponse.json({ data: { message: 'Logged out successfully' } })
  }),

  http.get('/api/auth/me', () => {
    if (!currentUser) {
      return HttpResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    return HttpResponse.json({
      data: {
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
        role: currentUser.role,
        avatar: currentUser.avatar,
        mfaEnabled: currentUser.mfaEnabled,
        lastLogin: currentUser.lastLogin,
      },
    })
  }),
]
