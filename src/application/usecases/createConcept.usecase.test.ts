import { createConcept } from './createConcept.usecase'
import type { ConceptRepository } from '@/infrastructure/repositories/concept.repository'

describe('createConcept Use Case', () => {
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

  it('should create a new concept', async () => {
    // Arrange
    const data = {
      title: 'New Concept',
      description: 'New Description',
      category: 'General',
      userId: 'user-1',
    }

    const createdConcept = {
      id: '123',
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    mockRepo.create.mockResolvedValue(createdConcept)

    // Act
    const result = await createConcept(data, mockRepo)

    // Assert
    expect(mockRepo.create).toHaveBeenCalledWith(data)
    expect(result).toEqual(createdConcept)
  })

  it('should throw error if title is missing', async () => {
    // Arrange
    const data = {
      title: '',
      description: 'Desc',
      category: 'Cat',
      userId: 'user-1',
    }

    // Act & Assert
    await expect(createConcept(data, mockRepo)).rejects.toThrow(
      'Title is required',
    )
    expect(mockRepo.create).not.toHaveBeenCalled()
  })

  it('should throw error if description is missing', async () => {
    // Arrange
    const data = {
      title: 'Title',
      description: '',
      category: 'Cat',
      userId: 'user-1',
    }

    // Act & Assert
    await expect(createConcept(data, mockRepo)).rejects.toThrow(
      'Description is required',
    )
    expect(mockRepo.create).not.toHaveBeenCalled()
  })

  it('should throw error if category is missing', async () => {
    // Arrange
    const data = {
      title: 'Title',
      description: 'Description',
      category: '',
      userId: 'user-1',
    }

    // Act & Assert
    await expect(createConcept(data, mockRepo)).rejects.toThrow(
      'Category is required',
    )
    expect(mockRepo.create).not.toHaveBeenCalled()
  })
})
