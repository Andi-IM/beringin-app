// Tests: KV Concept Repository

import {
  KVConceptRepository,
  KVConceptProgressRepository,
} from './kv-concept.repository'
import type { ProgressRepository } from '../repositories/progress.repository'
import type { UserProgress } from '@/domain/entities/user-progress.entity'

describe('KVConceptRepository', () => {
  let repo: KVConceptRepository

  beforeEach(() => {
    repo = new KVConceptRepository()
    global.fetch = jest.fn()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should create and retrieve a concept', async () => {
    const mockConcept = {
      id: 'c1',
      title: 'TCP Handshake',
      description: 'Three-way handshake process',
      category: 'Networking',
      userId: 'user-kv',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: mockConcept }),
    })

    const concept = await repo.create({
      title: 'TCP Handshake',
      description: 'Three-way handshake process',
      category: 'Networking',
      userId: 'user-kv',
    })

    expect(concept.id).toBeDefined()
    expect(concept.title).toBe('TCP Handshake')
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: mockConcept }),
    })

    const found = await repo.findById(concept.id)
    expect(found).not.toBeNull()
    expect(found!.title).toBe('TCP Handshake')
  })

  it('should return null for non-existent concept', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
    })

    const found = await repo.findById('non-existent')
    expect(found).toBeNull()
  })

  it('should find all concepts', async () => {
    const mockData = [
      {
        id: '1',
        title: 'A',
        description: 'a',
        category: 'X',
        userId: 'user-kv',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        title: 'B',
        description: 'b',
        category: 'Y',
        userId: 'user-kv',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: mockData }),
    })

    const all = await repo.findAll()
    expect(all).toHaveLength(2)
  })

  it('should update a concept', async () => {
    const mockUpdated = {
      id: '1',
      title: 'New Title',
      description: 'old',
      category: 'X',
      userId: 'user-kv',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: mockUpdated }),
    })

    const updated = await repo.update('1', { title: 'New Title' })
    expect(updated.title).toBe('New Title')
  })

  it('should delete a concept', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
    })

    await repo.delete('1')
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/edge-api/concept'),
      expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('"action":"delete"'),
      }),
    )
  })
})

describe('KVConceptProgressRepository', () => {
  it('should return concepts with status from progress data', async () => {
    const conceptRepo = new KVConceptRepository()
    const mockConcept = {
      id: 'c1',
      title: 'Test',
      description: 'test',
      category: 'X',
      userId: 'user1',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    jest.spyOn(conceptRepo, 'findAll').mockResolvedValue([mockConcept])

    const mockProgressRepo: ProgressRepository = {
      findByUserAndConcept: jest.fn(),
      findByUserId: jest.fn().mockResolvedValue([
        {
          userId: 'user1',
          conceptId: 'c1',
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
})
