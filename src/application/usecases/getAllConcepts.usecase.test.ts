import { getAllConcepts } from './getAllConcepts.usecase'
import type { ConceptRepository } from '@/infrastructure/repositories/concept.repository'
import type { Concept } from '@/domain/entities/concept.entity'

describe('getAllConcepts Use Case', () => {
  let mockRepo: jest.Mocked<ConceptRepository>

  beforeEach(() => {
    mockRepo = {
      findAll: jest.fn(),
      findAllByUserId: jest.fn(),
      findById: jest.fn(),
      findByCategory: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    }
  })

  it('should return all concepts for user', async () => {
    // Arrange
    const concepts: Concept[] = [
      {
        id: '1',
        title: 'Concept 1',
        description: 'Desc 1',
        category: 'Cat 1',
        userId: 'user-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        title: 'Concept 2',
        description: 'Desc 2',
        category: 'Cat 2',
        userId: 'user-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    mockRepo.findAllByUserId.mockResolvedValue(concepts)

    // Act
    const result = await getAllConcepts('user-1', mockRepo)

    // Assert
    expect(result).toHaveLength(2)
    expect(result[0].title).toBe('Concept 1')
    expect(result[1].title).toBe('Concept 2')
    expect(mockRepo.findAllByUserId).toHaveBeenCalledWith('user-1')
  })

  it('should return empty array if no concepts exist', async () => {
    // Arrange
    mockRepo.findAllByUserId.mockResolvedValue([])

    // Act
    const result = await getAllConcepts('user-1', mockRepo)

    // Assert
    expect(result).toHaveLength(0)
    expect(mockRepo.findAllByUserId).toHaveBeenCalledWith('user-1')
  })
})
