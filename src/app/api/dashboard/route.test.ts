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
  },
}))

const { Registry } = require('@/registry') as {
  Registry: {
    getDashboardData: jest.Mock
  }
}

describe('GET /api/dashboard', () => {
  it('returns dashboard data for provided userId', async () => {
    const data = { concepts: [], stats: { total: 0 } }
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

  it('uses demo-user when userId is missing and handles errors', async () => {
    Registry.getDashboardData.mockRejectedValueOnce(new Error('boom'))

    const request = new Request('http://localhost/api/dashboard')
    const response = await GET(request)
    const json = await response.json()

    expect(Registry.getDashboardData).toHaveBeenCalledWith('demo-user')
    expect(response.status).toBe(500)
    expect(json).toEqual({ error: 'Failed to fetch dashboard data' })
  })
})
