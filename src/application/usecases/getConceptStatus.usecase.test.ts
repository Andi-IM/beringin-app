import type { ConceptWithStatus } from '@/domain/entities/concept.entity'
import type { ConceptProgressRepository } from '@/infrastructure/repositories/concept.repository'
import { getConceptStatus, type GetConceptStatusInput, type GetConceptStatusOutput } from './getConceptStatus.usecase'

describe('getConceptStatus Use Case', () => {
  const mockConceptProgressRepo: jest.Mocked<ConceptProgressRepository> = {
    findConceptsWithStatus: jest.fn(),
    findDueConcepts: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return concepts and stats for user', async () => {
    const input: GetConceptStatusInput = {
      userId: 'user-1',
    }

    const mockConcepts: ConceptWithStatus[] = [
      {
        id: 'concept-1',
        title: 'Concept 1',
        description: 'Description 1',
        category: 'category-1',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        status: 'stable',
        easeFactor: 2.8,
        lastInterval: 21,
        nextReview: new Date('2024-01-22'),
      },
      {
        id: 'concept-2',
        title: 'Concept 2',
        description: 'Description 2',
        category: 'category-2',
        createdAt: new Date('2024-01-02'),
        updatedAt: new Date('2024-01-02'),
        status: 'learning',
        easeFactor: 2.5,
        lastInterval: 1,
        nextReview: new Date('2024-01-03'),
      },
      {
        id: 'concept-3',
        title: 'Concept 3',
        description: 'Description 3',
        category: 'category-3',
        createdAt: new Date('2024-01-03'),
        updatedAt: new Date('2024-01-03'),
        status: 'fragile',
        easeFactor: 2.3,
        lastInterval: 3,
        nextReview: new Date('2024-01-06'),
      },
    ]

    mockConceptProgressRepo.findConceptsWithStatus.mockResolvedValue(mockConcepts)

    const result = await getConceptStatus(input, mockConceptProgressRepo)

    expect(mockConceptProgressRepo.findConceptsWithStatus).toHaveBeenCalledWith('user-1')
    expect(result).toEqual({
      concepts: mockConcepts,
      stats: {
        total: 3,
        stable: 1,
        fragile: 1,
        learning: 1,
        lapsed: 0,
      },
    })
  })

  it('should return empty stats for user with no concepts', async () => {
    const input: GetConceptStatusInput = {
      userId: 'user-empty',
    }

    mockConceptProgressRepo.findConceptsWithStatus.mockResolvedValue([])

    const result = await getConceptStatus(input, mockConceptProgressRepo)

    expect(result).toEqual({
      concepts: [],
      stats: {
        total: 0,
        stable: 0,
        fragile: 0,
        learning: 0,
        lapsed: 0,
      },
    })
  })

  it('should correctly count lapsed concepts', async () => {
    const input: GetConceptStatusInput = {
      userId: 'user-2',
    }

    const mockConcepts: ConceptWithStatus[] = [
      {
        id: 'concept-1',
        title: 'Concept 1',
        description: 'Description 1',
        category: 'category-1',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        status: 'lapsed',
        easeFactor: 2.1,
        lastInterval: 7,
        nextReview: new Date('2024-01-08'),
      },
      {
        id: 'concept-2',
        title: 'Concept 2',
        description: 'Description 2',
        category: 'category-2',
        createdAt: new Date('2024-01-02'),
        updatedAt: new Date('2024-01-02'),
        status: 'new',
        easeFactor: 2.5,
      },
    ]

    mockConceptProgressRepo.findConceptsWithStatus.mockResolvedValue(mockConcepts)

    const result = await getConceptStatus(input, mockConceptProgressRepo)

    expect(result.stats.lapsed).toBe(1)
    expect(result.stats.total).toBe(2)
  })

  it('should handle concepts with different statuses correctly', async () => {
    const input: GetConceptStatusInput = {
      userId: 'user-mixed',
    }

    const mockConcepts: ConceptWithStatus[] = [
      { id: 'c1', title: 'C1', description: 'D1', category: 'cat1', createdAt: new Date(), updatedAt: new Date(), status: 'stable', easeFactor: 2.8, lastInterval: 21 },
      { id: 'c2', title: 'C2', description: 'D2', category: 'cat2', createdAt: new Date(), updatedAt: new Date(), status: 'fragile', easeFactor: 2.3, lastInterval: 7 },
      { id: 'c3', title: 'C3', description: 'D3', category: 'cat3', createdAt: new Date(), updatedAt: new Date(), status: 'learning', easeFactor: 2.5, lastInterval: 1 },
      { id: 'c4', title: 'C4', description: 'D4', category: 'cat4', createdAt: new Date(), updatedAt: new Date(), status: 'lapsed', easeFactor: 2.1, lastInterval: 3 },
      { id: 'c5', title: 'C5', description: 'D5', category: 'cat5', createdAt: new Date(), updatedAt: new Date(), status: 'reviewing', easeFactor: 2.6, lastInterval: 14 },
    ]

    mockConceptProgressRepo.findConceptsWithStatus.mockResolvedValue(mockConcepts)

    const result = await getConceptStatus(input, mockConceptProgressRepo)

    expect(result.stats).toEqual({
      total: 5,
      stable: 1,
      fragile: 1,
      learning: 1,
      lapsed: 1,
    })
  })

  it('should call repository with correct userId', async () => {
    const input: GetConceptStatusInput = {
      userId: 'specific-user-id',
    }

    mockConceptProgressRepo.findConceptsWithStatus.mockResolvedValue([])

    await getConceptStatus(input, mockConceptProgressRepo)

    expect(mockConceptProgressRepo.findConceptsWithStatus).toHaveBeenCalledTimes(1)
    expect(mockConceptProgressRepo.findConceptsWithStatus).toHaveBeenCalledWith('specific-user-id')
  })
})