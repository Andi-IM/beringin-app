jest.mock('next/server', () => ({
  NextResponse: {
    json: (body: unknown, init?: { status?: number }) => ({
      status: init?.status ?? 200,
      json: async () => body,
    }),
  },
}))

import { POST } from './route'

jest.mock('@/registry', () => ({
  Registry: {
    seedInitialData: jest.fn(),
  },
}))

const { Registry } = require('@/registry') as {
  Registry: {
    seedInitialData: jest.Mock
  }
}

describe('POST /api/debug/seed', () => {
  it('seeds initial data successfully', async () => {
    Registry.seedInitialData.mockResolvedValueOnce(undefined)

    const response = await POST()
    const json = await response.json()

    expect(Registry.seedInitialData).toHaveBeenCalled()
    expect(response.status).toBe(200)
    expect(json).toEqual({ message: 'Seed data created successfully' })
  })

  it('returns 500 when seeding fails', async () => {
    Registry.seedInitialData.mockRejectedValueOnce(new Error('fail'))

    const response = await POST()
    const json = await response.json()

    expect(Registry.seedInitialData).toHaveBeenCalled()
    expect(response.status).toBe(500)
    expect(json).toEqual({ error: 'Failed to seed data' })
  })
})
