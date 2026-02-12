// Tests: KV Progress Repository

import { KVProgressRepository } from './kv-progress.repository'

describe('KVProgressRepository', () => {
  let repo: KVProgressRepository

  beforeEach(() => {
    repo = new KVProgressRepository()
    global.fetch = jest.fn()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should create and retrieve progress', async () => {
    const mockProgress = {
      userId: 'user1',
      conceptId: 'concept1',
      status: 'new',
      nextReview: new Date().toISOString(),
      lastInterval: 0.007,
      easeFactor: 2.5,
      history: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: mockProgress }),
    })

    const progress = await repo.create({
      userId: 'user1',
      conceptId: 'concept1',
      status: 'new',
      nextReview: new Date(),
      lastInterval: 0.007,
      easeFactor: 2.5,
      history: [],
    })

    expect(progress.userId).toBe('user1')
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: mockProgress }),
    })

    const found = await repo.findByUserAndConcept('user1', 'concept1')
    expect(found).not.toBeNull()
    expect(found!.status).toBe('new')
  })

  it('should return null for non-existent progress', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
    })

    const found = await repo.findByUserAndConcept('user1', 'nonexistent')
    expect(found).toBeNull()
  })

  it('should find all progress by user ID', async () => {
    const mockData = [
      {
        userId: 'user1',
        conceptId: 'c1',
        status: 'new',
        nextReview: new Date().toISOString(),
        lastInterval: 0.007,
        easeFactor: 2.5,
        history: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: mockData }),
    })

    const user1Progress = await repo.findByUserId('user1')
    expect(user1Progress).toHaveLength(1)
  })

  it('should update progress', async () => {
    const mockUpdated = {
      userId: 'user1',
      conceptId: 'c1',
      status: 'learning',
      nextReview: new Date().toISOString(),
      lastInterval: 1,
      easeFactor: 2.5,
      history: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: mockUpdated }),
    })

    const updated = await repo.update('user1', 'c1', { status: 'learning' })
    expect(updated.status).toBe('learning')
  })

  it('should record review leveraging Edge SM-2', async () => {
    const mockResult = {
      userId: 'user1',
      conceptId: 'c1',
      status: 'stable',
      nextReview: new Date().toISOString(),
      lastInterval: 4,
      easeFactor: 2.6,
      history: [
        {
          date: new Date().toISOString(),
          result: true,
          confidence: 'high',
          interval: 4,
          responseTime: 5,
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: mockResult }),
    })

    const result = await repo.recordReview('user1', 'c1', 5)
    expect(result.status).toBe('stable')
    expect(result.lastInterval).toBe(4)
  })

  it('should delete progress', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
    })

    await repo.delete('user1', 'c1')
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/edge-api/progress'),
      expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('"action":"delete"'),
      }),
    )
  })
})
