jest.mock('next/server', () => ({
  NextResponse: {
    json: (body: unknown, init?: { status?: number }) => ({
      status: init?.status ?? 200,
      json: async () => body,
    }),
  },
}))

import { GET } from './route'

jest.mock('@/registry', () => ({
  Registry: {
    getDashboardData: jest.fn(),
    getCurrentUser: jest.fn(),
  },
}))

const { Registry } = require('@/registry') as {
  Registry: {
    getDashboardData: jest.Mock
    getCurrentUser: jest.Mock
  }
}

describe('GET /api/dashboard', () => {
  it('returns dashboard data for provided userId', async () => {
    const data = { concepts: [], stats: { total: 0 } }
    Registry.getCurrentUser.mockResolvedValueOnce({ userId: null })
    Registry.getDashboardData.mockResolvedValueOnce(data)

    const request = new Request(
      'http://localhost/api/dashboard?userId=user-123',
    )
    const response = await GET(request)
    const json = await response.json()

    expect(Registry.getDashboardData).toHaveBeenCalledWith('user-123')
    expect(json).toEqual(data)
    expect(response.status).toBe(200)
  })

  it('uses session userId when available', async () => {
    const data = { concepts: [], stats: { total: 0 } }
    Registry.getCurrentUser.mockResolvedValueOnce({ userId: 'session-user' })
    Registry.getDashboardData.mockResolvedValueOnce(data)

    const request = new Request('http://localhost/api/dashboard')
    const response = await GET(request)

    expect(Registry.getDashboardData).toHaveBeenCalledWith('session-user')
    expect(response.status).toBe(200)
  })

  it('returns 400 when userId is missing', async () => {
    Registry.getCurrentUser.mockResolvedValueOnce({ userId: null })

    const request = new Request('http://localhost/api/dashboard')
    const response = await GET(request)
    const json = await response.json()

    expect(response.status).toBe(400)
    expect(json).toEqual({ error: 'User ID is required' })
  })

  it('handles errors gracefully', async () => {
    Registry.getCurrentUser.mockResolvedValueOnce({ userId: 'user-123' })
    Registry.getDashboardData.mockRejectedValueOnce(new Error('boom'))

    const request = new Request('http://localhost/api/dashboard')
    const response = await GET(request)

    expect(response.status).toBe(500)
  })
})
