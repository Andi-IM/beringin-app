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
    getCurrentUser: jest.fn(),
  },
}))

const { Registry } = require('@/registry') as {
  Registry: {
    getNextQuestion: jest.Mock
    getCurrentUser: jest.Mock
  }
}

describe('GET /api/session/next', () => {
  it('returns next question for provided userId', async () => {
    const question = { id: 'q1', prompt: 'Test?', conceptId: 'c1' }
    Registry.getCurrentUser.mockResolvedValueOnce({ userId: null })
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

  it('uses session userId when available', async () => {
    const question = { id: 'q1', prompt: 'Test?', conceptId: 'c1' }
    Registry.getCurrentUser.mockResolvedValueOnce({ userId: 'session-user' })
    Registry.getNextQuestion.mockResolvedValueOnce(question)

    const request = new Request('http://localhost/api/session/next')
    const response = await GET(request)

    expect(Registry.getNextQuestion).toHaveBeenCalledWith('session-user')
    expect(response.status).toBe(200)
  })

  it('returns 400 when userId is missing', async () => {
    Registry.getCurrentUser.mockResolvedValueOnce({ userId: null })

    const request = new Request('http://localhost/api/session/next')
    const response = await GET(request)
    const json = await response.json()

    expect(response.status).toBe(400)
    expect(json).toEqual({ error: 'User ID is required' })
  })

  it('handles errors gracefully', async () => {
    Registry.getCurrentUser.mockResolvedValueOnce({ userId: 'user-123' })
    Registry.getNextQuestion.mockRejectedValueOnce(new Error('error'))

    const request = new Request('http://localhost/api/session/next')
    const response = await GET(request)

    expect(response.status).toBe(500)
  })
})
