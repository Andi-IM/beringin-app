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
    getNextQuestion: jest.fn(),
  },
}))

const { Registry } = require('@/registry') as {
  Registry: {
    getNextQuestion: jest.Mock
  }
}

describe('GET /api/session/next', () => {
  it('returns next question for provided userId', async () => {
    const question = { id: 'q1', prompt: 'Test?', conceptId: 'c1' }
    Registry.getNextQuestion.mockResolvedValueOnce(question)

    const request = new Request(
      'http://localhost/api/session/next?userId=user-123',
    )
    const response = await GET(request)
    const json = await response.json()

    expect(Registry.getNextQuestion).toHaveBeenCalledWith('user-123')
    expect(response.status).toBe(200)
    expect(json).toEqual(question)
  })

  it('uses demo-user when userId is missing and handles errors', async () => {
    Registry.getNextQuestion.mockRejectedValueOnce(new Error('error'))

    const request = new Request('http://localhost/api/session/next')
    const response = await GET(request)
    const json = await response.json()

    expect(Registry.getNextQuestion).toHaveBeenCalledWith('demo-user')
    expect(response.status).toBe(500)
    expect(json).toEqual({ error: 'Failed to fetch next question' })
  })
})
