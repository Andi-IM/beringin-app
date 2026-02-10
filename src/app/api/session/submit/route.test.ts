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
    submitAnswer: jest.fn(),
  },
}))

const { Registry } = require('@/registry') as {
  Registry: {
    submitAnswer: jest.Mock
  }
}

describe('POST /api/session/submit', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('validates payload and submits answer', async () => {
    const result = { status: 'ok' }
    Registry.submitAnswer.mockResolvedValueOnce(result)

    const body = {
      userId: 'user-1',
      conceptId: 'concept-1',
      questionId: 'question-1',
      userAnswer: 'answer',
      isCorrect: true,
      confidence: 'high',
      responseTime: 5,
    }

    const request = new Request('http://localhost/api/session/submit', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const response = await POST(request)
    const json = await response.json()

    expect(Registry.submitAnswer).toHaveBeenCalledWith(body)
    expect(response.status).toBe(200)
    expect(json).toEqual(result)
  })

  it('returns 400 when required fields are missing', async () => {
    const body = {
      conceptId: 'concept-1',
      questionId: 'question-1',
      isCorrect: true,
    }

    const request = new Request('http://localhost/api/session/submit', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const response = await POST(request)
    const json = await response.json()

    expect(Registry.submitAnswer).not.toHaveBeenCalled()
    expect(response.status).toBe(400)
    expect(json).toEqual({ error: 'Missing required fields' })
  })

  it('returns 500 when submitAnswer throws', async () => {
    Registry.submitAnswer.mockRejectedValueOnce(new Error('submit failed'))

    const body = {
      userId: 'user-1',
      conceptId: 'concept-1',
      questionId: 'question-1',
      userAnswer: 'answer',
      isCorrect: false,
      confidence: 'low' as const,
      responseTime: 10,
    }

    const request = new Request('http://localhost/api/session/submit', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const response = await POST(request)
    const json = await response.json()

    expect(Registry.submitAnswer).toHaveBeenCalledWith(body)
    expect(response.status).toBe(500)
    expect(json).toEqual({ error: 'Failed to submit answer' })
  })
})
