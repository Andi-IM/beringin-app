// Tests: KV Progress Repository

import { KVProgressRepository } from './kv-progress.repository'
import type { EdgeOneKV } from './edgeone-kv.types'

function createMockKV(): EdgeOneKV & { store: Map<string, string> } {
  const store = new Map<string, string>()
  return {
    store,
    get: jest.fn((key: string) => Promise.resolve(store.get(key) ?? null)),
    put: jest.fn((key: string, value: string) => {
      store.set(key, value)
      return Promise.resolve()
    }),
    delete: jest.fn((key: string) => {
      store.delete(key)
      return Promise.resolve()
    }),
    list: jest.fn((options?: { prefix?: string; limit?: number }) => {
      const allKeys = Array.from(store.keys())
      const filteredKeys = options?.prefix
        ? allKeys.filter((key) => key.startsWith(options.prefix as string))
        : allKeys
      const keys = filteredKeys.map((name) => ({ name }))
      return Promise.resolve({ keys })
    }),
  }
}

describe('KVProgressRepository', () => {
  let kv: ReturnType<typeof createMockKV>
  let repo: KVProgressRepository

  beforeEach(() => {
    kv = createMockKV()
    repo = new KVProgressRepository(kv)
  })

  it('should create and retrieve progress', async () => {
    const now = new Date()
    const progress = await repo.create({
      userId: 'user1',
      conceptId: 'concept1',
      status: 'new',
      nextReview: now,
      lastInterval: 0.007,
      easeFactor: 2.5,
      history: [],
    })

    expect(progress.userId).toBe('user1')
    expect(progress.createdAt).toBeInstanceOf(Date)

    const found = await repo.findByUserAndConcept('user1', 'concept1')
    expect(found).not.toBeNull()
    expect(found!.status).toBe('new')
  })

  it('should return null for non-existent progress', async () => {
    const found = await repo.findByUserAndConcept('user1', 'nonexistent')
    expect(found).toBeNull()
  })

  it('should find all progress by user ID', async () => {
    const now = new Date()
    await repo.create({
      userId: 'user1',
      conceptId: 'c1',
      status: 'new',
      nextReview: now,
      lastInterval: 0.007,
      easeFactor: 2.5,
      history: [],
    })
    await repo.create({
      userId: 'user1',
      conceptId: 'c2',
      status: 'learning',
      nextReview: now,
      lastInterval: 1,
      easeFactor: 2.3,
      history: [],
    })
    await repo.create({
      userId: 'user2',
      conceptId: 'c1',
      status: 'new',
      nextReview: now,
      lastInterval: 0.007,
      easeFactor: 2.5,
      history: [],
    })

    const user1Progress = await repo.findByUserId('user1')
    expect(user1Progress).toHaveLength(2)

    const user2Progress = await repo.findByUserId('user2')
    expect(user2Progress).toHaveLength(1)
  })

  it('should update progress', async () => {
    const now = new Date()
    await repo.create({
      userId: 'user1',
      conceptId: 'c1',
      status: 'new',
      nextReview: now,
      lastInterval: 0.007,
      easeFactor: 2.5,
      history: [],
    })

    const updated = await repo.update('user1', 'c1', { status: 'learning' })
    expect(updated.status).toBe('learning')
    expect(updated.easeFactor).toBe(2.5) // unchanged fields preserved
  })

  it('should throw when updating non-existent progress', async () => {
    await expect(
      repo.update('user1', 'bad-concept', { status: 'learning' }),
    ).rejects.toThrow('Progress not found')
  })

  it('should delete progress and update index', async () => {
    const now = new Date()
    await repo.create({
      userId: 'user1',
      conceptId: 'c1',
      status: 'new',
      nextReview: now,
      lastInterval: 0.007,
      easeFactor: 2.5,
      history: [],
    })

    await repo.delete('user1', 'c1')

    const found = await repo.findByUserAndConcept('user1', 'c1')
    expect(found).toBeNull()

    const byUser = await repo.findByUserId('user1')
    expect(byUser).toHaveLength(0)
  })

  it('should serialize and deserialize history with Date objects', async () => {
    const historyDate = new Date('2026-01-15T10:00:00Z')
    await repo.create({
      userId: 'user1',
      conceptId: 'c1',
      status: 'reviewing',
      nextReview: new Date(),
      lastInterval: 3,
      easeFactor: 2.5,
      history: [
        {
          date: historyDate,
          result: true,
          confidence: 'high',
          interval: 1,
          responseTime: 5,
        },
      ],
    })

    const found = await repo.findByUserAndConcept('user1', 'c1')
    expect(found).not.toBeNull()
    expect(found!.history).toHaveLength(1)
    expect(found!.history[0].date).toBeInstanceOf(Date)
    expect(found!.history[0].date.toISOString()).toBe(historyDate.toISOString())
    expect(found!.history[0].result).toBe(true)
    expect(found!.history[0].confidence).toBe('high')
  })

  it('should not duplicate concept in index on re-create', async () => {
    const now = new Date()
    await repo.create({
      userId: 'user1',
      conceptId: 'c1',
      status: 'new',
      nextReview: now,
      lastInterval: 0.007,
      easeFactor: 2.5,
      history: [],
    })

    // Delete and re-create
    await repo.delete('user1', 'c1')
    await repo.create({
      userId: 'user1',
      conceptId: 'c1',
      status: 'learning',
      nextReview: now,
      lastInterval: 1,
      easeFactor: 2.5,
      history: [],
    })

    const byUser = await repo.findByUserId('user1')
    expect(byUser).toHaveLength(1)
  })
})
