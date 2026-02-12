import { deleteConcept } from './deleteConcept.usecase'
import type { ConceptRepository } from '@/infrastructure/repositories/concept.repository'

describe('deleteConcept Use Case', () => {
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

  it('should delete an existing concept', async () => {
    // Arrange
    const existingConcept = { id: '123', userId: 'user-1' }
    mockRepo.findById.mockResolvedValue(existingConcept as any)

    // Act
    await deleteConcept('123', mockRepo)

    // Assert
    expect(mockRepo.delete).toHaveBeenCalledWith('123')
  })

  it('should throw error if concept not found', async () => {
    // Arrange
    mockRepo.findById.mockResolvedValue(null)

    // Act & Assert
    await expect(deleteConcept('non-existent-id', mockRepo)).rejects.toThrow(
      'Concept not found',
    )
    expect(mockRepo.delete).not.toHaveBeenCalled()
  })
})
