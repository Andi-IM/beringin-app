// Tests: KV Concept Repository

import {
  KVConceptRepository,
  KVConceptProgressRepository,
} from './kv-concept.repository'
import type { EdgeOneKV } from './edgeone-kv.types'
import type { ProgressRepository } from '../repositories/progress.repository'
import type { UserProgress } from '@/domain/entities/user-progress.entity'

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
    list: jest.fn(
      (options?: { prefix?: string; limit?: number }) => {
        const allKeys = Array.from(store.keys())
        const filteredKeys = options?.prefix
          ? allKeys.filter((key) => key.startsWith(options.prefix as string))
          : allKeys
        const keys = filteredKeys.map((name) => ({ name }))
        return Promise.resolve({ keys })
      },
    ),
  }
}

describe('KVConceptRepository', () => {
  let kv: ReturnType<typeof createMockKV>
  let repo: KVConceptRepository

  beforeEach(() => {
    kv = createMockKV()
    repo = new KVConceptRepository(kv)
  })

  it('should create and retrieve a concept', async () => {
    const concept = await repo.create({
      title: 'TCP Handshake',
      description: 'Three-way handshake process',
      category: 'Networking',
    })

    expect(concept.id).toBeDefined()
    expect(concept.title).toBe('TCP Handshake')
    expect(concept.createdAt).toBeInstanceOf(Date)

    const found = await repo.findById(concept.id)
    expect(found).not.toBeNull()
    expect(found!.title).toBe('TCP Handshake')
  })

  it('should return null for non-existent concept', async () => {
    const found = await repo.findById('non-existent')
    expect(found).toBeNull()
  })

  it('should find all concepts', async () => {
    await repo.create({ title: 'A', description: 'a', category: 'X' })
    await repo.create({ title: 'B', description: 'b', category: 'Y' })

    const all = await repo.findAll()
    expect(all).toHaveLength(2)
  })

  it('should find concepts by category', async () => {
    await repo.create({ title: 'A', description: 'a', category: 'Net' })
    await repo.create({ title: 'B', description: 'b', category: 'Security' })
    await repo.create({ title: 'C', description: 'c', category: 'Net' })

    const net = await repo.findByCategory('Net')
    expect(net).toHaveLength(2)
  })

  it('should update a concept', async () => {
    const concept = await repo.create({
      title: 'Old Title',
      description: 'old',
      category: 'X',
    })

    const updated = await repo.update(concept.id, { title: 'New Title' })
    expect(updated.title).toBe('New Title')
    expect(updated.description).toBe('old')
  })

  it('should throw when updating non-existent concept', async () => {
    await expect(repo.update('bad-id', { title: 'X' })).rejects.toThrow(
      'Concept not found',
    )
  })

  it('should delete a concept and remove from index', async () => {
    const concept = await repo.create({
      title: 'To Delete',
      description: 'd',
      category: 'X',
    })

    await repo.delete(concept.id)

    const found = await repo.findById(concept.id)
    expect(found).toBeNull()

    const all = await repo.findAll()
    expect(all).toHaveLength(0)
  })
})

describe('KVConceptProgressRepository', () => {
  it('should return concepts with status from progress data', async () => {
    const kv = createMockKV()
    const conceptRepo = new KVConceptRepository(kv)
    const concept = await conceptRepo.create({
      title: 'Test',
      description: 'test',
      category: 'X',
    })

    const mockProgressRepo: ProgressRepository = {
      findByUserAndConcept: jest.fn(),
      findByUserId: jest.fn().mockResolvedValue([
        {
          userId: 'user1',
          conceptId: concept.id,
          status: 'learning',
          nextReview: new Date(),
          lastInterval: 1,
          easeFactor: 2.5,
          history: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        } as UserProgress,
      ]),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    }

    const progressRepo = new KVConceptProgressRepository(
      conceptRepo,
      mockProgressRepo,
    )
    const result = await progressRepo.findConceptsWithStatus('user1')

    expect(result).toHaveLength(1)
    expect(result[0].status).toBe('learning')
  })

  it('should return due concepts', async () => {
    const kv = createMockKV()
    const conceptRepo = new KVConceptRepository(kv)
    const concept = await conceptRepo.create({
      title: 'Due',
      description: 'due concept',
      category: 'X',
    })

    const pastDate = new Date(Date.now() - 86400000) // yesterday

    const mockProgressRepo: ProgressRepository = {
      findByUserAndConcept: jest.fn(),
      findByUserId: jest.fn().mockResolvedValue([
        {
          userId: 'user1',
          conceptId: concept.id,
          status: 'reviewing',
          nextReview: pastDate,
          lastInterval: 1,
          easeFactor: 2.5,
          history: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        } as UserProgress,
      ]),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    }

    const progressRepo = new KVConceptProgressRepository(
      conceptRepo,
      mockProgressRepo,
    )
    const due = await progressRepo.findDueConcepts('user1')

    expect(due).toHaveLength(1)
    expect(due[0].title).toBe('Due')
  })
})
