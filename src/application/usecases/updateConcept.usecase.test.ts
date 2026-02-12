import { updateConcept } from './updateConcept.usecase'
import type { ConceptRepository } from '@/infrastructure/repositories/concept.repository'
import type { Concept } from '@/domain/entities/concept.entity'

describe('updateConcept Use Case', () => {
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

  it('should update an existing concept', async () => {
    // Arrange
    const existingConcept: Concept = {
      id: '123',
      title: 'Old Title',
      description: 'Old Description',
      category: 'Old Category',
      userId: 'user-1',
      createdAt: new Date(),
      updatedAt: new Date(Date.now() - 1000),
    }

    const updateData = {
      title: 'New Title',
      description: 'New Description',
    }

    const updatedConcept = {
      ...existingConcept,
      ...updateData,
      updatedAt: new Date(),
    }

    mockRepo.findById.mockResolvedValue(existingConcept)
    mockRepo.update.mockResolvedValue(updatedConcept)

    // Act
    const result = await updateConcept('123', updateData, mockRepo)

    // Assert
    expect(mockRepo.findById).toHaveBeenCalledWith('123')
    expect(mockRepo.update).toHaveBeenCalledWith('123', updateData)
    expect(result.id).toBe('123')
    expect(result.title).toBe('New Title')
  })

  it('should throw error if concept not found', async () => {
    // Arrange
    mockRepo.findById.mockResolvedValue(null)

    // Act & Assert
    await expect(
      updateConcept('non-existent-id', { title: 'New' }, mockRepo),
    ).rejects.toThrow('Concept not found')
  })

  it('should validate title length', async () => {
    mockRepo.findById.mockResolvedValue({ id: '1', title: 'Old' } as any)
    await expect(updateConcept('1', { title: 'ab' }, mockRepo)).rejects.toThrow(
      'Title must be at least 3 characters',
    )
  })

  it('should validate description length', async () => {
    mockRepo.findById.mockResolvedValue({ id: '1', title: 'Old' } as any)
    await expect(
      updateConcept('1', { description: 'too short' }, mockRepo),
    ).rejects.toThrow('Description must be at least 10 characters')
  })

  it('should validate category presence', async () => {
    mockRepo.findById.mockResolvedValue({ id: '1', title: 'Old' } as any)
    await expect(
      updateConcept('1', { category: '' }, mockRepo),
    ).rejects.toThrow('Category is required')
  })
})
